"use server";

import { Resend } from "resend";

interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
  label?: string;
}

export async function sendEmail({ to, subject, text, label }: SendEmailProps) {
  const fromEmail = process.env.RESEND_EMAIL;
  const resend = new Resend(process.env.RESEND_KEY);

  await resend.emails.send({
    from: `Alugg | ${label ?? "Email de verificação"} <${fromEmail}>`,
    to,
    subject,
    text,
  });
}
