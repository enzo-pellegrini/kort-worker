import { log } from "./utils";

declare global {
  const REDIRECTS: KVNamespace;
}

const TAG = "kv";

export const kvGetRedirect = (id: string): Promise<string | null> => {
  log(TAG, "kvGetRedirect", id);
  return REDIRECTS.get(id);
};

export const kvSaveRedirect = (id: string, to: string): Promise<void> => {
  log(TAG, "kvSaveRedirect", id, to);
  return REDIRECTS.put(id, to);
}
