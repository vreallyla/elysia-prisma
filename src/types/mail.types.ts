import { BunFile } from "bun";

export type MailParamsType = {
  isHTML?: boolean;
  from?: string;
  to: string;
  subject: string;
  message: string;
  attachments?: { filename?: string; content: BunFile }[];
};

export type MailProviderType = {
  attachments: { filename?: string; content: Buffer }[];
  from: string;
  htmlMsg: string;
} & Pick<MailParamsType, "from" | "to" | "subject">;
