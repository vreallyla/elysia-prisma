import { t } from "elysia";
import { authGuardType } from "../../../types/model.types";
import { errorModels } from "../responses/error.models";

export const authGuardModels: authGuardType = {
  headers: t.Object({ Authorization: t.Optional(t.String()) }),
  response: errorModels.unauthorized,
};
