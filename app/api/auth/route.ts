export const GET = async (req: Request, res: Response) => {
  return Response.json(
    {},
    {
      status: 401,
      headers: { "WWW-authenticate": 'Basic realm="Secure Area"' },
    }
  );
};
