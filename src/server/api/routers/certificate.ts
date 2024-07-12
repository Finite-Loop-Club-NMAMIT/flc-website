import { createTRPCRouter, protectedProcedure, publicProcedure, } from "../trpc"
import { sendCertificate } from "~/utils/certificationEmail/email";
import { checkOrganiser, findEventIfExistById } from "~/utils/helper";
import { getAllCertificationsByUserIdZ, getCertificationDetailsByIdZ, issueCertificateByEventIdZ } from "~/zod/certificate";



export const certificateRouter = createTRPCRouter({
  issueCertificatesForWinnersAndParticipants: protectedProcedure
    .input(issueCertificateByEventIdZ)
    .mutation(async ({ input, ctx }) => {
      const { eventId } = input;
      const reqUser = ctx.session.user;
      await checkOrganiser(reqUser.id, input.eventId, reqUser.role);

      const event = await findEventIfExistById(eventId);
      // Create certificates for each winner and send email
      const winners = await ctx.db.winner.findMany({
        where: { eventId },
        include: {
          Team: {
            include: { Members: { select: { id: true, name: true, email: true } } }, // include email
          },
        },
      });
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
      // Issue for Participents
      const teams = await ctx.db.team.findMany({
        where: { eventId, isConfirmed: true, hasAttended: true },
        include: { Members: { select: { id: true, name: true, email: true } } },
      });


      const existingCertificates = await ctx.db.certificate.findMany({
        where: { eventId },
      });
      const existingUserEventIds = existingCertificates.map(cert => cert.userId);
      const certificates = [];

      for (const team of teams) {
        for (const member of team.Members) {
          if (!existingUserEventIds.includes(member.id)) {
            const certificate = await ctx.db.certificate.create({
              data: {
                issuedOn: new Date(),
                certificateType: 'PARTICIPATION',
                userId: member.id,
                eventId: event.id,
              },
            });
            certificates.push(certificate);
            await sendCertificate(
              member.name,
              event.name,
              member.email,
              "Participation",

            )
          }
        }
      }


      return { success: true };

    }),

  getCertificationDetailsById: publicProcedure
    .input(getCertificationDetailsByIdZ)
    .query(async ({ input, ctx }) => {
      const { certificateId } = input;
      const certificate = await ctx.db.certificate.findUnique({
        where: { id: certificateId },
        include: { Event: true, User: true }
      });
      return certificate;
    }),

  getAllCertificationsByUserId: publicProcedure
    .input(getAllCertificationsByUserIdZ)
    .query(async ({ input, ctx }) => {
      const { userId } = input;
      const certificates = await ctx.db.certificate.findMany({
        where: { userId },
        include: { Event: true }
      });
      return certificates;
    }),
});

