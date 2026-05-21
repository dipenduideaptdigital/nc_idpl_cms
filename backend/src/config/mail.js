import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter =
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),

    secure:
      Number(env.SMTP_PORT) === 465,

    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },

    pool: true,

    maxConnections: 5,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });