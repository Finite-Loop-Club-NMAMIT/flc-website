import type { NextApiRequest, NextApiResponse } from "next";
import { instance } from "razorpay.config";

// export const instance = new Razorpay({
//   key_id: env.NEXT_RAZORPAY_API_KEY_ID!,
//   key_secret: env.NEXT_RAZORPAY_SECRET!,
// });

type RequestBody = {
  amount: number;
  currency: string;
  receipt: string;
};

export type RazorpayOrderResponse = {
 
  order:{
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: [];
  offer_id: string;
  receipt: string;
  status: string;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if (req.method !== "POST") {
  //   res.setHeader("Allow", ["POST"]);
  //   res.status(405).end(`Method ${req.method} Not Allowed`);
  //   return;
  // }

  const body = req.body as RequestBody;
  const { amount, currency, receipt } = body;

  const options = {
    amount: amount ?? 100, // amount in the smallest currency unit
    currency: currency ?? "INR",
    receipt: receipt ?? "order_rcptid_11",
  };

  try {
    const order = await instance.orders.create(options);
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
