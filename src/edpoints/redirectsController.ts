import { createRedirect, getRedirect } from "../data";
import { badRequest, jsonResponse, log } from "../utils";
import { protectedRoutes } from "../utils";

const TAG = "redirectsController";

const getRedirectsHandler = async (
  slug: string,
  request: Request
): Promise<Response> => {
  const to = await getRedirect(slug);
  if (!to) {
    return jsonResponse({ msg: "Redirect not found" }, 404);
  }

  return jsonResponse({ to }, 200);
};

const validateSlug = (slug: string): boolean => {
  return (
    slug !== null &&
    typeof slug === "string" &&
    slug.length > 0 &&
    slug.indexOf("/") === -1
  );
};

const postRedirectsHandler = async (
  slug: string,
  request: Request
): Promise<Response> => {
  const { headers } = request;
  const contentType = headers.get("Content-Type");

  if (!request.body || contentType !== "application/json") {
    return badRequest("Missing body");
  }

  const body: any = await request.json().catch(() => {});
  const to = body?.to;
  if (!to || typeof to !== "string" || to.length === 0) {
    return badRequest("Validation of property 'to' failed");
  }
  if (!validateSlug(slug)) {
    return badRequest("invalid slug");
  }
  if (protectedRoutes.includes("/" + to)) {
    return jsonResponse({ msg: "This route is reserved" }, 403);
  }

  const success = await createRedirect(slug, to);
  if (success) {
    return jsonResponse({ redirect: { from: slug, to } }, 200);
  }

  return jsonResponse({ msg: "This route is taken" }, 403);
};

export const redirectsApi = async (
  pathname: string,
  method: string,
  request: Request
): Promise<Response> => {
  log(TAG, pathname, method, request);

  const parts = pathname.split("/");
  if (parts.length !== 3 || parts[2] === "") {
    return badRequest("Invalid slug");
  }
  const slug = parts[2];

  switch (method) {
    case "GET":
      return getRedirectsHandler(slug, request);
    case "POST":
      return postRedirectsHandler(slug, request);
    default:
      return badRequest(`Method ${method} not supported`);
  }
};
