import { EventType } from "@prisma/client";
import { Button } from "@radix-ui/themes";
import { set } from "date-fns";
import { X } from "lucide-react";
import React, { type FunctionComponent, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "~/components/ui/dialog";

import Payment from "~/components/razorPay/paymentButton";
import CopyBtn from "~/components/utils/copyBtn";
import { api } from "~/utils/api";

import CreateTeam from "./createTeam";
import JoinTeam from "./joinTeam";

const TeamDialog: FunctionComponent<{
  flcAmount: number;
  nonFlcAmount: number;
  eventId: number;
  maxTeamSize: number;
  eventName: string;
  eventType: EventType;
  refetchEvent: () => void;
}> = ({
  eventId,
  maxTeamSize,
  flcAmount,
  nonFlcAmount,
  eventName,
  eventType,
  refetchEvent,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [teamConfirmed, setTeamConfirmed] = useState(false);
  const [flcMembersCount, setFlcMembersCount] = useState(0);
  const [nonFlcMembersCount, setNonFlcMembersCount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [inATeam, setInATeam] = useState(false);

  const { data: paymentStatus, refetch: refetchPaymentStatus } =
    api.payment.checkEventPayment.useQuery(
      { eventName, paymentId: paymentId ?? "" },
      {
        enabled: !!paymentId,
      },
    );

  const { data: teamData, refetch: refetchTeamData } =
    api.team.inATeamOfEvent.useQuery({ eventId });

  const confirmTeam = api.team.confirmTeam.useMutation();
  const leaveTeam = api.team.leaveTeam.useMutation();
  const removeFromTeam = api.team.removeFromTeam.useMutation();

  const soloReg = api.team.soloTeamRegistration.useMutation({
    onSuccess: async () => {
      toast.success("Thankyou for registering");
      refetchEvent();
      await refetchTeamData();
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  useEffect(() => {
    if (teamData?.isConfirmed) setTeamConfirmed(true);
  }, [teamData?.isConfirmed]);

  useEffect(() => {
    if (!teamData) return;
    if (teamData.isConfirmed) setTeamConfirmed(true);
    setIsTeamLeader(teamData?.isLeader);
    setTeamId(teamData.id);
    setInATeam(true);
  }, [teamData]);

  useEffect(() => {
    if (teamData && isTeamLeader && !teamData.isConfirmed) {
      const flcMembersCount = teamData?.Members?.filter(
        (member) => member.memberSince !== null,
      ).length;
      const nonFlcMembersCount = teamData?.Members?.filter(
        (member) => member.memberSince === null,
      ).length;
      const amountToPay =
        flcMembersCount * flcAmount + nonFlcMembersCount * nonFlcAmount;
      setFlcMembersCount(flcMembersCount);
      setNonFlcMembersCount(nonFlcMembersCount);
      setAmount(amountToPay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeamLeader]);

  useEffect(() => {
    if (paymentId) void refetchPaymentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  useEffect(() => {
    if (paymentStatus && teamData?.id)
      confirmTeam.mutate(
        { teamId: teamData.id },
        {
          onSuccess: () => {
            toast.success("Team Confirmed");
            setTeamConfirmed(true);
          },
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus]);

  return eventType === "TEAM" ? (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button className="card-button z-20">
          {inATeam ? "View Team" : "Register"}
        </Button>
      </DialogTrigger>

      {/* {!paymentStatus && (
        <Payment
          paymentType="EVENT"
          amountInINR={amount}
          teamId={""}
          description="Event Registration"
          onSuccess={() => {
            void refetchPaymentStatus();
          }}
          onFailure={() => {
            toast.error("Payment failed!");
          }}
        />
      )} */}
      {/*
      <Button className="card-button z-20" onClick={() => setOpen(true)}>
        {teamConfirmed ? "View Team" : "Register"}
      </Button> */}

      <DialogContent className="intro-card w-[90%] border-none !opacity-100  sm:mx-0 sm:w-[40%]">
        <DialogClose asChild>
          <button
            className="absolute right-1.5 top-1.5 z-30 p-1.5 text-gray-600 hover:text-white"
            aria-label="Close"
          >
            <X />
          </button>
        </DialogClose>
        {!teamData && (
          <>
            <DialogTitle>Join | Create Team</DialogTitle>
            <DialogDescription>
              Choose whether you&apos;d like to create a new team or join an
              existing one.
            </DialogDescription>

            <div className="flex flex-col gap-4">
              {!isCreatingTeam && !isJoiningTeam && (
                <div className="flex flex-col gap-4">
                  <Button
                    className="card-button mx-auto w-[40%]"
                    onClick={() => setIsCreatingTeam(true)}
                  >
                    Create Team
                  </Button>
                  <Button
                    className="card-button mx-auto w-[40%]"
                    onClick={() => setIsJoiningTeam(true)}
                  >
                    Join Team
                  </Button>
                </div>
              )}

              {isCreatingTeam && !isJoiningTeam && (
                <CreateTeam
                  eventId={eventId}
                  onTeamCreate={() => {
                    void refetchTeamData();
                    setIsCreatingTeam(false);
                  }}
                  onGoBack={() => setIsCreatingTeam(false)}
                />
              )}

              {isJoiningTeam && !isCreatingTeam && (
                <JoinTeam
                  eventId={eventId}
                  onGoBack={() => setIsJoiningTeam(false)}
                  onJoinTeam={() => {
                    void refetchTeamData();
                    setIsJoiningTeam(false);
                  }}
                />
              )}
            </div>
          </>
        )}

        {teamData && (
          <>
            <DialogTitle className="flex items-center justify-between">
              <p className="events-heading text-2xl font-bold capitalize">
                {teamData?.name}
              </p>
              {!teamConfirmed && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs">Share team id to join</p>
                  <div className="flex gap-2">
                    <input
                      className=" card-attributes flex-1 rounded-lg p-1.5 text-xs text-white"
                      type="text"
                      value={teamId?.toString()}
                      disabled
                    />
                    <CopyBtn value={teamId?.toString()} />
                  </div>
                </div>
              )}
            </DialogTitle>
            <DialogDescription>
              {teamData?.Members?.length} members in this team. (Max{" "}
              {maxTeamSize})
            </DialogDescription>

            <div>
              {teamData?.Members?.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <p className="capitalize">{member.name}</p>
                  {!teamConfirmed &&
                    isTeamLeader &&
                    member.id != teamData.userId && (
                      <button
                        onClick={() => () => {
                          removeFromTeam.mutate(
                            { teamId: teamData.id, userId: member.id },
                            {
                              onSuccess: () => {
                                void refetchTeamData();
                              },
                            },
                          );
                        }}
                        className="z-30"
                      >
                        <p className="rounded-full border px-2 py-1 text-xs text-white hover:bg-red-600 ">
                          Remove
                        </p>
                      </button>
                    )}

                  {!teamConfirmed &&
                    !isTeamLeader &&
                    member.id === teamData.userId && (
                      <button
                        onClick={() => {
                          if (teamId) {
                            toast.loading("Leaving team...");
                            leaveTeam.mutate(
                              { teamId: teamId },
                              {
                                onSuccess: () => {
                                  toast.dismiss();
                                  void refetchTeamData();
                                  toast.success("Left team successfully!");
                                },
                                onError: ({ message }) => {
                                  toast.dismiss();
                                  toast.error(message);
                                },
                              },
                            );
                          } else {
                            toast.error("Couldnt remove you from team");
                          }
                        }}
                        className="z-30"
                      >
                        <p className="rounded-lg border px-1 text-xs text-white hover:bg-red-600">
                          Leave Team
                        </p>
                      </button>
                    )}
                </div>
              ))}
            </div>

            {!teamConfirmed && isTeamLeader && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-red-600">
                  <span className="font-bold">Warning: </span>Proceed to confirm
                  only when all the team members have joined. You won&apos;t be
                  able to add or delete more members after.
                </p>
                {!teamConfirmed &&
                  ((!nonFlcMembersCount && !flcAmount) ||
                    (!nonFlcAmount && !flcAmount) ||
                    (!nonFlcAmount && !flcMembersCount)) && (
                    <Button
                      className="card-button "
                      onClick={() => {
                        if (teamData.id) {
                          confirmTeam.mutate(
                            { teamId: teamData.id },
                            {
                              onSuccess: () => {
                                toast.success("Team Confirmed");
                                setTeamConfirmed(true);
                              },
                            },
                          );
                        }
                      }}
                    >
                      Confirm Team
                    </Button>
                  )}
                {!teamConfirmed &&
                  ((nonFlcMembersCount && nonFlcAmount) ||
                    (flcAmount && flcMembersCount) ||
                    "") && (
                    <Payment
                      paymentType="EVENT"
                      amountInINR={amount}
                      teamId={teamData.id}
                      description={eventName}
                      onSuccess={(paymentId: string) => {
                        setPaymentId(paymentId);
                      }}
                      onFailure={() => {
                        toast.error("Payment failed!");
                      }}
                    />
                  )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  ) : (
    <>
      {/* <Button className="card-button z-20"

      >
        {inATeam ? "Thankyou for registering" : "Register"}
      </Button> */}
      {inATeam ? (
        <h3 className="pt-8 text-lg font-semibold">
          Thank you for registering!!
        </h3>
      ) : (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
          <DialogTrigger asChild>
            <Button className="card-button z-20">Register</Button>
          </DialogTrigger>
          <DialogContent className="intro-card w-[90%] border-none !opacity-100  sm:mx-0 sm:w-[40%]">
            <DialogClose asChild>
              <button
                className="absolute right-1.5 top-1.5 z-30 p-1.5 text-gray-600 hover:text-white"
                aria-label="Close"
              >
                <X />
              </button>
            </DialogClose>

            <DialogTitle>
              Are you sure you want to register for this event?
            </DialogTitle>

            <DialogFooter className="flex w-full justify-between">
              <Button
                className="card-button z-20"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                className="card-button z-20"
                onClick={async () => {
                  await soloReg.mutateAsync({ eventId });
                }}
              >
                Register
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default TeamDialog;
