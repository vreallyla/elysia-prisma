import { InternalServerError, NotFoundError } from "elysia";
import { isDebug } from "./bool.utils";

export const dateAddMinutes = (durations: number, datetime?: any): Date => {
  const sample: Date = datetime instanceof Date ? datetime : new Date(datetime);
  const addingTime = durations * 60 * 1000;

  return new Date(
    (isNaN(sample.getTime()) ? new Date().getTime() : sample.getTime()) +
      addingTime
  );
};

export const monthNYear = (ref?: string | Date): string => {
  const parseDate = ref ? new Date(ref) : new Date();

  if (isNaN(parseDate.getUTCFullYear()))
    throw new InternalServerError(
      isDebug() ? "cannot parse date when used monthNYear function" : undefined
    );

  return `${parseDate.getUTCMonth().toString().padStart(2, "0")}${parseDate
    .getUTCFullYear()
    .toString()
    .padStart(5, "0")}`;
};
