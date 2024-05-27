import { ServiceUnavailbleError } from "../../app/exceptions/500/service_unavailable.error";
import FormData from "form-data";
import axios, { AxiosError } from "axios";
import { MailProviderType } from "../../types/mail.types";

export async function MailGunSender(data: MailProviderType) {
  const { from, to, subject, htmlMsg, attachments } = data;

  // throw -> unset credentials
  if (!Bun.env.MAILGUN_ENDPOINT || !Bun.env.MAILGUN_AUTHORIZATION) {
    throw new ServiceUnavailbleError(
      "[Mailgun] credentials have not been sets"
    );
  }

  //   init data
  const body: Record<string, string> = {
    from,
    to,
    subject,
    html: htmlMsg,
  };

  //   START: INIT FORMDATA
  const form = new FormData();

  //   integrate from data
  Object.keys(body).forEach((key) => form.append(key, body[key]));

  // has attachment
  for (const [i, e] of attachments.entries()) {
    form.append(`attachment[${i}]`, e.content, { filename: e.filename });
  }
  //   END: INIT FORMDATA

  return axios(Bun.env.MAILGUN_ENDPOINT, {
    headers: {
      Authorization: `Basic ${Bun.env.MAILGUN_AUTHORIZATION}`,
      ...form.getHeaders(),
    },
    method: "POST",
    data: form,
  }).catch((e: Error | AxiosError) => {
    throw new ServiceUnavailbleError(`[Mailgun] ${e.message}`);
  });
}
