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
    <div>
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
          signOut({ callbackUrl: "/" });
          router.push("/");
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
export default Home;
