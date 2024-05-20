import { NotFoundError, Static, t } from "elysia";
import { JwtSignType, PrismaType } from "../../types/setup.types";
import { AuthModels } from "../models/auth.models";
import { hasCompare } from "../libs/string.utils";
import { omitObject } from "../libs/object.utils";
import { AuthUserResolveResponse } from "../../types/resolver.types";
import { z } from "zod";
import { SuccessModels } from "../models/responses/success.models";

export class AuthController {
  private readonly prisma;
  private readonly model = new AuthModels();

  constructor(prisma: PrismaType) {
    this.prisma = prisma;
  }

  async profile(credentials: AuthUserResolveResponse) {
    const { id } = credentials ?? {};

    const getData = await this.prisma.mUsers.findFirst({
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

    if (!getData) throw new NotFoundError();

    return {
      ...SuccessModels.okMsg,
      payload: getData,
    };
  }

  async profileUpdate(
    credentials: AuthUserResolveResponse,
    body: Static<typeof this.model.profileUpdateBodyWithObj>
  ) {
    const { information } = credentials ?? {};

    const where = { id: information?.id };

    const payload = !information
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

    return {
      ...SuccessModels.updatedMsg,
      payload,
    };
  }
  async newPassword() {
    return "a";
  }
  async newAva() {
    return "a";
  }

  async signin(
    body: Static<typeof this.model.signinForm.body>,
    jwtSign: JwtSignType
  ) {

    const { username, password } = body;
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

    // throw user not found
    if (!dataChecker)
      return z
        .object({
          password: z.string({ message: "username or password invalid" }),
        })
        .parse({});

    // check credential valid
    if (!(await hasCompare(dataChecker.password, password))) {
      throw new NotFoundError();
    }

    return {
      ...SuccessModels.okMsg,

      payload: {
        token: await jwtSign(dataChecker ?? {}),
        ...omitObject(dataChecker, ["password", "id"]),
      },
    };
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
