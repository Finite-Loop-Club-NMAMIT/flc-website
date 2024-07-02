
// import * as fs from "fs";
// import * as path from "path";
// import * as nodemailer from "nodemailer";
// import htmlToImage from "node-html-to-image";

// const srcPath = process.cwd();

// async function generateCertificate(
//   participantName: string,
//   eventName: string,
//   certificateType: "p" | "w",
//   winnerType?: "WINNER" | "RUNNER_UP" | "SECOND_RUNNER_UP",
// ): Promise<string> {
//   try {
//     if (certificateType !== "p" && certificateType !== "w") {
//       throw new Error(`Invalid certificateType:`);
//     }

//     const templateFolder = path.resolve(srcPath, "src/utils/templates");
//     const templatePath = path.resolve(templateFolder, `${certificateType}.html`);

//     // Log the template path to verify where it's looking
//     console.log("Template path:", templatePath);

//     // Check if the template file exists
//     if (!fs.existsSync(templatePath)) {
//       console.log(`Template file '${certificateType}.html' not found at '${templatePath}'`);
//       throw new Error(`Template file '${certificateType}.html' not found at '${templatePath}'`);
//     }

//     let html = fs.readFileSync(templatePath, "utf-8");

//     // Replace placeholders with actual values
//     html = html
//       .replace("{{name}}", participantName)
//       .replace("{{event}}", eventName);

//     if (certificateType === "w" && winnerType) {
//       html = html.replace("{{winnerType}}", winnerType);
//     }
//     console.log("HTML STRING:", html);

//     const imageBuffer = await htmlToImage({ html });

//     if (
//       !imageBuffer ||
//       (Array.isArray(imageBuffer) && imageBuffer.length === 0)
//     ) {
//       throw new Error("No image buffer generated");
//     }

//     let certificateFileName: string | undefined;
//     if (Array.isArray(imageBuffer)) {
//       certificateFileName = imageBuffer.map((buffer, index) => {
//         const imagePath = path.join(srcPath, `src/utils/templates/${certificateType}_${index}.png`);
//         fs.writeFileSync(imagePath, buffer);
//         return imagePath;
//       })[0];
//     } else {
//       const imagePath = path.join(srcPath, `src/utils/templates/${certificateType}.png`);
//       fs.writeFileSync(imagePath, imageBuffer);
//       certificateFileName = imagePath;
//     }
//     if (!certificateFileName) {
//       throw new Error("Failed to generate certificate file name");
//     }

//     console.log("Certificate generated successfully:", certificateFileName);
//     return certificateFileName;
//   } catch (error) {
//     console.error("Error generating certificate:", error);
//     throw new Error("Error generating certificate");
//   }
// }

// async function sendEmailWithAttachment(
//   participantName: string,
//   participantEmail: string,
//   eventName: string,
//   certificateType: "p" | "w",
//   attachmentPath: string,
// ): Promise<void> {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_GMAIL!,
//         pass: process.env.SMTP_PASSWORD!,
//       },
//     });

//     const emailText = `Hi ${participantName},

//                 Thank you for your participation in ${eventName}.

//                 Please find your ${certificateType.toLowerCase()} certificate attached herewith.

//                 Warm Regards,
//                 Team FLC
//                 `;

//     const mailOptions = {
//       from: process.env.SMTP_GMAIL!,
//       to: participantEmail,
//       subject: `${eventName} Certificate (${certificateType.toLowerCase()})`,
//       text: emailText,
//       attachments: [{ path: attachmentPath, filename: "certificate.png" }],
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully to:", participantEmail);
//     console.log("Message ID:", info.messageId);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Could not send Email: Internal server error");
//   }
// }

// async function sendCertificate(
//   participantName: string,
//   eventName: string,
//   participantEmail: string,
//   certificateType: "p" | "w",
//   winnerType?: "WINNER" | "RUNNER_UP" | "SECOND_RUNNER_UP",
// ): Promise<void> {
//   try {
//     console.log(`Sending ${certificateType} certificate to ${participantEmail} for ${eventName}...`);

//     const certificatePath = await generateCertificate(
//       participantName,
//       eventName,
//       certificateType,
//       winnerType,
//     );

//     console.log("Generated certificate path:", certificatePath);

