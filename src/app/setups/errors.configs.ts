import Elysia, { NotFoundError, StatusMap, ValidationError } from "elysia";
import { UnauthorizedError } from "../exceptions/400/unauthorized.error";
import { ZodError } from "zod";
import { errorModels } from "../models/responses/error.models";
import { ServiceUnavailbleError } from "../exceptions/500/service_unavailable.error";

export const errorConfig = (app: Elysia) =>
  app.onError(({ error, code, set }) => {
    // cond: not found data
    if (error instanceof NotFoundError) return errorModels.notFoundMsg;

    // cond exceptions
    if (
      error instanceof UnauthorizedError ||
      error instanceof ServiceUnavailbleError
    )
      return error.response;

    // cond: need validate form i [zod: custom validation -> handdle transform async validation issues & validate in controller]
    if (error instanceof ZodError) {
      const meta: Record<string, string[]> = (error.errors ?? []).reduce(
        (prev, dt) => {
          let resp: Record<string, string[]> = prev;

          for (const key of dt.path) {
            if (typeof key != "string") continue;

            if (Object.keys(resp).includes(key)) {
              resp[key] = [...resp[key], dt.message];
            } else {
              resp[key] = [dt.message];
            }
          }

          return resp;
        },
        {}
      );

      set.status = StatusMap["Unprocessable Content"];

      return {
        type: "NEED_VALIDATION",
        message: "Please update the invalid data",
        meta,
      };
    }

    // cond: need validate form ii [typebox: elysia default]
    if (error instanceof ValidationError) {
      const { all } = error;

      const meta = all.reduce((prev, curr) => {
        const objKey = curr?.path ? curr?.path.slice(1) : "unknown";

        return {
          ...prev,
          [objKey]: [
            ...(prev[objKey] ?? []),
            curr.message ?? "something wrong!",
          ],
        };
      }, {});

      return {
        type: "NEED_VALIDATION",
        message: "Please update the invalid data",
        meta,
      };
    }
  });
