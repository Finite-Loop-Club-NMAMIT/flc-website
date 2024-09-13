import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { type FunctionComponent, type ReactNode } from "react";
import { Toaster } from "sonner";

import Unauthorized from "~/components/auth/unauthorized";
import Footer from "~/components/footer";
import DashboardLayout from "~/components/layout/dashboardLayout";
import Loader from "~/components/loader";
import NavBar from "~/components/navBar";
import { useLoading } from "~/hooks";
import { cn } from "~/lib/utils";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { pathname, push: routerPush } = useRouter();
  const { status, data: session } = useSession();
  const { theme, systemTheme } = useTheme();
  const loading = useLoading();

  if (status === "loading" || loading)
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-[#0b011d]">
        <Loader />
      </div>
    );

  // Protected routes
  if (
    status === "unauthenticated" &&
    (pathname.startsWith("/dashboard") ||
      (pathname.startsWith("/profile") && !pathname.startsWith("/profile/")) ||
      pathname.startsWith("/register"))
  )
    void routerPush("/auth/login");

  // Protected routes with special previlages
  /* if (
    status === "authenticated" &&
    ((pathname.startsWith("/dashboard/organiser") &&
      session.user.role !== "ORGANISER" &&
      session.user.role !== "ADMIN") ||
      (pathname.startsWith("/dashboard/admin") &&
        session.user.role !== "ADMIN") ||
      pathname.startsWith("/dashboard"))
  )
    return <Unauthorized user={session.user} />; */

  if (pathname.startsWith("/dashboard"))
    return <DashboardLayout>{children}</DashboardLayout>;

  // Redirect to profile if authenticated
  if (status === "authenticated" && pathname.startsWith("/auth"))
    void routerPush("/profile");

  return (
    <div
      className={cn(
        theme === "light" || (theme === "system" && systemTheme === "light")
          ? "bg-yellow-50"
          : "bg-[#0b011d]",
        "dark relative h-fit min-h-screen w-full overflow-clip !text-white transition-all",
      )}
    >
      <NavBar />
      <main className="dark flex h-fit min-h-full w-full flex-col pt-[calc(4rem_+_1rem)]">
        {children}
      </main>
      <Footer className="z-50" />
      <Toaster />
    </div>
  );
};

export default Layout;
