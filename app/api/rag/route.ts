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
import { sql } from "@vercel/postgres";

const openAiKey = process.env.OPENAI_API_KEY;

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

    const { prompt: query } = requestData;

    if (!query) {
      throw new UserError("Missing query in request data");
    }

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = query.trim();
    const moderationResponse: CreateModerationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res: any) => res.json());

    const [results] = moderationResponse.results;

    if (results.flagged) {
      throw new UserError("Flagged content", {
        flagged: true,
        categories: results.categories,
      });
    }

    // Create embedding from query
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: sanitizedQuery.replaceAll("\n", " "),
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
        id,
        document,
        1 - (embedding <=> ${vectorQuery}::vector) AS similarity
      FROM page_chunks
      where 1 - (embedding <=> ${vectorQuery}::vector) > .5
      
      ORDER BY similarity DESC
      LIMIT 8;
    `;

    if (!chunks) {
      throw new ApplicationError("Failed to match page sections");
    }

    const pageSections = chunks.rows;

    const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
    let tokenCount = 0;
    let contextText = "";

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i];
      const content = pageSection.document;
      const encoded = tokenizer.encode(content);
      tokenCount += encoded.text.length;

      if (tokenCount >= 1500) {
        break;
      }

      contextText += `${content.trim()}\n---\n`;
    }

    const prompt = codeBlock`
      ${oneLine`
        You are a very enthusiastic representative who loves
        to help people! Given the following sections from a documentation, 
        answer the question using only that information,
        outputted in markdown format. If you are unsure and the answer
        is not explicitly written in the documentation, say
        "Sorry, I don't know how to help with that."
      `}

      Rules:
      - Answer as markdown (including related code snippets if available), don't include and Answer section, just the content.
      - Include at the end the sources used, use a link to the url contained in the pageUrl of the best matched document, with the link text of the pageTitle.
      - Do not include any sources if not applicable or unsure.

      Context sections:
      ${contextText}

      Question: """
      ${sanitizedQuery}
      """
    `;

    const chatMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: prompt,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [chatMessage],
      max_tokens: 512,
      temperature: 0,
      stream: true,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApplicationError("Failed to generate completion", error);
    }

    // Transform the response into a readable stream
    const stream = OpenAIStream(response);

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
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
