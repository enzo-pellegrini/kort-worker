/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { redirectsApi } from "./edpoints/redirectsController";
import { redirectUser } from "./edpoints/redirectUser";
import { protectedRoutes } from "./utils";

declare global {
  const BASE_PATH: string
}

const handleRequest = (request: Request): Promise<Response> => {
  const { url, method } = request;
  const { pathname } = new URL(url);

  if (pathname.startsWith("/redirects")) {
    return redirectsApi(pathname, method, request);
  }

  if (protectedRoutes.includes(pathname)) {
    return fetch(BASE_PATH + pathname);
  }

  return redirectUser(pathname, method);
};

addEventListener("fetch", (event) =>
  event.respondWith(
    handleRequest(event.request).catch(
      () => new Response("Internal Server Error", { status: 500 })
    )
  )
);
