"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

export default function Home() {
  const router = useRouter();

  const signUp = api.auth.signUp.useMutation();
  const sendVerificationEmail = api.auth.sendVerifyEmail.useMutation();
  const sendPasswordResetEmail = api.auth.sendPasswordResetEmail.useMutation();
  const resetPassword = api.auth.resetPassword.useMutation();
  const verifyEmail = api.auth.verifyEmail.useMutation();

  // const test = api.test.test.useMutation();

  return (
    <main className=" flex h-screen w-full flex-col items-center justify-center gap-10">
      <h1>hello this is titile</h1>

      <button
        onClick={() => {
          signUp.mutate({
            branchId: "clxiirynf00014vz8ayf6zotf",
            email: "nnm22cs094@nmamit.in",
            name: "Omkar Prabhu",
            password: "password",
            confirmPassword: "password",
            phone: "9448846524",
            year: "2023",
          });
        }}
      >
        Create
      </button>

      <button
        onClick={() => {
          sendVerificationEmail.mutate({
            email: "nnm22cs094@nmamit.in",
          });
        }}
      >
        send verifyEmail
      </button>
      <button
        onClick={() => {
          sendPasswordResetEmail.mutate({
            email: "nnm22cs094@nmamit.in",
          });
        }}
      >
        send password reset emaik
      </button>

      <button
        onClick={() => {
          verifyEmail.mutate({
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHhpa2pyb2gwMDAwM2J6bHFzZzV6bmhkIiwianRpIjoiY2x4aWwybWwxMDAwNDNiemxtdzF5MXE3bCIsImlhdCI6MTcxODYwNTA0OCwiZXhwIjoxNzE4NjkxNDQ4fQ.PxCSSYpXn2XFUQeJVPb0O95ZKEJKsIMKxmVH9ceXOfI",
          });
        }}
      >
        verify email
      </button>

      <button
        onClick={() => {
          resetPassword.mutate({
            newPassword: "password2",
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHhpa2pyb2gwMDAwM2J6bHFzZzV6bmhkIiwianRpIjoiY2x4cHNwMjVkMDAwM2Uxd2Roc2ljNTR1eiIsImlhdCI6MTcxOTA0MTExNSwiZXhwIjoxNzE5MTI3NTE1fQ.CLpTdZUn74b6BmBYr8o19hjVwnbq9u8g_f184xvxSU4",
          });
        }}
      >
        reset password
      </button>

      <button
        onClick={async () => {
          const res = signIn("credentials", {
            email: "nnm22cs094@nmamit.in",
            password: "password2",
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
