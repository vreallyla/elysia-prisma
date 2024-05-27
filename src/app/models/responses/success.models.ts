import { TSchema, t } from "elysia";

export abstract class SuccessModels {
  static readonly okMsg = {
    type: "OK",
    message: "loaded data successfully",
  };
  static readonly ok = (payload: Record<string, TSchema>) =>
    t.Object({
      type: t.String({ default: this.okMsg.type }),
      message: t.String({ default: this.okMsg.message }),
      payload: t.Object(payload),
    });
  static readonly okResp = (payload: Record<string, any>) => ({
    type: this.okMsg.type,
    message: this.okMsg.message,
    payload,
  });

  static readonly created = (payload: Record<string, TSchema>) =>
    t.Object({
      type: t.String({ default: "CREATED" }),
      message: t.String({ default: "created data successfully" }),
      payload: t.Object(payload),
    });

  static readonly updatedMsg = {
    type: "UPDATED",
    message: "updated data successfully",
  };

  static readonly updated = (payload: Record<string, TSchema>) =>
    t.Object({
      type: t.String({ default: this.updatedMsg.type }),
      message: t.String({ default: this.updatedMsg.message }),
      payload: t.Object(payload),
    });

  static readonly updatedResp = (payload: Record<string, any>) => ({
    type: this.updatedMsg.type,
    message: this.updatedMsg.message,
    payload,
  });

  static readonly createdMsg = {
    type: "CREATED",
    message: "created data successfully",
  };
}
