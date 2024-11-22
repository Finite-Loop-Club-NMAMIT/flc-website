import { Pencil } from "lucide-react";
import { signOut } from "next-auth/react";
import React, { forwardRef } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { LuLogOut, LuShare2 } from "react-icons/lu";
import { toast } from "sonner";

import NotFound from "~/pages/404";

import { Button } from "~/components/ui/button";

import EditUserForm from "~/components/profile/editUserForm";
import ProfileImage from "~/components/profile/profileImage";
import QRCode from "~/components/profile/qrcode";
import { RadialCard } from "~/components/utils/radialCard";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import { type User, useUser } from "~/store";

const LeftPanel = forwardRef<
  HTMLDivElement,
  { className?: string; notMine: boolean }
>(({ className, notMine }, ref) => {
  const { user } = useUser();
  if (!user) return <NotFound />;
  return (
    <InnerLeftPanel
      ref={ref}
      className={className}
      user={user}
      notMine={notMine}
    />
  );
});
LeftPanel.displayName = "LeftPanel";

const InnerLeftPanel = forwardRef<
  HTMLDivElement,
  { className?: string; user: User; notMine: boolean }
>(({ className, user, notMine }, ref) => {
  return (
    <RadialCard
      ref={ref}
      className={cn(
        className,
        "relative flex flex-col items-center justify-evenly gap-3 overflow-auto overflow-x-clip rounded-lg bg-card p-10 pt-14",
      )}
    >
      <Button
        variant={"default"}
        size="ssm"
        className="absolute right-0 top-0 m-4 px-2"
        onClick={async () => {
          await navigator.clipboard.writeText(
            env.NEXT_PUBLIC_CANONICAL_URL + "profile/" + user.id,
          );
          toast.success("Copied to clipboard");
        }}
      >
        <LuShare2 className="size-6" />
      </Button>
      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row">
        <ProfileImage notMine={notMine} />
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="text-center text-2xl">
            <div>
              <p className="inline text-center text-4xl font-semibold ">
                {user.name}
              </p>
              {!notMine && (
                <EditUserForm>
                  <Pencil className="ml-2 size-5"></Pencil>
                </EditUserForm>
              )}
            </div>
            <p className="flex flex-row items-center justify-center gap-2 text-base opacity-60">
              {user.memberSince ? (
                <>
                  Member
                  <BsPatchCheckFill className="mt-[0.3px] text-green-500" />
                </>
              ) : (
                "Non-Member"
              )}
            </p>
          </div>

          <div className="flex gap-5">
            {/* NOTE: Register button is inside */}
            {!notMine && <QRCode />}
            {!notMine && (
              <Button
                onClick={() =>
                  signOut({
                    redirect: false,
                  })
                }
              >
                Sign out
                <LuLogOut className="ml-2 size-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-3 self-start text-lg *:col-span-2 first:*:*:opacity-60 md:mx-10">
        {!notMine && (
          <div className="md:col-span-1">
            <p>Phone</p>
            <p>{user.phone}</p>
          </div>
        )}
        <div className="md:col-span-1">
          <p>USN</p>
          <p>{user.usn}</p>
        </div>
        <div>
          <p>Branch</p>
          <p>{user.Branch.name}</p>
        </div>
        {!notMine && (
          <div>
            <p>Email</p>
            <p>{user.email}</p>
          </div>
        )}
        <div>
          <p>Bio</p>
          <p>{user.bio.length > 0 ? user.bio : "-"}</p>
        </div>
      </div>
    </RadialCard>
  );
});
InnerLeftPanel.displayName = "InnerLeftPanel";

export default LeftPanel;
