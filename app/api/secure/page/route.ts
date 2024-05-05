import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  if (!data.url) {
    throw new UserError("Missing request data");
  }
  const page = await prisma.page.create({
    data: {
      url: data.url,
    },
  });
  return NextResponse.json({ page });
};

export const GET = async (req: NextRequest) => {
  const pages = await prisma.page.findMany({
    include: {
      pageChunks: {
        take: 1,
      },
    },
  });
  return NextResponse.json({ pages });
};
