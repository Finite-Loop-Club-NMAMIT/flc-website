"use server";
import React from "react";
import { api } from "~/trpc/server";
import { Button } from "~/app/_components/button";

export default async function Test() {
  //  const oraganisers= await api.organiser.getAll();
  //  console.log(oraganisers);
  // const organisers = await api.organiser.update();
  // const newEvent = await api.event.update({
  //   eventId:"clx7f2qlw00002jhv27y62nah",
  //   name: "Tech Conference 2025666",
  //   deadline: new Date("2024-07-15T00:00:00.000Z"),
  //   fromDate: new Date("2024-08-01T09:00:00.000Z"),
  //   toDate:  new Date("2024-08-03T18:00:00.000Z"),
  //   description: "An exciting conference showcasing the latest in tech.",
  //   venue: "Tech Park Convention Center",
  //   type: "SOLO",
  //   minTeamSize: 1,
  //   "maxTeamSize": 5,
  //   "maxTeams": 50,
  //   "category": "WORKSHOP",
  //   "amount": 200,
  //   "state": "DRAFT",
  //   "isLegacy": false
  // }
  // );

  // console.log(newEvent)
  const data = {
    eventId: "clx7f2qlw00002jhv27y62nah",
    name: "Tech Conference 266",
    deadline: new Date("2024-07-15T00:00:00.000Z"),
    fromDate: new Date("2024-08-01T09:00:00.000Z"),
    toDate: new Date("2024-08-03T18:00:00.000Z"),
    description: "An exciting conference showcasing the latest in tech.",
    venue: "Tech Park Convention Center",
    type: "SOLO",
    minTeamSize: 1,
    maxTeamSize: 5,
    maxTeams: 50,
    category: "WORKSHOP",
    amount: 200,
    state: "DRAFT",
    isLegacy: false,
  };
  const newEvent = await api.event.update(data);
   console.log(newEvent);
  // const updateEvent = async (data) => {
  //   "use server"
  //   const newEvent = await api.event.update(data)
  //   console.log(newEvent);
  // };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      page
      {/* <Button myfunc={updateEvent} data="update event" />
      <button onClick={updateEvent} className="rounded-md bg-slate-300 p-3"> */}
        {/* create Organiser */}
      {/* </button> */}
    </div>
  );
}