//     await sendEmailWithAttachment(
//       participantName,
//       participantEmail,
//       eventName,
//       certificateType,
//       certificatePath,
//     );

//     console.log(`Certificate sent successfully to ${participantEmail}!`);
//   } catch (error) {
//     console.error(`Failed to send ${certificateType} certificate to ${participantEmail}:`, error);
//     throw error; // Rethrow the error to be caught by the caller
//   }
// }

// export { sendCertificate };


import * as fs from "fs";
import * as path from "path";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import htmlToImage from "node-html-to-image";

const srcPath = process.cwd();

async function generateCertificate(
    participantName: string,
    eventName: string,
    certificateType: "Participation" | "Topperformer",
    winnerType?: "WINNER" | "RUNNER_UP" | "SECOND_RUNNER_UP"
): Promise<string> {
    try {

        if (certificateType !== "Participation" && certificateType !== "Topperformer") {
            throw new Error(`Invalid certificateType: `);
        }

        const templateFolder = path.resolve(srcPath, "src/utils/templates");
        const templatePath = path.resolve(templateFolder, `${certificateType}.html`);

        // Log the template path to verify where it's looking
        console.log("Template path:", templatePath);

        // Check if the template file exists
        if (!fs.existsSync(templatePath)) {
            console.log(`Template file '${certificateType}.html' not found at '${templatePath}'`);
            throw new Error(`Template file '${certificateType}.html' not found at '${templatePath}'`);
        }

        let html = fs.readFileSync(templatePath, "utf-8");

        // Replace placeholders with actual values
        html = html
            .replace("{{name}}", participantName)
            .replace("{{event}}", eventName);

        if (certificateType === "Topperformer" && winnerType) {
            html = html.replace("{{winnerType}}", winnerType);
        }
        console.log("HTML STRING:", html);

        const imageBuffer = await htmlToImage({ html }) as Buffer;

        if (!imageBuffer) {
            throw new Error("No image buffer generated");
        }

        const uniqueId = uuidv4();
        const imagePath = path.join(srcPath, `src/utils/certificates/${certificateType}_${uniqueId}.png`);

        fs.writeFileSync(imagePath, imageBuffer);

        console.log("Certificate generated successfully:", imagePath);
        return imagePath;
    } catch (error) {
        console.error("Error generating certificate:", error);
        throw new Error("Error generating certificate");
    }
}

async function sendEmailWithAttachment(
    participantName: string,
    participantEmail: string,
    eventName: string,
    certificateType: "Participation" | "Topperformer",
    
    attachmentPath: string
): Promise<void> {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_GMAIL!,
                pass: process.env.SMTP_PASSWORD!,
            },
        });

        const emailText = `Hi ${participantName},
        
Thank you for your participation in ${eventName}.

Please find your ${certificateType === 'Participation' ? 'participation' : 'winner'} certificate attached herewith.

Warm Regards,
Team FLC`;
        const mailOptions = {
            from: `Finite Loop Club <${process.env.SMTP_GMAIL!}>`,
            to: participantEmail,
            subject: `${eventName} Certificate (${certificateType === 'Participation' ? 'Participation' : 'Top performer'})`,
            text: emailText,
            attachments: [{ path: attachmentPath, filename: "certificate.png" }],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", participantEmail);
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Could not send Email: Internal server error");
    }
}

async function sendCertificate(
    participantName: string,
    eventName: string,
    participantEmail: string,
    certificateType: "Participation" | "Topperformer",
    winnerType?: "WINNER" | "RUNNER_UP" | "SECOND_RUNNER_UP"
): Promise<void> {
    try {
        console.log(`Sending ${certificateType} certificate to ${participantEmail} for ${eventName}...`);

        const certificatePath = await generateCertificate(
            participantName,
            eventName,
            certificateType,
            winnerType
        );

        console.log("Generated certificate path:", certificatePath);

        await sendEmailWithAttachment(
            participantName,
            participantEmail,
            eventName,
            certificateType,
            certificatePath
        );

        console.log(`Certificate sent successfully to ${participantEmail}!`);
    } catch (error) {
        console.error(`Failed to send ${certificateType} certificate to ${participantEmail}:`, error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

export { sendCertificate };
