import { createTransport, SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ServiceUnavailbleError } from "../../app/exceptions/500/service_unavailable.error";

export async function sendMail(data: SendMailOptions) {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return new Promise(
    (resolve: (res: SMTPTransport.SentMessageInfo) => void) => {
      transporter.sendMail(data, (err, res) => {
        if (err) {
          throw new ServiceUnavailbleError("[smtp mail] failed to sent");
        }
        resolve(res);
      });
    }
  );
}
