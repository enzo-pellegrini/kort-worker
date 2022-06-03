import { getRedirect } from "../db";
import { badRequest, jsonResponse, log } from "../utils";

const TAG = "redirectUser";

export const redirectUser = async (
  pathname: string,
  method: string
): Promise<Response> => {
  log(TAG, pathname, method);

  if (method !== "GET") {
    return badRequest("Method not supported");
  }

  const from = pathname.substring(1);
  if (from.length < 1) {
    return badRequest("Invalid 'from'");
  }

  const to = await getRedirect(from);
  if (to !== null) {
    return Response.redirect(to, 301);
  }

  return jsonResponse({ msg: "Redirect not found" }, 404);
};
