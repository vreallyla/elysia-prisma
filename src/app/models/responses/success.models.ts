import { TSchema, t } from "elysia";

export abstract class SuccessModels {
  static readonly ok = (payload: Record<string, TSchema>) =>
    t.Object({
      type: t.String({ default: "OK" }),
      message: t.String({ default: "loaded data successfully" }),
      payload: t.Object(payload),
    });
  static readonly created = (payload: Record<string, TSchema>) =>
    t.Object({
      type: t.String({ default: "CREATED" }),
      message: t.String({ default: "created data successfully" }),
      payload: t.Object(payload),
    });

  static readonly updated = (payload: Record<string, TSchema>) =>
    t.Object({
      type: t.String({ default: "UPDATED" }),
      message: t.String({ default: "updated data successfully" }),
      payload: t.Object(payload),
    });

  static readonly okMsg = {
    type: "OK",
    message: "loaded data successfully",
  };

  static readonly createdMsg = {
    type: "CREATED",
    message: "created data successfully",
  };

  static readonly updatedMsg = {
    type: "UPDATED",
    message: "updated data successfully",
  };
}
