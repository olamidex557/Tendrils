import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Email skipped.");
    return null;
  }

  const from = process.env.EMAIL_FROM || "Ajike Store <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("RESEND EMAIL ERROR:", error);
    return null;
  }

  return data;
}