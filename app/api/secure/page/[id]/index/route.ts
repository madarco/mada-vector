import { UserError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import {
  Document,
  IngestionPipeline,
  MarkdownNodeParser,
  OpenAIEmbedding,
  SimpleNodeParser,
  storageContextFromDefaults,
} from "llamaindex";

import { PgVectorStorePrisma } from "@/lib/pgPrismaStore";
import * as cheerio from "cheerio";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from "node-html-markdown";
import * as fs from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openAiKey = process.env.OPENAI_API_KEY;
const pgUrl = process.env.POSTGRES_URL;
const pgSchema = process.env.POSTGRES_DATABASE;

const CHUNK_SIZE = 1024;
const MAX_CHUNKS = 20;

export const POST = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (!id) {
    throw new UserError("Missing Page id");
  }
  if (!openAiKey) {
    throw new UserError("Missing environment variable OPENAI_API_KEY");
  }
  if (!pgUrl) {
    throw new UserError("Missing environment variable POSTGRES_URL");
  }
  if (!pgSchema) {
    throw new UserError("Missing environment variable POSTGRES_DATABASE");
  }

  const page = await prisma.page.findFirstOrThrow({
    where: {
      id,
    },
  });

  //Fetch page content:
  const response = await fetch(page.url);
  const html = await response.text();

  const $ = cheerio.load(html);
  const title = $("title").text();
  await prisma.page.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });

  // Strip links:
  $("a").attr("href", "");

  const body = $("body").html()?.toString();
  if (!body) {
    throw new UserError("No body content found in page");
  }
  let content = NodeHtmlMarkdown.translate(body, {
    ignore: ["script", "style", "noscript", "svg", "img"],
    keepDataImages: false,
    useLinkReferenceDefinitions: true,
    useInlineLinks: false,
  });

  if (!content) {
    throw new UserError("No content found in page");
  }

  if (content.length > CHUNK_SIZE * MAX_CHUNKS) {
    console.warn("Content too large, truncating");
    content = content.slice(0, CHUNK_SIZE * MAX_CHUNKS);
  }

  console.log("Indexing page", page.url, title, content.length);
  // write content to file to debug:
  //fs.writeFileSync("page.md", content);

  const vectorStore = new PgVectorStorePrisma();
  const storageContext = await storageContextFromDefaults({ vectorStore });
  const pipeline = new IngestionPipeline({
    vectorStore: storageContext.vectorStore,
    transformations: [
      new SimpleNodeParser({
        chunkSize: CHUNK_SIZE,
        chunkOverlap: 20,
        includeMetadata: true,
      }),
      new OpenAIEmbedding({ apiKey: openAiKey }),
    ],
  });

  const doc = new Document({
    text: content,
    id_: page.id,
    metadata: {
      pageId: page.id,
      pageUrl: page.url,
      pageTitle: title,
    },
  });
  const nodes = await pipeline.run({ documents: [doc] });

  return Response.json({ page, nodes: nodes.length });
};
