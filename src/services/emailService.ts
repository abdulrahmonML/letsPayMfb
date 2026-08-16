import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({
  to,
  subject,
  html,
}: EmailOptions): Promise<void> => {
  const { data, error } = await resend.emails.send({
    from: "LetsPay MFB <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    return;
  }

  console.log("Email sent successfully:", data);
};

export default sendEmail;
