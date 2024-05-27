import { Elysia, t } from "elysia";
import { env } from "@yolk-oss/elysia-env";

export const envConfig = () =>
  env({
    APP_NAME: t.String(),
    DEBUG_MODE: t.Optional(t.Boolean()),

    SECRET_ENCRYPT: t.String({
      minLength: 12,
      error: "encrypt password credentials!",
    }),

    // START: JWT
    JWT_SECRET: t.String({
      minLength: 12,
      error: "JWT token credentials!",
    }),
    JWT_EXPIRES_IN: t.Optional(t.String()),
    // END: JWT

    // START: DB
    DATABASE_URL: t.String({
      error:
        "db credentials -> `https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/connect-your-database-node-mongodb`",
    }),
    // END: DB

    //START: MAIL PROVIDER
    MAIL_PROVIDER: t.Optional(
      t.Enum(
        { smtp: "smtp", mailgun: "mailgun" },
        { error: "fill with 'smtp' or 'mailgun'" }
      )
    ),
    SMTP_HOST: t.Optional(t.String()),
    SMTP_USER: t.Optional(t.String()),
    SMTP_PASSWORD: t.Optional(t.String()),
    SMTP_PORT: t.Optional(t.Number()),
    SMTP_ENCRYPT: t.Optional(t.String()),
    MAILGUN_AUTHORIZATION: t.Optional(t.String()),
    MAILGUN_ENDPOINT: t.Optional(t.String()),
    //END: MAIL PROVIDER

    // START: INIT URL
    APP_URL_DEV: t.String({
      error: "dev -> asset url",
    }),
    APP_URL_PROD: t.String({
      error: "prod -> asset url",
    }),
    // END: INIT URL
  });
