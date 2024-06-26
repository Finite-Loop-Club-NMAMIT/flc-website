"use client";
import React, { useState } from "react";
import Payment from "~/components/PaymentButton";

function Page() {
 
  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
     
      <Payment></Payment>
    </div>
  );
}

export default Page;
