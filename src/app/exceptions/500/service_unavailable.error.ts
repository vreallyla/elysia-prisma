import { isDebug } from "../../libs/bool.utils";
import { errorModels } from "../../models/responses/error.models";

export class ServiceUnavailbleError extends Error {
  code: string;
  status: number;
  response: Record<string, any>;
  constructor(message?: string) {
    super("service_unavailable");
    this.code = "SERVICE_UNAVAILABLE";
    this.response = {
      ...errorModels.serviceUnavailableMsg,
      ...(message && isDebug() ? { message } : {}),
    };
    this.status = 503;
  }
}
