import { createTRPCRouter, protectedProcedure, publicProcedure, } from "../trpc"
import { TRPCError } from '@trpc/server';
import { getAllCertificationsByUserIdZ, getCertificationDetailsByIdZ, issueCertificateByEventIdZ } from '~/server/schema/zod-schema';
import { sendCertificate } from "~/utils/certificationEmail/email";
import { findEventIfExistById } from "~/utils/helper/findEventById";
import { checkOrganiser } from "~/utils/helper/organiserCheck";


export const certificateRouter = createTRPCRouter({
    // when this endpoint hits , it will search for  winners of that event , and create certificate for then , issuedate is now() ,
    //  and certificate type=winnertype    and also issuess certificate for participents
    issueCertificatesForWinnersAndParticipants: protectedProcedure
        .input(issueCertificateByEventIdZ)
        .mutation(async ({ input, ctx }) => {
            const { eventId } = input;
            const userId = ctx.session.user.id;

            await checkOrganiser(userId, input.eventId);
            try {
                // Check if the event exists
                const event = await findEventIfExistById(eventId);

                // Fetch winners of the event
                const winners = await ctx.db.winner.findMany({
                    where: { eventId },
                    include: {
                        Team: {
                            include: { Members: { select: { id: true, name: true, email: true } } }, // include email
                        },
                    },
                });

                if (winners.length === 0) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No winners found for this event',
                    });
                }

                // Create certificates for each winner and send email
                await Promise.all(
                    winners.map(async (winner) => {
                        const certificates = await ctx.db.certificate.createMany({
                            data: winner.Team.Members.map((member) => ({
                                issuedOn: new Date(),
                                certificateType: winner.winnerType,
                                userId: member.id,
                                eventId: event.id,
                            })),
                        });

                        // Send email to each winners(alltype)team member
                        await Promise.all(
                            winner.Team.Members.map((member) =>
                                sendCertificate(
                                    member.name,
                                    event.name,
                                    member.email,
                                    "Topperformer",
                                    winner.winnerType,
                                )
                            )
                        );

                        return certificates;
                    })
                );

                try {
                    // Fetch teams that are confirmed and have attended
                    const teams = await ctx.db.team.findMany({
                        where: { eventId, isConfirmed: true, hasAttended: true },
                        include: { Members: { select: { id: true, name: true, email: true } } }, // include email
                    });

                    if (teams.length === 0) {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: 'No participants found for this event But winners certification are isuued',
                        });
                    }

                    // Get all existing certificates for this event
                    const existingCertificates = await ctx.db.certificate.findMany({
                        where: { eventId },
                    });

                    // Extract userIds from existing certificates
                    const existingUserEventIds = existingCertificates.map(cert => cert.userId);

                    // Create certificates for each participant who does not have one yet
                    const certificates = [];

                    // Iterate through each team and its members
                    for (const team of teams) {
                        for (const member of team.Members) {
                            // Check if the member already has a certificate for this event
                            if (!existingUserEventIds.includes(member.id)) {
                                // If member does not have a certificate, create one
                                const certificate = await ctx.db.certificate.create({
                                    data: {
                                        issuedOn: new Date(),
                                        certificateType: 'PARTICIPATION',
                                        userId: member.id,
                                        eventId: event.id,
                                    },
                                });
                                certificates.push(certificate);

                                // Send email to the participant team
                                await sendCertificate(
                                    member.name,
                                    event.name,
                                    member.email,
                                    "Participation",

                                )
                            }
                        }
                    }
                } catch (error) {
                    if (error instanceof TRPCError) {
                        throw error;
                    } else {
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'An error occurred while issuing Participation certificates',
                        });
                    }
                }

                return { success: true };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An error occurred while issuing certificates',
                    });
                }
            }
        }),
    // Endpoint to get certification details by certification ID
    getCertificationDetailsById: publicProcedure
        .input(getCertificationDetailsByIdZ)
        .query(async ({ input, ctx }) => {
            const { certificateId } = input;

            try {
                const certificate = await ctx.db.certificate.findUnique({
                    where: { id: certificateId },
                    include:{Event:true,User:true}
                });

                if (!certificate) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Certificate not found',
                    });
                }
                return certificate;
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An error occurred while fetching the certificate details',
                    });
                }
            }
        }),

    // Endpoint to get all certifications of a particular user
    getAllCertificationsByUserId: publicProcedure
        .input(getAllCertificationsByUserIdZ)
        .query(async ({ input, ctx }) => {
            const { userId } = input;

            try {
                const certificates = await ctx.db.certificate.findMany({
                    where: { userId },
                    include:{Event:true}
                });

                if (certificates.length === 0) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No certificates found for this user',
                    });
                }
                return certificates;
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An error occurred while fetching the certificates',
                    });
                }
            }
        }),
});





// issueCertificatesForParticipants:---> code logic

// Get all existing certificates for the specified event (eventId)
// Example data:
// const existingCertificates = [
//     { userId: "member1", eventId: "event1" },
//     { userId: "member3", eventId: "event1" }
// ];

// Extract only the userIds from existingCertificates for quick lookup
// Example: existingUserEventIds = ['member1', 'member3']

// Initialize an empty array to store newly created certificates
// Example: certificates = []

// Iterate through each team and its members
// Example:
// - Processing Team 1: Team A
//   - Processing Member 1: John Doe (userId: 'member1')
//     - Check if 'member1' is in existingUserEventIds
//     - Since 'member1' already has a certificate for event1, skip creating a new one
//   - Processing Member 2: Jane Smith (userId: 'member2')
//     - 'member2' does not have a certificate for event1, so create a new 'PARTICIPATION' certificate

// - Processing Team 2: Team B
//   - Processing Member 1: Michael Brown (userId: 'member3')
//     - Check if 'member3' is in existingUserEventIds
//     - Since 'member3' already has a certificate for event1, skip creating a new one
//   - Processing Member 2: Emily Johnson (userId: 'member4')
//     - 'member4' does not have a certificate for event1, so create a new 'PARTICIPATION' certificate

// Add the newly created certificates to the certificates array
// Example: After processing all teams and members, certificates array will contain the newly created certificates

