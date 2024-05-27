import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { isDev } from "./bool.utils";

const scryptAsync = promisify(scrypt);

export const encryptCredentials = Bun.env?.SECRET_ENCRYPT ?? "default";

export async function toHash(password: string, secret = encryptCredentials) {
  const salt = randomBytes(8).toString("hex");
  const buf = await scryptAsync(password, salt + secret, 64);

  return `${(buf as Buffer).toString("hex")}.${salt}`;
}

export async function hasCompare(
  storedPassword: string,
  suppliedPassword: string,
  secret = encryptCredentials
) {
  const [hashedStoredPassword, salt] = storedPassword.split(".");
  const buf = await scryptAsync(suppliedPassword, salt + secret, 64);
  const hashedSuppliedPassword = (buf as Buffer).toString("hex");
  return hashedStoredPassword === hashedSuppliedPassword;
}

export const toTitleCase = (ref: string) =>
  ref
    .split(" ")
    .map((e) => e[0].toUpperCase() + e.slice(1))
    .join(" ");

export const toKebabCase = (ref: string) =>
  ref
    .split(" ")
    .map((e) => e.toLowerCase())
    .join(" ");

export const parseToUrl = (ref?: string | null) => {
  if (!ref) return null;

  return `${isDev() ? Bun.env.APP_URL_DEV : Bun.env.APP_URL_PROD}/${ref}`;
};
