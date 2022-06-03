import { PrismaClient } from "@prisma/client";
import { log } from "./utils";

const TAG = "db"

let _client: any;
const client = () => {
  if (!_client) {
    _client = new PrismaClient();
  }
  return _client;
}

export const getRedirect = async (id: string): Promise<string | null> => {
  log(TAG, "getRedirect", id);
  
  const record = await client().redirect.findFirst({
    where: {
      id,
    },
  });

  return record?.to ?? null;
};

export const createRedirect = async (id: string, to: string): Promise<Boolean> => {
  log(TAG, "createRedirect", id);

  const record = await client().redirect.findFirst({
    where: {
      id,
    },
  });
  if (!!record) {
    return false;
  }

  await client().redirect.create({
    data: {
      id,
      to,
    },
  });
  return true;
};