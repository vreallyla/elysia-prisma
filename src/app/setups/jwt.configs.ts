import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const jwtConfig = () =>
  jwt({
    name: "jwt",
    secret: Bun.env.JWT_SECRET ?? "secret",
  });
