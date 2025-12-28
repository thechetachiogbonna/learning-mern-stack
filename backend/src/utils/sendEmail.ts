import transporter from "../config/nodemailer.js";
import { EMAIL_USER } from "../constants/env.js";

const sendEmail = async ({
  to, subject, text, html
}: {
  to: string, subject: string, text: string, html: string
}) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text,
      html
    });

    return { success: true, error: false }
  } catch (error) {
    console.log("Error sending email:", error);
    return { success: false, error: true }
  }
}

export default sendEmail;