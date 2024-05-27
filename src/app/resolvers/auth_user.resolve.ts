import { NotFoundError } from "elysia";
import {
  AuthUserResolveResponse,
  AuthUserResolveType,
} from "../../types/resolver.types";
import { UnauthorizedError } from "../exceptions/400/unauthorized.error";

export const authUserResolve: AuthUserResolveType<{
  credentials: AuthUserResolveResponse;
}> = async ({ jwt, headers, prisma }) => {
  const { authorization: ref } = headers;

  // cut bearer marks
  const token: string = (typeof ref == "string" ? ref : "").slice(7);

  // decrypt token -> credentials [any]
  const decryptToken = await jwt.verify(token);

  // parse to object
  const parseToObject = typeof decryptToken == "object" ? decryptToken : {};

  //   validate credentials
  const credentials = !parseToObject.id
    ? null
    : await prisma.mUsers.findFirst({
        where: { id: parseToObject.id },
        select: {
          id: true,
          username: true,
          information: { select: { id: true } },
          roles: { select: { roleId: true } },
        },
      });

  if (!token.length || !decryptToken || !credentials) {
    throw new UnauthorizedError();
  }

  return {
    credentials,
  };
};
