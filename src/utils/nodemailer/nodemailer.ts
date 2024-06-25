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


export const sendCertificationIsuueForEmail = async (
  email: string,
  certificationType: string,
  eventName: string,
  name: string,
  // should take certification type parameter 
) => {
 

 // here we should acess that  templete file add that certification type for that templete and 
 //convert it  into the image , then send that image as a attachment below while sending email 

 async function main() {
   
    await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: "Flc Certification",
      text: `Hi ${name}`,
      html: `
          <p>Congratulations! Your <strong>${certificationType}</strong> certification for the event <strong>${eventName}</strong> has been issued.</p>
          <p>Thank you for your participation and effort.You can downlode your certificate from Flc-dashboard</p>
          <p>Best regards,</p>
          <p>Finite Loop Club</p>`,
         
    });
  }

  await main().catch((error) => {
    console.error(error);
    throw error;
  });
};
