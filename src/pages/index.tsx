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
            branchId: "clxo9upud000161ci3havtfke",
            email: "sathwikhh@gmail.com",
            name: "sathwik",
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
            email: "sathwikhh@gmail.com",
          });
        }}
      >
        send verifyEmail
      </button>
      <button
        onClick={() => {
          sendPasswordResetEmail.mutate({
            email: "nnm22is144@nmamit.in",
          });
        }}
      >
        send password reset emaik
      </button>

      <button
        onClick={() => {
          verifyEmail.mutate({
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHhvcXMzbzMwMDAwMTN2aWt2NzJrN3M2IiwianRpIjoiY2x4b3FzOTI3MDAwMjEzdmlyNHQ2ZGFkdyIsImlhdCI6MTcxODk3NzQzOSwiZXhwIjoxNzE5MDYzODM5fQ.uPsK9Me38dAZVQJdj4-Kb9AtI6i49YcW45eTlQ6-4vE",
          });
        }}
      >
        verify email
      </button>

      <button
        onClick={() => {
          resetPassword.mutate({
            newPassword: "password3",
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHhvYTZ2YTMwMDA0NDR2ZHByODltMzh2IiwianRpIjoiY2x4cmxuZzBwMDAwMW02MzBpN253bzF3MiIsImlhdCI6MTcxOTE1MDIxNSwiZXhwIjoxNzE5MjM2NjE1fQ.wzcqtyqnGpdxVMCdNqGob1Faz8AWef9SQunoVbReWcc",
          });
        }}
      >
        reset password
      </button>

      <button
        onClick={async () => {
          const res = signIn("credentials", {
            email: "nnm22is144@nmamit.in",
            password: "password3",
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
