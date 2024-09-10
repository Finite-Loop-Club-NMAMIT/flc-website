import handlebars from "handlebars";
import nodemailer from "nodemailer";

import { emailVerificationTemplate } from "~/templates/emailVerification";
import { passwordResetTemplate } from "~/templates/passwordReset";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: process.env.SMTP_GMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const defaultTemplate = {
  canonical_url: "https://finiteloop.co.in",
  // TODO: Verify credentials
  instagram: "https://www.instagram.com/finiteloop_club_nmamit/",
  facebook: "https://www.facebook.com/FiniteLoopClub.Nmamit/",
  linkedin: "https://www.linkedin.com/showcase/finite-loop-club",
  email: "mailto:finiteloopclub@gmail.com",
  phone: "tel:8197903771",
};

const sendVerificationEmail = async (
  email: string,
  url: string,
  name: string,
  expiry?: number,
) => {
  // const html = fs.readFileSync("src/templates/emailVerification.html", "utf-8");
  const html = emailVerificationTemplate;
  const template = handlebars.compile(html);
  const htmlToSend = template({
    verify_url: url,
    name: name,
    // TODO: remove expiry hardcode
    expiry_hours: expiry ?? 24,
    ...defaultTemplate,
  });

  try {
    const res = await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: "Verify your email",
      html: htmlToSend,
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

const sendPasswordResetEmail = async (
  email: string,
  url: string,
  name: string,
  expiry?: number,
) => {
  // const html = fs.readFileSync("src/templates/passwordReset.html", "utf-8");
  const html = passwordResetTemplate;
  const template = handlebars.compile(html);
  const htmlToSend = template({
    verify_url: url,
    name: name,
    // TODO: remove expiry hardcode
    expiry_hours: expiry ?? 24,
    ...defaultTemplate,
  });

  try {
    const res = await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: "Reset your password",
      html: htmlToSend,
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

const sendCertificationIsuueForEmail = async (
  email: string,
  certificationType: string,
  eventName: string,
  name: string,
) => {
  async function main() {
    await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: "Flc Certification",
      text: `Hi ${name}`,
      html: `<p>Your ${certificationType} certification for ${eventName} has been isuued</p>`,
    });
  }

  await main().catch((error) => {
    console.error(error);
    throw error;
  });
};

export {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCertificationIsuueForEmail,
};
