import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { codeBlock, oneLine } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer";
import {
  Configuration,
  OpenAIApi,
  CreateModerationResponse,
  CreateEmbeddingResponse,
  ChatCompletionRequestMessage,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ApplicationError, UserError } from "@/lib/errors";
import { PageChunks } from "@prisma/client";
import { QueryResultRow, sql } from "@vercel/postgres";

const openAiKey = process.env.OPENAI_API_KEY;

const minSimilarity = ".78";

const config = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export const POST = async (req: NextRequest) => {
  try {
    if (!openAiKey) {
      throw new ApplicationError("Missing environment variable OPENAI_KEY");
    }

    const requestData = await req.json();

    if (!requestData) {
      throw new UserError("Missing request data");
    }

    const { query } = requestData;

    if (!query) {
      throw new UserError("Missing query in request data");
    }

    // Create embedding from query
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: query.replaceAll("\n", " "),
    });

    if (embeddingResponse.status !== 200) {
      throw new ApplicationError(
        "Failed to create embedding for question",
        embeddingResponse
      );
    }

    const {
      data: [{ embedding }],
    }: CreateEmbeddingResponse = await embeddingResponse.json();

    const vectorQuery = `[${embedding.join(",")}]`;
    const chunks = await sql`
      SELECT
        "pageId",
        id,
        meta,
        document,
        1 - (embedding <=> ${vectorQuery}::vector) AS similarity
      FROM page_chunks
      WHERE 1 - (embedding <=> ${vectorQuery}::vector) > ${minSimilarity}
      ORDER BY similarity DESC
      LIMIT 20;
    `;

    // group chunks by pageId:
    const groupedChunks = chunks.rows.reduce(
      (acc: Record<string, QueryResultRow>, chunk: QueryResultRow) => {
        if (acc[chunk.pageId]) {
          return acc;
        }
        acc[chunk.pageId] = chunk;
        return acc;
      },
      {}
    );

    const results = Object.values(groupedChunks).map(
      (chunk: QueryResultRow) => {
        let excerpt: string = chunk.document
          .split("pageUrl:")?.[1]
          ?.substring(0, 500);
        return {
          title: chunk.meta.pageTitle,
          url: chunk.meta.pageUrl,
          excerpt,
          score: chunk.similarity,
        };
      }
    );

    return Response.json({ results });
  } catch (err: unknown) {
    if (err instanceof UserError) {
      return NextResponse.json(
        {
          error: err.message,
          data: err.data,
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (err instanceof ApplicationError) {
      // Print out application errors with their additional data
      console.error(`${err.message}: ${JSON.stringify(err.data)}`);
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err);
    }

    return NextResponse.json(
      {
        error: "There was an error processing your request",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
