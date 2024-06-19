import type{ NextApiRequest, NextApiResponse } from "next";

import { upiDL } from "~/utils/setuUPI";


export type ReturnResponse1 = {
  success: boolean;
  data: {
    amountPaid: { currencyCode: string; value: number };
    billerBillID: string;
    createdAt: string;
    expiresAt: string;
    name: string;
    payerVpa: string;
    paymentLink: {
      upiID: string;
      upiLink: string;
    };
    platformBillID: string;
    receipt: { date: string; id: string };
    status: string;
    transactionNote: string;
  };
};

export type ReturnResponse2 = {
  error: string;
  status: number;
};
type statusRequest = {
  platformBillID: string;
};


export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
  
    const body = req.body as statusRequest;
    console.log("Request body:", body); 

    const { platformBillID } = body;

   
    const data = await upiDL.getPaymentStatus(platformBillID);
    console.log("Payment status data:", data);
    
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error processing request:", err);

    
    res.status(400).json(
      { error: "Invalid request body", status: 400 },
      
    );
  }
}
