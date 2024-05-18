import prisma from "../lib/prisma";
import { Page } from "./seeds/_Page__202405181549.json";
import { page_chunks } from './seeds/page_chunks_202405181550.json'

if (!process.env.POSTGRES_URL) {
  throw new Error("process.env.POSTGRES_URL is not defined. Please set it.");
}

async function main() {
  if (await prisma.page.findFirst()) {
    console.log("DB not empty. Skipping.");
    return;
  }

  for (const page of Page) {
    console.log("page", page.id)
    await prisma.page.create({
      data: {
        id: page.id,
        url: page.url,
        title: page.title,
      },
    });
  }


  for(const page_chunk of page_chunks) {
    const chunk = await prisma.pageChunks.create({
      data: {
        id: page_chunk.id,
        pageId: page_chunk.pageId,
        meta: JSON.parse(page_chunk.meta),
        document: page_chunk.document,
      },
    })
    await prisma.$executeRaw`
          UPDATE page_chunks
          SET embedding = ${page_chunk.embedding}::vector
          WHERE id = ${chunk.id}
    `;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

