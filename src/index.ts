import { Elysia, t } from "elysia";

import { log } from "./app/setups/logger.configs";

import swagger from "@elysiajs/swagger";
import { rateLimit } from "elysia-rate-limit";
import { ElysiaSwaggerConfig } from "@elysiajs/swagger/dist/types";
import type { OpenAPIV3 } from "openapi-types";
import { SwaggerConfig } from "./app/setups/swagger.configs";
import { envConfig } from "./app/setups/env.configs";
import { PrismaClient } from "@prisma/client";
import { prismaInit } from "./database/prisma.db";
import { Log } from "./app/libs/log.utils";
import { Routes } from "./routes/routes";
import { jwtConfig } from "./app/setups/jwt.configs";
import { compression } from "elysia-compression";
import { helmet } from "elysia-helmet";
import { helmetConfig } from "./app/setups/helmet.configs";
import { errorConfig } from "./app/setups/errors.configs";
import { RateLimitConfigs } from "./app/setups/rate_limit.configs";
import { MailMain } from "./mail/mail.main";
import staticPlugin from "@elysiajs/static";
import { StorageMain } from "./app/storages/storage.main";

const encoder = new TextEncoder();
export type AppType = typeof app;

// init setup
const app = new Elysia()
  .decorate("prisma", prismaInit(true)) // db orm
  .decorate("mail", new MailMain()) // mail provider
  .decorate("storage", new StorageMain().init()) // storage provider
  .use(compression()) // response compression
  .use(helmetConfig()) // handdle headers -> security reason
  .use(envConfig()) // env requirement
  .use(staticPlugin({ prefix: "/assets" })) // static public
  .use(log()) // logger
  .use(RateLimitConfigs) // rate limiter
  .use(new SwaggerConfig().init()) // swagger
  .use(jwtConfig()) // jwt -> auth bearer
  .use(errorConfig); // handle error response

// .mapResponse(({ response, set, headers, request }) => {
//   const isJson = typeof response === "object" || true;
//   const { statusCode } = headers;

//   // Log.error(request.method, { title: "plpl" });

//   const text = isJson
//     ? JSON.stringify({ statusCode: set.status, ...{ test: "asd" } })
//     : response?.toString() ?? "";

//   set.headers["Content-Encoding"] = "gzip";

//   return new Response(Bun.gzipSync(encoder.encode(text)), {
//     headers: {
//       "Content-Type": `${
//         isJson ? "application/json" : "text/plain"
//       }; charset=utf-8`,
//     },
//   });
// })

// route register
new Routes(app);

// publish
app.listen(process.env.PORT ?? 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
