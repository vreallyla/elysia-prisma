import { MailMain } from "../../mail.main";

export const newPasswordMail = async (to?: string) => {
  const provider = new MailMain();

  if (!to) return;

  await provider.send({
    to,
    subject: "Change Password Activity",
    message: `<p>We detected password change activity on your account. We would be happy if you updated your password. If you do not carry out this activity, please reset your password immediately</p>
    <br/>
    <b>Nb: please do not reply to this email, you can contact the admin for further information</b>
      `,
  });
};
