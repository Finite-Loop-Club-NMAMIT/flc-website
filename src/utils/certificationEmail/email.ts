import * as fs from "fs";
import * as path from "path";
import * as nodemailer from "nodemailer";
import htmlToImage from "node-html-to-image";

const srcPath = process.cwd();

async function generateCertificate(
    participantName: string,
    eventName: string,
    certificateType: "Participation" | "Topperformer",
    winnerType?: "WINNER" | "RUNNER_UP" | "SECOND_RUNNER_UP"
): Promise<Buffer> {
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

        const imageBuffer = await htmlToImage({ html }) as Buffer;  // Ensure imageBuffer is a Buffer

        if (!imageBuffer) {
            throw new Error("No image buffer generated");
        }

        // Removed file saving logic here

        console.log("Certificate generated successfully");
        return imageBuffer;  // Return the image buffer directly
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
    attachmentBuffer: Buffer
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
            attachments: [{ filename: "certificate.png", content: attachmentBuffer }],  // Attach buffer directly
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

        const certificateBuffer = await generateCertificate(
            participantName,
            eventName,
            certificateType,
            winnerType
        );

        await sendEmailWithAttachment(
            participantName,
            participantEmail,
            eventName,
            certificateType,
            certificateBuffer
        );

        console.log(`Certificate sent successfully to ${participantEmail}!`);
    } catch (error) {
        console.error(`Failed to send ${certificateType} certificate to ${participantEmail}:`, error);
        throw error;
    }
}

export { sendCertificate };
