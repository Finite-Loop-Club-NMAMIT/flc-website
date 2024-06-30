import { z } from "zod";

const issueCertificateByEventIdZ = z.object({
    eventId: z.string(),
});
const getCertificationDetailsByIdZ = z.object({
    certificateId: z.string(),
});

const getAllCertificationsByUserIdZ = z.object({
    userId: z.string(),
});
export {
    issueCertificateByEventIdZ,
    getCertificationDetailsByIdZ,
    getAllCertificationsByUserIdZ
}