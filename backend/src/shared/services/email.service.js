import { transporter } from "../../config/mail.js";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({
      from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    logger.info({
      message: "Email sent successfully",
      to,
      subject,
    });
  } catch (error) {
    logger.error({
      message: "Email sending failed",
      to,
      subject,
      error: error.message,
    });

    throw error;
  }
};