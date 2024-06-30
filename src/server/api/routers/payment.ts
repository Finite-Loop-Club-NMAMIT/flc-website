
import { createTRPCRouter,protectedProcedure } from "../trpc";
import {z} from "zod"


const createType = z.object({
  userId: z.string(),  
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature:z.string(),
  payment_name: z.string(),
});

export const payment = createTRPCRouter({
  getAllPayments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.payment.findMany();
  }),

  createPayment: protectedProcedure
    .input(createType)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.payment.create({
        data: {
          userId: input.userId,
          paymentName: input.payment_name,
          razorpayPaymentId: input.razorpay_payment_id,
          razorpayOrderId: input.razorpay_order_id,
          razorpaySignature: input.razorpay_signature,
        },
      });
    }),
});