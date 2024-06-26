import { env } from "process";
import Razorpay from "razorpay"


export const instance = new Razorpay({
  key_id: env.NEXT_RAZORPAY_API_KEY_ID!,
  key_secret: env.NEXT_RAZORPAY_SECRET,
});
