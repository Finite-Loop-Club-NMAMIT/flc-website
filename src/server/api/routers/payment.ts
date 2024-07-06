import { createPaymentZ } from "~/zod/paymentZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const payment = createTRPCRouter({
  createPayment: protectedProcedure
    .input(createPaymentZ)
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
