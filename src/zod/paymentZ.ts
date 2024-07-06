import { z } from "zod";

const createPaymentZ = z.object({
  userId: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
  payment_name: z.string(),
});

export { createPaymentZ };
