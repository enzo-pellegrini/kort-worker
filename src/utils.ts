export const jsonResponse = async (body: any, statusCode: number) =>
  new Response(JSON.stringify(body), { status: statusCode });

export const badRequest = (err?: string) =>
  jsonResponse(
    {
      msg: "Bad Request" + (!!err ? `, ${err}` : ""),
    },
    400
  );

export const protectedRoutes = ["/", "/index.html", "/favicon.ico"];

export const log = (tag: string, ...args: any[]) =>
  console.log(tag, ...args);
