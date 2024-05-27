import { NotFoundError } from "elysia";
import { GetTypeFromObjByKey } from "../types/common.types";
import { MailParamsType, MailProviderType } from "../types/mail.types";
import { ServiceUnavailbleError } from "../app/exceptions/500/service_unavailable.error";
import { MailGunSender } from "./setups/mailgun.configs";
import { sendMail } from "./setups/smtpmail.configs";

export class MailMain {
  private readonly _initProvider = Bun.env.MAIL_PROVIDER ?? "smtp";
  readonly providerAvail = ["smtp", "mailgun"];

  /**
   * @example
   * ```
   * await mailProvider.send({
   *  to: "foo@example.com",
   *  subject: "foo",
   *  message: "<p>bar</p>",
   *  isHTML: true,
   *  attachments: [{
   *    filename: 'others.json',
   *    content: Bun.file("package.json")
   *  }],
   * });
   * ```
   */
  async send(params: MailParamsType) {
    // throw: provider unavailable
    if (!this.providerAvail.includes(this._initProvider)) {
      throw new ServiceUnavailbleError("email provider unavailable");
    }

    //   define data
    const {
      isHTML = false,
      from = `noreply <${Bun.env?.SMTP_USER ?? "1umroh@mail.1medix.app"}>`,
      to,
      subject,
      message,
      attachments = [],
    } = params;

    // temp: parse attachment
    let setAttachments: GetTypeFromObjByKey<MailProviderType, "attachments"> =
      [];

    //   fill attachment temp
    for await (const e of attachments) {
      const arrbuf = await e.content.arrayBuffer();
      const buffer = Buffer.from(arrbuf);

      setAttachments.push({
        filename: e.filename ?? e.content.name,
        content: buffer,
      });
    }

    // temp: parse message to html
    const htmlMsg = isHTML
      ? message
      : message
          .split("\n")
          .map((e) => `<p>${e}</p>`)
          .join("");

    //   run provider
    switch (this._initProvider) {
      case "smtp":
        await sendMail({
          from,
          to,
          subject,
          html: htmlMsg,
          attachments: setAttachments,
        });
        break;
      case "mailgun":
        await MailGunSender({
          to,
          from,
          subject,
          htmlMsg,
          attachments: setAttachments,
        });
        break;
    }
  }
}
