import { useSession } from "next-auth/react";

export default function Page() {
const status="DEVELOPMENT";

const setuUrl =
  status == "DEVELOPMENT"
    ? "https://uat.setu.co/api"
    : "https://prod.setu.co/api";

    console.log(process.env.MERCHANT_ID)

  // const{data:session}= useSession()
  
  // gotta get accessToken
  const accessToken="DUMMYACCESSTOKEN"
  const header = {
    "X-Setu-Product-Instance-ID": process.env.MERCHANT_ID,
    "authorization": `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };


  return (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
    <h1>Pay Here Brother</h1>
  </div>
  );
  
  
}