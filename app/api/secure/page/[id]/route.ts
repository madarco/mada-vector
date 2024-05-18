import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (!id) {
    throw new UserError("Missing Page id");
  }
  await prisma.pageChunks.deleteMany({
    where: {
      pageId: id,
    },
  });
  const page = await prisma.page.delete({
    where: {
      id,
    },
  });

  return Response.json({ page });
};
