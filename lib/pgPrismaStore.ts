import {
  BaseNode,
  Metadata,
  MetadataMode,
  VectorStore,
  VectorStoreQuery,
  VectorStoreQueryResult,
} from "llamaindex";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export class PgVectorStorePrisma implements VectorStore {
  constructor() {}
  storesText = true;
  isEmbeddingQuery = true;
  client() {
    return null;
  }

  async add(embeddingResults: BaseNode<Metadata>[]): Promise<string[]> {
    const results: string[] = [];

    const pageIds = new Set(embeddingResults.map((r) => r.metadata.pageId));
    if (pageIds.size === 0) {
      throw new Error("No page ids found in metadata");
    }

    // Clear previous embeddings for this page
    prisma.pageChunks.deleteMany({
      where: {
        pageId: {
          in: Array.from(pageIds),
        },
      },
    });

    for (const row of embeddingResults) {
      if (!row.metadata.pageId) {
        console.warn("No pageId found in metadata", row.metadata);
        continue;
      }
      //console.log("Inserting", { pageId: row.metadata.pageId });
      const embedding = row.getEmbedding();
      
      const node = await prisma.pageChunks.create({
        data: {
          page: { connect: { id: row.metadata.pageId } },
          document: row.getContent(MetadataMode.EMBED),
          meta: row.metadata || {},
        },
      });

      // Add the embedding
      const embeddingSql = `[${embedding.join(',')}]`
      await prisma.$executeRaw`
            UPDATE page_chunks
            SET embedding = ${embeddingSql}::vector
            WHERE id = ${node.id}
            `;
      results.push(node.id);
    }
    return results;
  }
  delete(refDocId: string, deleteOptions?: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  query(
    query: VectorStoreQuery,
    options?: any
  ): Promise<VectorStoreQueryResult> {
    throw new Error("Method not implemented.");
  }
}
