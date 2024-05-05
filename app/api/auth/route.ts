import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest, res: NextResponse) => {
  return NextResponse.json(
    {},
    {
      status: 401,
      headers: { "WWW-authenticate": 'Basic realm="Secure Area"' },
    }
  );
};
