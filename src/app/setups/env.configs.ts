import { Elysia, t } from "elysia";
import { env } from "@yolk-oss/elysia-env";

export const envConfig = () =>
  env({
    SECRET_ENCRYPT: t.String({
      minLength: 12,
      error: "encrypt password credentials!",
    }),
    JWT_SECRET: t.String({
      minLength: 12,
      error: "JWT token credentials!",
    }),
    DATABASE_URL: t.String({
      error:
        "db credentials -> `https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/connect-your-database-node-mongodb`",
    }),
    APP_URL_DEV: t.String({
      error: "dev -> asset url",
    }),
    APP_URL_PROD: t.String({
      error: "prod -> asset url",
    }),
  });
