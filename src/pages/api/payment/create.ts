
import { upiDL } from "~/utils/setuUPI";
import type { NextApiRequest, NextApiResponse } from "next";


 type RequestBody = {
  amount:number
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
      if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
      }

      try {
        const body = req.body as RequestBody;
        const {amount } = body;
        console.log(amount)

        const data = await upiDL.createPaymentLink({
          amountValue: amount??20000, // amount in paisa
          billerBillID: "FLC-24-0001", // Unique merchant platform identifier for bill
          amountExactness: "EXACT",
          payeeName: "Finite Loop Club",
          transactionNote: "Club Registration Fee",
        });
        res.json({ upi: data });
      } catch (err) {
        res.json({ error: err });
      }
  
}
