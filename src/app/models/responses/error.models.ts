import { t } from "elysia";

export abstract class errorModels {
  static readonly unprocessableContent = {
    422: t.Object({
      type: t.String({ default: "NEED_VALIDATION" }),
      message: t.String({
        default: "Please update the inappropriate data",
      }),
      meta: t.Array(
        t.Object({
          field: t.String(),
          errors: t.Array(t.String()),
        })
      ),
    }),
  };

  static readonly unauthorizedMsg = {
    type: "UNAUTHORIZED",
    message: "invalid access credentials or access restrictions",
  };

  static readonly unauthorized = {
    401: t.Object({
      type: t.String({ default: this.unauthorizedMsg.type }),
      message: t.String({
        default: this.unauthorizedMsg.message,
      }),
    }),
  };

  static readonly serviceUnavailableMsg = {
    type: "SERVICE_UNAVAILABLE",
    message: "try again later or contact admin for more informations",
  };
  static readonly serviceUnavailable = {
    503: t.Object({
      type: t.String({ default: this.serviceUnavailableMsg.type }),
      message: t.String({
        default: this.serviceUnavailableMsg.message,
      }),
    }),
  };
  static readonly tooManyRequest = t.Object({
    type: t.String({ default: "TOO_MANY_REQUEST" }),
    message: t.String({
      default: "Wait a moment, request limit exceeded",
    }),
  });

  static readonly notFound = {
    404: t.Object({
      type: t.String({ default: "NOT_FOUND" }),
      message: t.String({
        default: "unable to load data because data was not found",
      }),
    }),
  };

  static readonly notFoundMsg = {
    type: "NOT_FOUND",
    message: "unable to load data because data was not found",
  };
}
