"use client";
import React, { useState } from "react";
import { SetuUPIDeepLink } from "@setu/upi-deep-links";

const PaymentPage = () => {
  const [paymentLink, setPaymentLink] = useState(null);

  const generateLink = async () => {
    const upidl = SetuUPIDeepLink({
      schemeID: "bf09f025-4ba5-4a12-9f49-862dd9a471f2",
      secret: "fc86cc97-fb4b-48cb-887a-437833856c68",
      productInstanceID: "1441474087871317087",
      mode: "SANDBOX",
      authType: "JWT",
    });

    try {
      const data = await upidl.createPaymentLink({
        amountValue: 20000, // amount in paisa
        billerBillID: "12334545656", // Unique merchant platform identifier for bill
        amountExactness: "EXACT",
       
      });

      setPaymentLink(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div>
        <h1>Our Payment Page</h1>
        {paymentLink && <div>Payment Link: {paymentLink}</div>}
      </div>
      <button onClick={generateLink} className="mt-4 rounded bg-blue-500 p-2">
        Generate Payment Link
      </button>
    </div>
  );
};

export default PaymentPage;
