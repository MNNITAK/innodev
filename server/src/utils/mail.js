import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendmail = async (options) => {
  const mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Civora",
      link: "https://civora.com/",
    },
  });
  const emailtext = mailgenerator.generatePlaintext(options.mailgencontent);
  const emailhtml = mailgenerator.generate(options.mailgencontent);
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: '"Proj Manager" <no-reply@projmanager.com>',
    to: options.email,
    subject: options.subject,
    text: emailtext,
    html: emailhtml,
  });
  console.log("Message sent: %s", info.messageId);
  try {
    await transporter.sendMail(info);
  } catch (error) {
    console.error("Error verifying transporter:", error);
  }
};

const emailverificationTemplate = (username, verificationLink) => {
  return {
    body: {
      name: username,
      intro: "Welcome! We're excited to have you on board.",
      action: {
        instructions:
          "To get started, please verify your email address by clicking the button below:",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: verificationLink,
        },
      },
      outro: "If you did not create an account, no further action is required.",
    },
  };
};
const forgotPasswordTemplate = (username, resetLink) => {
  return {
    body: {
      name: username,
      intro: "We're sorry to hear that you've forgotten your password.",
      action: {
        instructions: "To reset your password, please click the button below:",
        button: {
          color: "#640d3fff",
          text: "Reset Password",
          link: resetLink,
        },
      },
      outro: "If you did not create an account, no further action is required.",
    },
  };
};
export { emailverificationTemplate, forgotPasswordTemplate, sendmail };
