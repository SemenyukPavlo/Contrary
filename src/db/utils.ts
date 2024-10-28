import { DataSource } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";
import { ObjectLiteral } from "typeorm/common/ObjectLiteral";

import connection from "@/db/typeorm-config";

export const getDBConnection = async (): Promise<DataSource> => {
  if (!connection.isInitialized) {
    await connection.initialize();
  }

  return connection;
};

export const getRepo = async <K extends ObjectLiteral>(entity: EntityTarget<K>) =>
  getDBConnection().then((c) => c.getRepository(entity));
