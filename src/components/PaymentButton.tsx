import Image from "next/image";
import {type RazorpayOrderResponse } from "~/pages/api/payment/create";

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

function Payment() {
  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );

    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }

    const response = await fetch("http://localhost:3000/api/payment/create", { method: "GET", }) 
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
     }

    const data = await response.json() as RazorpayOrderResponse;
    
    const {order}  = data  ;
    console.log(order)

    const options = {
      key: process.env.NEXT_RAZORPAY_API_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: "http://localhost:3000/payment",
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
     paymentObject.open() ;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Image
          src="https://res.cloudinary.com/dh0sqelog/image/upload/v1718882172/vik8ommaiq0srt5p6h1x.jpg"
          className="App-logo w-12 rounded-full"
          alt="logo"
          width={12}
          height={12}
        />
        <button onClick={displayRazorpay}>Pay now</button>
      </header>
    </div>
  );
}

export default Payment;
