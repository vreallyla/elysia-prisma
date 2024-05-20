import { TSchema } from "elysia";
import { JwtType, PrismaType } from "./setup.types";

export type authGuardType = {
  headers: any;
  response: Record<number, TSchema>;
  beforeHandle?: (params: {
    jwt: JwtType;
    headers: Record<string, any>;
    prisma: PrismaType;
  }) => Promise<void>;
};
