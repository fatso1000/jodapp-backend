import nodemailer from "nodemailer";
import { emailFrom, smtpOptions } from "../config";

interface ISendEmail {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export default async function sendEmail({
  to,
  subject,
  html,
  from = emailFrom,
}: ISendEmail) {
  const transporter = nodemailer.createTransport(smtpOptions);
  await transporter.sendMail({ from, to, subject, html, priority: 'high' });
}
