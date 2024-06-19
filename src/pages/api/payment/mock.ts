import type { NextApiRequest, NextApiResponse } from "next";
import { upiDL } from "~/utils/setuUPI";

type RequestBody = {
  platformBillID: string;
  upiID: string;
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
    const { platformBillID, upiID } = body;

    
    const data = await upiDL.triggerMockPayment({
      amountValue: 200, // amount in rupees
      platformBillID: platformBillID,
      vpa: upiID, // Merchant VPA
    });

    console.log(data);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(400).json({ error: "Invalid request body" });
  }
}
