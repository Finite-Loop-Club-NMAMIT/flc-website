"use client";
import {type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

import React, { useState } from "react";
import Payment from "~/components/PaymentButton";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

function Page() {

 const session = useSession();
 const userId = session?.data?.user.id??undefined;
 console.log(session?.data?.user.id) 

  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Payment amount={201} name="Let him cook" userId={userId!}></Payment>{" "}
      
      {/* {userId as string} */}
      {/*Add amount in rupees */}
    </div>
  );
}

export default Page;
