"use client";

import { format } from "date-fns";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

import NotFound from "~/pages/404";

import { Badge } from "~/components/ui/badge";
import { AvatarGroup } from "~/components/ui/custom/avatar-group";
import { Input } from "~/components/ui/input";

import TeamDialog from "~/components/events/team";
import Loader from "~/components/loader";
import CopyBtn from "~/components/utils/copyBtn";
import { api } from "~/utils/api";

const EventsSlug: NextPage = () => {
  const router = useRouter();

  const { data: user } = api.user.getUser.useQuery();

  const { data: session } = useSession();

  const id = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const path = usePathname();

  const url = `https://finiteloop.co.in${path}`;

  const {
    data: event,
    isLoading,
    status,
    refetch,
  } = api.event.getEventById.useQuery({
    eventId: parseInt(id!),
  });

  if (isLoading || status === "pending")
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );

  if (status === "error") return <NotFound />;

  return (
    <main className="container mb-1 mt-16 flex w-[100%] flex-col items-center justify-start space-y-4 font-sans">
      <section className="intro-card relative flex h-fit w-full flex-col overflow-hidden rounded-2xl border border-border bg-accent md:h-96 md:flex-row">
        <div className="w-full md:w-2/5">
          <div className="relative h-[300px] w-full md:h-full">
            <Image
              className="object-cover object-center"
              src={event.imgSrc ?? "/images/ui/event-fallback.png"}
              alt="event"
              fill
              sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
            />
          </div>
        </div>
        <div className="w-full space-y-4 p-8 md:w-3/5">
          <p className="events-heading text-5xl font-bold md:text-6xl">
            {event?.name}{" "}
          </p>

          <p className="text-base font-medium sm:text-lg">
            Date: {format(event.fromDate, "dd/MM/yyyy")}
          </p>

          <p className="text-base font-medium">Venue : {event.venue}</p>
          {event.Organiser.length !== 0 ? (
            <p className="text-sm font-medium sm:text-base">
              Organisers :{" "}
              {event.Organiser?.map((organiser) => organiser.User.name).join(
                ", ",
              )}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-8">
            {!user?.memberSince && (
              <p className="text-lg ">
                <span className="font-semibold">Entry fee:</span>
                {event.nonFlcAmount > 0
                  ? ` Rs ${event.nonFlcAmount}/-`
                  : " Free"}{" "}
              </p>
            )}

            {user?.memberSince && (
              <p className="text-lg ">
                <span className="font-semibold">Entry fee:</span>
                {event.flcAmount > 0
                  ? ` Rs ${event.flcAmount}/-`
                  : " Free"}{" "}
              </p>
            )}
          </div>
          {!session?.user ? (
            <h3 className="pt-4 text-lg font-bold text-red-500">
              Login to Register for the event
            </h3>
          ) : null}
        </div>

        {event.isMembersOnly ? (
          <Badge className="absolute right-5 top-5 border-yellow-500 bg-yellow-500/50 text-base text-white">
            Exclusive for Members
          </Badge>
        ) : null}
      </section>

      <section className="intro-card relative mx-auto flex w-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-accent p-8 sm:flex-row">
        <div className="space-y-4 " style={{ flex: 2 }}>
          <h1 className="text-3xl font-bold ">Description</h1>
          <p
            className="font-extralight"
            dangerouslySetInnerHTML={{ __html: event.description ?? "" }}
          />
        </div>
        {new Date() < (event.deadline ?? new Date()) ? (
          event.isMembersOnly ? (
            user?.memberSince ? (
              <div className="b" style={{ flex: 1 }}>
                <h1 className="text-xl font-medium">
                  {event.state === "COMPLETED"
                    ? "Registration Closed"
                    : event.teamCount > 0
                      ? `Registered (${event.teamCount})`
                      : "Register Now!"}
                  {event.Team.length > event.maxTeams ? (
                    <p className="text-lg font-semibold text-red-500">
                      Registration Closed
                    </p>
                  ) : null}
                </h1>

                <AvatarGroup images={event.selectedImages} />
                {event.Team.length < event.maxTeams && (
                  <TeamDialog
                    eventId={event.id}
                    maxTeamSize={event.maxTeamSize}
                    flcAmount={event.flcAmount}
                    nonFlcAmount={event.nonFlcAmount}
                    eventName={event.name}
                    eventType={event.eventType}
                    refetchEvent={refetch}
                  />
                )}
                <h1 className="mb-2 mt-8 text-xl font-medium">
                  Share with a friend
                </h1>
                <div className="flex gap-2 ">
                  <Input
                    className="card-attributes flex-1 rounded-lg text-xs"
                    type="text"
                    value={url}
                    disabled
                  />
                  <CopyBtn value={url} />
                </div>
              </div>
            ) : null
          ) : (
            <div className="b" style={{ flex: 1 }}>
              <h1 className="text-xl font-medium">
                {event.state === "COMPLETED"
                  ? "Registration Closed"
                  : event.teamCount > 0
                    ? `Registered (${event.teamCount})`
                    : "Register Now!"}
              </h1>

              <AvatarGroup images={event.selectedImages} />
              {event.Team.length < event.maxTeams && (
                <TeamDialog
                  eventId={event.id}
                  maxTeamSize={event.maxTeamSize}
                  flcAmount={event.flcAmount}
                  nonFlcAmount={event.nonFlcAmount}
                  eventName={event.name}
                  eventType={event.eventType}
                  refetchEvent={refetch}
                />
              )}
              <h1 className="mb-2 mt-8 text-xl font-medium">
                Share with a friend
              </h1>
              <div className="flex gap-2 ">
                <Input
                  className="card-attributes flex-1 rounded-lg text-xs"
                  type="text"
                  value={url}
                  disabled
                />
                <CopyBtn value={url} />
              </div>
            </div>
          )
        ) : null}
      </section>
    </main>
  );
};

export default EventsSlug;
