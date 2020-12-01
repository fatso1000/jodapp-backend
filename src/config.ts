import SMTPConnection from "nodemailer/lib/smtp-connection";

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;

export const secret = process.env.SECRET || "SECRET EXAMPLE XD";
export const smtpOptions: SMTPConnection.Options = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "schuyler.wiza31@ethereal.email",
    pass: "qTh4QHkzk24aUgATeH",
  },
};
export const emailFrom =
  process.env.EMAIL_FROM || "schuyler.wiza31@ethereal.email";

export const roles = {
  Admin: "Admin",
  User: "User",
};

export const db = {
  name: process.env.DB_NAME || "",
  host: process.env.DB_HOST || "",
  port: process.env.DB_PORT || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_USER_PWD || "",
  uri: process.env.ATLAS_URI || "",
};

export const corsUrl = process.env.CORS_URL || '';
