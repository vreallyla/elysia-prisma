import { MaybePromise, NotFoundError, StatusMap, t } from "elysia";
import { AppType } from "../..";
import { AuthController } from "../../app/controllers/auth.controller";
import { AuthModels } from "../../app/models/auth.models";
import { SwaggerConfig } from "../../app/setups/swagger.configs";
import { errorModels } from "../../app/models/responses/error.models";
import { JWTPayloadSpec } from "@elysiajs/jwt";
import { authGuardModels } from "../../app/models/guards/auth_guard.models";
import { SuccessModels } from "../../app/models/responses/success.models";
import { authUserResolve } from "../../app/resolvers/auth_user.resolve";

export const AuthRoutes = (app: AppType) =>
  app.group("auth", (app) => {
    const c = new AuthController(app.decorator.prisma);
    const m = new AuthModels();

    return app.guard(
      {
        detail: {
          tags: [SwaggerConfig.gAuth],
        },
      },
      (app) =>
        app
          .post("signin", ({ body, jwt }) => c.signin(body, jwt.sign), {
            ...m.signinForm,
            response: {
              // ...m.signinResponse,
              ...errorModels.unprocessableContent,
            },
          })
          .guard(authGuardModels, (app) =>
            app
              .resolve(authUserResolve)
              .post("signout", () => c.signout())
              .group("profile", (app) =>
                app
                  .get("/", ({ credentials }) => c.profile(credentials), {
                    response: { ...m.profileResponse, ...errorModels.notFound },
                  })
                  .patch(
                    "update",
                    ({ credentials, body, set }) => {
                      set.status = StatusMap.Created;
                      return c.profileUpdate(credentials, body);
                    },
                    {
                      body: m.profileUpdateBodyWithObj,
                      response: {
                        ...m.profileUpdateResponse,
                        ...errorModels.notFound,
                      },
                    }
                  )
                  .patch(
                    "new-password",
                    () => c.newPassword(),
                    m.newPasswordForm
                  )
                  .patch("new-ava", () => c.newAva(), m.newAvaForm)
              )
          )

          .group("reset-password", (app) =>
            app
              .post("/", () => c.resetPassword(), m.resetPasswordReqForm)
              .get(":code", () => c.verifyResetPassword())
              .patch(
                ":code/update",
                () => c.resetPasswordMakeNews(),
                m.resetPasswordMakeNewsForm
              )
          )
    );
  });
