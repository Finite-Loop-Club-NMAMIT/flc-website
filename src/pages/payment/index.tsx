"use client";
import React, { useState } from "react";
import type { ReturnResponse1, ReturnResponse2 } from "../api/payment/status";

type UpiResponse = {
  shortURL: string | null;
  upiID: string | null;
  upiLink: string | null;
};

type ApiResponse = {
  upi: {
    paymentLink: UpiResponse;
    platformBillID: string;
  };
};

function Page() {
  const [paymentLink, setPaymentLink] = useState<UpiResponse>({
    shortURL: null,
    upiID: null,
    upiLink: null,
  });
  const [platformBillerId, setPlatformBillerId] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const getPaymentLink = async () => {
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 100,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch payment link");
      }
      const data: ApiResponse = await res.json();
      console.log(JSON.stringify(data.upi));
      console.log(data);

      setPaymentLink(data.upi.paymentLink);
      setPlatformBillerId(data.upi.platformBillID);
    } catch (error) {
      console.error("Error fetching payment link:", error);
      
    }
  };

  const mockPay = async () => {
    try {
      const res = await fetch("/api/payment/mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upiID: paymentLink.upiID,
          platformBillID: platformBillerId,
        }),
      });
      if (!res.ok) {
        throw new Error("Mock payment failed");
      }
      console.log("Mock payment successful:");
    } catch (error) {
      console.error("Error mocking payment:", error);
     
    }
  };

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/payment/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platformBillID: platformBillerId,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to check payment status");
      }
      const result = (await res.json()) as ReturnResponse1 | ReturnResponse2;
      if ("data" in result) {
        const { data } = result;
        setStatus(data.status);
      }
      console.log("Payment status checked:", JSON.stringify(result));
    } catch (error) {
      console.error("Error checking payment status:", error);
      
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h4 className="m-14">Payment Page</h4>
      <br />
      <br />
      {paymentLink && (
        <>
          <p>Payment Link Details:</p>
          <pre>{JSON.stringify(paymentLink, null, 2)}</pre>
        </>
      )}
      <p>Platform Biller ID: {platformBillerId}</p>
      {paymentLink.shortURL && (
        <iframe
          src={paymentLink.shortURL}
          style={{ width: "40%", height: "600px", border: "none" }}
          title="Payment"
          className="rounded-md"
        />
      )}
      <br />
      <button className="rounded-full bg-blue-500 p-3" onClick={getPaymentLink}>
        Get Payment Link
      </button>
      <br />
      <button className="rounded-full bg-blue-500 p-3" onClick={mockPay}>
        Mock Pay here!
      </button>
      <br />
      {status && (
        <div>
          {status === "PAYMENT_SUCCESSFUL" ? "SUCCESS" : "FAILURE/PENDING"}
        </div>
      )}
      <button className="rounded-full bg-blue-500 p-3" onClick={checkStatus}>
        Check Payment Status
      </button>
      <br />
    </div>
  );
}

export default Page;
