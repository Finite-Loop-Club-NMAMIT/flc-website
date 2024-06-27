import {type RazorpayOrderResponse } from "~/pages/api/payment/create";
import {type  UseTRPCMutationResult } from "@trpc/react-query/shared";
import {type  TRPCClientErrorLike } from "@trpc/client";
import { type TRPC_ERROR_CODE_KEY, type TRPC_ERROR_CODE_NUMBER } from "@trpc/server/unstable-core-do-not-import";
import { type typeToFlattenedError } from "zod";

type response = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export function checkoutOptions(
  order: RazorpayOrderResponse["order"],
  savePayment: UseTRPCMutationResult<{ id: string; userId: string; paymentName: string; razorpayPaymentId: string; razorpayOrderId: string; razorpaySignature: string; }, TRPCClientErrorLike<{ input: { userId: string; razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; payment_name: string; }; output: { id: string; userId: string; paymentName: string; razorpayPaymentId: string; razorpayOrderId: string; razorpaySignature: string; }; transformer: true; errorShape: { data: { zodError: typeToFlattenedError<any, string> | null; code: TRPC_ERROR_CODE_KEY; httpStatus: number; path?: string; stack?: string; }; message: string; code: TRPC_ERROR_CODE_NUMBER; }; }>, { userId: string; razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; payment_name: string; }, unknown>,
  payment_name:string,
  userId: string,
 
  description?: string,
  currency?: string,
) {
  return {
    key: process.env.NEXT_RAZORPAY_API_KEY_ID, // Use the public environment variable
    amount: order.amount,
    currency: currency ?? "INR",
    name: "FiniteLoop Club",
    description: description ?? "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: order.id, //used for opening gateway
    handler: async function (response: response) {
      //on success ass to Database
      alert("Saving details in the Database...");

      try {
        await savePayment.mutateAsync({
          userId: userId ?? "123", // Replace with actual user ID
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          payment_name: payment_name?? "Test Payment",
        });

        alert("Payment details saved successfully");
      } catch (error) {
        console.error("Error saving payment details:", error);
        alert("Failed to save payment details");
      }
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
}