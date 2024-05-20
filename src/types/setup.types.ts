import { JWTPayloadSpec } from "@elysiajs/jwt";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type PrismaType = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  DefaultArgs
>;

export type JwtSignType = (
  morePayload: Record<string, any> & JWTPayloadSpec
) => Promise<string>;

export type JwtVerifyType = (
  jwt?: string | undefined
) => Promise<false | (Record<string, any> & JWTPayloadSpec)>;

export type JwtType = {
  readonly verify: JwtVerifyType;
  readonly sign: JwtSignType;
};
