"use client";
import { Button } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import AvatarCustom from "~/components/avatar";
import CopyBtn from "~/components/copyBtn";
import { api } from "~/utils/api";
import { type createEventZ } from "~/zod/eventZ";
import {type z} from "zod"

type EventType = z.infer<typeof createEventZ>;

const EventSlug = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const path = usePathname();
  const url = `http://localhost:3000/${path}`;
  console.log(path);

  if (!id) {
    return <h1>Error fetching id</h1>;
  }

const { data: event } = api.event.getEventById.useQuery({
  eventId: id,
}) as { data: EventType };

  if (!event) {
    return <h1>error fetching event</h1>;
  }

  return (
    <main className="flex w-[100%] flex-col items-center justify-start space-y-4">
      <section className="mt-12 flex w-[90%] flex-col rounded-3xl  border border-border bg-accent sm:flex-row md:w-[85%] lg:w-[75%] xl:w-[60%] ">
        <div className="flex    shrink justify-start overflow-hidden">
          <Image
            className="w-full rounded-t-3xl sm:w-[300px] sm:rounded-s-3xl sm:rounded-tr-none lg:w-[400px] "
            src={event.imgSrc ?? "/assets/image.png"}
            alt="event"
            width={300}
            height={5}
          />
        </div>
        <div className="flex-1 space-y-4  p-8">
          <p className="text-5xl font-bold  md:text-6xl">{event?.name} </p>
          <p className="text-base font-medium sm:text-lg">
            Wed, Aug 28 9:00 AM
          </p>
          <p className="text-base font-medium">Venue : Sambhram</p>
          <p className="text-sm font-medium sm:text-base">
            Organisers : satwik, nandan
          </p>

          <div className="mt-4 flex items-center gap-8">
            <p className="text-lg font-bold">RS 99/- </p>
            <Button
              asChild
              className="rounded border border-border bg-white  px-3 py-2 font-bold hover:bg-white/5"
            >
              <Link
                href="/"
                className="flex gap-3  text-sm font-light text-black no-underline"
              >
                Register
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className=" mx-auto flex w-[90%] flex-col gap-4 rounded-3xl border border-border bg-accent p-8 sm:flex-row md:w-[85%]  lg:w-[75%]  xl:w-[60%]">
        <div className="space-y-4" style={{ flex: 2 }}>
          <h1 className="font-semi-bold text-3xl">Description</h1>
          {/* <p>{event.description}</p> */}
          <p className="font-extralight">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo enim
            molestias natus odio? Magnam, qui voluptas exercitationem numquam
            nobis cumque consequatur delectus recusandae possimus? Excepturi
            repellat, velit numquam debitis cum architecto necessitatibus
            exercitationem explicabo eaque omnis. Ea iure deleniti distinctio
            ullam, quas voluptas autem incidunt suscipit obcaecati vero quasi!
            Modi impedit vitae mollitia id, praesentium animi fugiat quaerat
            voluptate. Iusto, nisi assumenda! Repudiandae iste ipsum, dolore sit
            recusandae.
          </p>
        </div>
        <div className="b" style={{ flex: 1 }}>
          <h1 className="text-xl font-medium">Registered ({120})</h1>
          <div className="px-2 py-2">
            <AvatarCustom height={40} width={40} />
            <AvatarCustom height={40} width={40} className="relative -left-3" />
            <AvatarCustom height={40} width={40} className="relative -left-6" />
            <AvatarCustom height={40} width={40} className="relative -left-9" />
          </div>
          <h1 className="mt-6 text-xl font-medium">Share with a friend</h1>
          <div className="flex gap-2 ">
            <input
              className="flex-1 text-xs"
              type="text"
              value={url}
              disabled
            />
            <CopyBtn value={url} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventSlug;
