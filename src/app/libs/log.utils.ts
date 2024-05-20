import { isDev } from "./bool.utils";

type LogOptsType = { title: String };

export abstract class Log {
  static info(message: any, opts?: LogOptsType) {
    if (!isDev()) return;

    const { title } = opts ?? {};

    console.log(
      "\x1B[33m======================================================\x1B[0m"
    );
    console.log(
      "\x1B[33m---------------------- info log ----------------------\x1B[0m"
    );

    console.log(
      "\x1B[33m======================================================\x1B[0m"
    );

    if (title != null) {
      console.log(`\x1B[33m${title.toUpperCase()}\x1B[0m`);
      console.log(
        "\x1B[33m======================================================\x1B[0m"
      );
    }

    console.debug(message);

    console.log(
      "\x1B[33m------------------------------------------------------\x1B[0m"
    );
  }

  static error(message: any, opts?: LogOptsType) {
    if (!isDev()) return;

    const { title } = opts ?? {};

    console.log(
      "\x1B[31m======================================================\x1B[0m"
    );
    console.log(
      "\x1B[31m---------------------- error log ----------------------\x1B[0m"
    );

    console.log(
      "\x1B[31m======================================================\x1B[0m"
    );

    if (title != null) {
      console.log(`\x1B[31m${title.toUpperCase()}\x1B[0m`);
      console.log(
        "\x1B[31m======================================================\x1B[0m"
      );
    }
    console.debug(message);

    console.log(
      "\x1B[31m------------------------------------------------------\x1B[0m"
    );
  }
}
