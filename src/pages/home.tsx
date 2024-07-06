import { signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";
import { InferGetServerSidePropsType, type GetServerSideProps } from "next";
import { useRouter } from "next/navigation";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

function Home() {
  const router = useRouter();
  console.log("WORKS");
  const session = useSession();

  console.log("WORKS");

  console.log("session.accessToken", session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Welcome to the home page</h1>
      <p>Hi {JSON.stringify(session?.data)}</p>

      {/* <form
        action={async () => {
          "use server";
          await unstable_update({
            accessToken: session?.accessToken,
          });
        }}
      >
        <button type="submit">Update</button>
      </form> */}
      <button
        onClick={() => {
          void signOut({ callbackUrl: "/" });
          router.push("/");
        }}
      >
        Sign Out
      </button>
      {/* <Test /> */}
    </main>
  );
}
export default Home;
