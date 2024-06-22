import { adminProcedure, createTRPCRouter, } from "../trpc"
import { TRPCError } from '@trpc/server';
import { issueCertificateByEventIdZ } from '~/server/schema/zod-schema';
import { findEventIfExistById } from "~/utils/helper/findEventById";

export const certificateRouter = createTRPCRouter({
    // when this endpoint hits , it will search for  winners of that event , and create certificate for then , issuedate is now() , and certificate type=winnertype   
    issueCertificatesForWinners:adminProcedure
        .input(issueCertificateByEventIdZ)
        .mutation(async ({ input, ctx }) => {
            const { eventId } = input;

            try {
                // Check if the event exists
                const event = await findEventIfExistById(eventId)
                // Fetch winners of the event
                const winners = await ctx.db.winner.findMany({
                    where: { eventId },
                    include: {
                        Team: {
                            include: { Members: { select: { id: true, name: true } } },
                        },
                    },
                });

                if (winners.length === 0) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No winners found for this event',
                    });
                }

                // Create certificates for each winner
                const certificates = await Promise.all(
                    winners.map(async (winner) => {  // For each winner, map through their team members and create certificates
                        return ctx.db.certificate.createMany({
                            data: winner.Team.Members.map((member) => ({
                                issuedOn: new Date(),
                                certificateType: winner.winnerType,
                                userId: member.id,
                                eventId: event.id,
                            })),
                        });
                    })
                );

                return { success: true, certificates };
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
    // when this endpoint  it will search for teams , which is isComfrimed, hasAttended , and create certificate for then with same date , and certificate type =PARTICIPATION
    issueCertificatesForParticipants:adminProcedure
        .input(issueCertificateByEventIdZ)
        .mutation(async ({ input, ctx }) => {
            const { eventId } = input;

            try {
                // Check if the event exists
                const event = await findEventIfExistById(eventId)

                // Fetch teams that are confirmed and have attended
                const teams = await ctx.db.team.findMany({
                    where: { eventId, isConfirmed: true, hasAttended: true },
                    include: { Members: { select: { id: true, name: true } } },
                });

                if (teams.length === 0) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No participants found for this event',
                    });
                }

                // Get all existing certificates for this event
                const existingCertificates = await ctx.db.certificate.findMany({
                    where: { eventId },
                });
                // Extract userIds from existing certificates
                const existingUserEventIds = existingCertificates.map(cert => cert.userId);

                // Create certificates for each participant who does not have one yet

                const certificates = []; // array copy

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
                            certificates.push(certificate); // Push the created certificate to the certificates arra
                        }
                    }
                }

                return { success: true, certificates };
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

