import { MaybePromise } from "elysia";
import { JwtType, PrismaType } from "./setup.types";

export type AuthUserResolveResponse = {
  id: string;
  username: string;
  information: { id: string } | null;
  roles: {
    roleId: string;
  }[];
} | null;

export type AuthUserResolveType<T> = (params: {
  jwt: JwtType;
  headers: Record<string, any>;
  prisma: PrismaType;
}) => MaybePromise<T>;
