import { useState } from "react";
import { type RazorpayOrderResponse } from "~/pages/api/payment/create";
import { api } from "~/utils/api";
import { checkoutOptions } from "~/utils/razorPay";

type PropType = {
  amount: number;
  userId: string;
  name: string;
};

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function Payment({ amount, userId, name }: PropType) {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const savePayment = api.payment.createPayment.useMutation();

  async function displayRazorpay() {
    if (!isRazorpayLoaded) {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js",
      );
      if (!res) {
        alert("Razorpay failed to load!!");
        return;
      }
      setIsRazorpayLoaded(true);
    }

    // creating order in server
    const response = await fetch("http://localhost:3000/api/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount * 100 }), // Convert the amount to paise
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const paymentOrderData = (await response.json()) as RazorpayOrderResponse;
    const { order } = paymentOrderData;

    // creating checkout Option
    const paymentObject = new window.Razorpay(
      checkoutOptions(order, savePayment, name, userId) 
    );
    paymentObject.open();
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={displayRazorpay}>Pay now</button>
      </header>
    </div>
  );
}
