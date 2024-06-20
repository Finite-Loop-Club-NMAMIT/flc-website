"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

export default function Home() {
  const router = useRouter();

  const signUp = api.auth.signUp.useMutation();
  const sendVerificationEmail = api.auth.sendVerifyEmail.useMutation();

  const verifyEmail = api.auth.verifyEmail.useMutation();

  // const test = api.test.test.useMutation();

  return (
    <main className=" flex h-screen w-full flex-col items-center justify-center gap-10">
      <h1>hello this is titile</h1>

      <button
        onClick={() => {
          signUp.mutate({
            branchId: "clxn1c8xy0001kfh6fjdejjh8",
            email: "hsathwik002@gmail.com",
            name: "sathu",
            password: "password",
            confirmPassword: "password",
            phone: "9902130645",
            year: "2023",
          });
        }}
      >
        Create
      </button>

      <button
        onClick={() => {
          sendVerificationEmail.mutate({
            email: "hsathwik002@gmail.com",
          });
        }}
      >
        send
      </button>

      <button
        onClick={() => {
          verifyEmail.mutate({
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHhuaGRjNHQwMDAyNjEycTJ6bW45cHJzIiwianRpIjoiY2x4bmhlejBhMDAwNDYxMnFtNGMxNmlvbiIsImlhdCI6MTcxODkwMTIzNywiZXhwIjoxNzE4OTg3NjM3fQ.bdO-IcRJvEuNN2Dn2VXS2-t4uINoEB8kYdo9saUooPM",
          });
        }}
      >
        verify
      </button>

      <button
        onClick={async () => {
          const res = signIn("credentials", {
            email: "hsathwik002@gmail.com",
            password: "password",
            redirect: false,
          });
          res
            .then((res) => {
              res?.status === 200 && router.push("/home");
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        sign in
      </button>

      <button
        onClick={async () => {
          await signOut();
        }}
      >
        signout
      </button>

      {/* <button
        onClick={() => {
          test.mutate();
        }}
      >
        test protected ProcedureType
      </button> */}
    </main>
  );
}
