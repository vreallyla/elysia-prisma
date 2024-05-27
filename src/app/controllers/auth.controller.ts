import { NotFoundError, Static, StatusMap, t } from "elysia";
import { JwtSignType, PrismaType } from "../../types/setup.types";
import { AuthModels } from "../models/auth.models";
import { hasCompare, parseToUrl, toHash } from "../libs/string.utils";
import { omitObject } from "../libs/object.utils";
import { AuthUserResolveResponse } from "../../types/resolver.types";
import { z } from "zod";
import { SuccessModels } from "../models/responses/success.models";
import { elysiaSet } from "../../types/common.types";
import { Log } from "../libs/log.utils";
import { ServiceUnavailbleError } from "../exceptions/500/service_unavailable.error";
import { isDebug } from "../libs/bool.utils";
import { MailGunSender } from "../../mail/setups/mailgun.configs";
import { sendMail } from "../../mail/setups/smtpmail.configs";
import { ReadStream } from "fs";
import { MailMain } from "../../mail/mail.main";
import { newPasswordMail } from "../../mail/data/auth/new_password.mail";
import { FileSystemConfigs } from "../storages/setups/filesystem.configs";
import { StorageDefaultAbstract } from "../storages/abstracts/storage_default.abstract";

export class AuthController {
  private readonly prisma;
  private readonly model = new AuthModels();

  constructor(prisma: PrismaType) {
    this.prisma = prisma;
  }

  async signin(
    body: Static<typeof this.model.signinForm.body>,
    jwtSign: JwtSignType
  ) {
    // collect data from body req
    const { username, password } = body;

    // get data from db -> check credentials valid
    const dataChecker = await this.prisma.mUsers.findFirst({
      where: {
        AND: [
          { information: { isActive: true }, isActive: true },
          {
            OR: [{ username }, { information: { email: username } }],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        password: true,
        information: {
          select: { name: true, email: true, photoProfile: true },
        },
      },
    });

    // throw user not found -> check credential valid
    if (!dataChecker || !(await hasCompare(dataChecker!.password, password))) {
      z.object({
        password: z.string({ message: "username or password invalid" }),
      }).parse({});
    }

    return SuccessModels.okResp({
      token: await jwtSign(dataChecker ?? {}),
      ...omitObject(dataChecker!, ["password", "id"]),
    });
  }

  // show profile data
  async profile(credentials: AuthUserResolveResponse) {
    const { id } = credentials ?? {};

    let payload: Record<string, any> | null =
      await this.prisma.mUsers.findFirst({
        where: { id },
        select: {
          username: true,
          information: {
            select: {
              name: true,
              email: true,
              photoProfile: true,
              identityCode: true,
              gender: true,
              phoneNumber: true,
              address: true,
            },
          },
        },
      });

    if (!payload) throw new NotFoundError();

    payload = {
      ...(payload ?? {}),
      information: {
        ...(payload.information ?? {}),
        photoProfileUrl: parseToUrl(payload?.information?.photoProfile),
      },
    };

    return SuccessModels.okResp(payload);
  }

  // update profile data
  async profileUpdate(
    credentials: AuthUserResolveResponse,
    body: Static<typeof this.model.profileUpdateBodyWithObj>,
    set: elysiaSet
  ) {
    // collect information based jwt credentials
    const { information } = credentials ?? {};

    // query conditions: get informations by id
    const where = { id: information?.id };

    // fetch db -> check data exists & update data
    let payload: Record<string, any> | null = !information
      ? null
      : await this.prisma.mInformations.update({
          where,
          data: body,
          select: {
            name: true,
            email: true,
            photoProfile: true,
            identityCode: true,
            gender: true,
            phoneNumber: true,
            address: true,
          },
        });

    if (!payload) throw new NotFoundError();

    // set status code to 201
    set.status = StatusMap.Created;

    payload = {
      ...(payload ?? {}),
      photoProfileUrl: parseToUrl(payload.photoProfile),
    };

    return SuccessModels.updatedResp(payload);
  }

  async newPassword(
    credentials: AuthUserResolveResponse,
    body: Static<typeof this.model.newPasswordForm.body>,
    set: elysiaSet
  ) {
    // collect information based jwt credentials
    const { id } = credentials ?? {};

    // query conditions: get informations by id
    const where = { id };

    // fetch db -> get current password
    const { password = null, information } =
      (await this.prisma.mUsers.findFirst({
        where,
        select: {
          password: true,
          information: { select: { email: true } },
        },
      })) ?? {};

    // validate -> body req
    await z
      .object({
        currentPassword: z
          .string()
          .refine(async (e) => password && (await hasCompare(password, e)), {
            message: "invalid password",
          }),
        newPassword: z
          .string()
          .regex(
            new RegExp(
              "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
            ),
            {
              message:
                "minimum eight characters, at least one upper case, one lower case, one number and one special character",
            }
          ),
        reNewPassword: z.string().refine((e) => e === body.newPassword, {
          message: "must match the new password",
        }),
      })
      .parseAsync(body);

    await Promise.all([
      // query update password
      this.prisma.mUsers.update({
        where,
        data: { password: await toHash(body.newPassword) },
      }),
      // send email
      newPasswordMail(information?.email),
    ]);

    // set status code to 201
    set.status = StatusMap.Created;

    return SuccessModels.updatedResp({});
  }

  async newAva(
    credentials: AuthUserResolveResponse,
    body: Static<typeof this.model.newAvaForm.body>,
    set: elysiaSet,
    storage: StorageDefaultAbstract
  ) {
    // collect file req
    const { photoProfile } = body;

    // validate
    z.object({
      photoProfile: z
        .any()
        .refine(
          (file) => file?.size <= 1 * 1024 * 1024,
          `Max image size is 1MB.`
        )
        .refine(
          (file) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              file?.type
            ),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
    }).parse(body);

    // collect information based jwt credentials
    const { information } = credentials ?? {};

    // query conditions: get informations by id
    const where = { id: information?.id };

    const select = {
      photoProfile: true,
    };

    // fetch db -> check data exists
    const check = !information
      ? null
      : await this.prisma.mInformations.findFirst({
          where,
          select,
        });

    if (!check) throw new NotFoundError();

    // update photo
    const newPhoto: string[] = await storage.storeFile(
      [photoProfile],
      "images/photo-profile",
      check.photoProfile ? [check.photoProfile] : []
    );

    // update data
    let payload: Record<string, any> | null =
      await this.prisma.mInformations.update({
        where,
        data: { photoProfile: newPhoto[0] },
        select,
      });

    payload = {
      ...(payload ?? {}),
      photoProfileUrl: parseToUrl(payload.photoProfile),
    };

    // set status code to 201
    set.status = StatusMap.Created;

    return SuccessModels.updatedResp(payload);
  }

  async signout() {
    return "a";
  }

  async resetPassword() {
    return "a";
  }
  async verifyResetPassword() {
    return "a";
  }
  async resetPasswordMakeNews() {
    return "a";
  }
}
