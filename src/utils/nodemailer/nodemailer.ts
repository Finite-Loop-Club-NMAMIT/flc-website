import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: process.env.SMTP_GMAIL,
    pass: process.env.SMTP_PASSWORD,
  },

});

export const sendVerificationEmail = async (
  email: string,
  url: string,
  name: string,
) => {
  async function main() {
    await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: "Verify your email",
      text: `Hi ${name}`,
      html: `<p>click <a href="${url}">here </a> to verify your email</p>`,
    });
  }

  await main().catch((error) => {
    console.error(error);
    throw error;
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  url: string,
  name: string,
) => {
  async function main() {
    await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: "Reset your password",
      text: `Hi ${name}`,
      html: `<p>click <a href="${url}">here </a> to reset your password</p>`,
    });
  }

  await main().catch((error) => {
    console.error(error);
    throw error;
  });
};


export const sendAttendenceStatusForEmail = async (
  email: string,
  eventName: string,
  name: string,
  hasAttended: boolean
) => {

  async function main() {
    let subject;
    let htmlContent;

    if (hasAttended) {
      subject = `Thank You for Attending ${eventName}`;
      htmlContent = `
        <p>Thanks for attending <strong>${eventName}</strong>.</p>
        <p>Your event <strong>certificate</strong> will be sent via email. Please keep an eye on your inbox.</p>
        <p>Best regards,</p>
        <p>Finite Loop Club</p>`;
    } else {
      subject = `We Missed You at ${eventName}`;
      htmlContent = `
        <p>Hi ${name},</p>
        <p>We noticed that you were unable to attend <strong>${eventName}</strong>.</p>
        <p>We hope to see you at our future events!</p>
        <p>Best regards,</p>
        <p>Finite Loop Club</p>`;
    }

    await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: subject,
      text: `Hi ${name}`,
      html: htmlContent
    });
  }

  await main().catch((error) => {
    console.error(error);
    throw error;
  });
};
