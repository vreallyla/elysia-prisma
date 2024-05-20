import { t } from "elysia";
import { SuccessModels } from "./responses/success.models";

export class AuthModels {
  readonly signinForm = {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  };

  readonly signinResponse = {
    200: SuccessModels.ok({
      token: t.String(),
      username: t.String(),
      information: t.Object({
        email: t.String(),
        name: t.String(),
        photoProfile: t.Nullable(t.String()),
      }),
    }),
  };

  // TODO:: transform gender & photoprofile
  readonly profileUpdateBody = {
    name: t.String({ minLength: 3 }),
    email: t.String({ format: "email" }),
    photoProfile: t.Nullable(t.String()),
    identityCode: t.Uppercase(t.String()),
    gender: t
      .Transform(t.String())
      .Decode((sample) => "asd")
      .Encode((sample) => "qwe"),
    phoneNumber: t.Nullable(t.String()),
    address: t.Nullable(t.String()),
  };

  readonly profileUpdateBodyWithObj = t.Omit(t.Object(this.profileUpdateBody), [
    "identityCode",
  ]);

  profileUpdateResponse = {
    201: SuccessModels.updated(this.profileUpdateBody),
  };

  readonly profileResponse = {
    200: SuccessModels.ok({
      username: t.String(),
      information: t.Object(this.profileUpdateBody),
    }),
  };
  readonly resetPasswordReqForm = {
    body: t.Object({
      email: t.String({ format: "email" }),
    }),
  };
  readonly resetPasswordMakeNewsForm = {
    body: t.Object({
      code: t.String(),
      password: t.String(),
      rePassword: t.String(),
    }),
  };
  readonly newPasswordForm = {
    body: t.Object({
      password: t.String(),
      rePassword: t.String(),
    }),
  };
  readonly newAvaForm = {
    body: t.Object({
      photoProfile: t.File({ type: ["image"] }),
    }),
  };

  readonly profileUpdate = {
    body: t.Object({
      email: t.String(),
      name: t.String(),
      gender: t.Enum({ m: "Male", f: "Female", o: "Others" }),
      phoneNumber: t.String(),
      address: t.String(),
    }),
  };
}
