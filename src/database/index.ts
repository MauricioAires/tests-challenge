import { Connection, createConnection, getConnectionOptions } from "typeorm";

// (async () => await createConnection())();

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  Object.assign(defaultOptions, {
    host: process.env.NODE_ENV === "test" ? "localhost" : "database",
  });

  return await createConnection(defaultOptions);
};
