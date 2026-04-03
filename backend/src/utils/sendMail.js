import {createTransport} from "nodemailer";

const sendMail = async ({ email, subject, html }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transport.sendMail({
    from: `"Finance App" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject,
    html,
  });
};

export default sendMail;