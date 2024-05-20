import Elysia from "elysia";
import { rateLimit } from "elysia-rate-limit";

export const RateLimitConfigs = (app: Elysia) =>
  app.use(
    rateLimit({
      responseCode: 429,
      responseMessage: {
        type: "TO_MANY_REQUEST",
        message: "Wait a moment, request limit exceeded",
      },
    })
  );
