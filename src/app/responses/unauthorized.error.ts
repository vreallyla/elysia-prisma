import { errorModels } from "../models/responses/error.models";

export class UnauthorizedError extends Error {
  code: string;
  status: number;
  response: Record<string, any>;
  constructor() {
    super("unauthorized");
    this.code = "UNAUTHORIZED";
    this.response = errorModels.unauthorizedMsg;
    this.status = 401;
  }
}
