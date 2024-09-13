import { type inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import React, { type FunctionComponent } from "react";

import { type AppRouter } from "~/server/api/root";

const OrganisorCard: FunctionComponent<{
  event: inferProcedureOutput<
    AppRouter["event"]["getAllEventsForOrganiser"]
  >[0];
}> = ({ event }) => {
  const handleWinnerClick = (eventId: number) => {
    console.log(`Winner button clicked for event ID: ${eventId}`);
  };

  const handleFeedbackClick = (eventId: number) => {
    console.log(`Feedback button clicked for event ID: ${eventId}`);
  };

  const handleAttendanceClick = (eventId: number) => {
    console.log(`Attendance button clicked for event ID: ${eventId}`);
  };

  const handleCertificateClick = (eventId: number) => {
    console.log(`Certificate button clicked for event ID: ${eventId}`);
  };

  const handleActivityPointsClick = (eventId: number) => {
    console.log(`Activity Points button clicked for event ID: ${eventId}`);
  };

  const getStateBadgeColor = (state: string) => {
    switch (state) {
      case "PUBLISHED":
        return "bg-orange-500";
      case "DRAFT":
        return "bg-gray-500";
      case "LIVE":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      key={event.id}
      className="relative  flex flex-col rounded-lg bg-black p-6 shadow-md"
    >
      <div className="flex flex-row justify-between gap-2">
        <div
          className={`absolute left-4 top-4 rounded-full px-3 py-1 font-bold ${getStateBadgeColor(event.state)}`}
        >
          {event.state}
        </div>

        {event.isLegacy && (
          <div
            className={`absolute right-4 top-4 rounded-full bg-yellow-500 px-3 py-1 font-bold`}
          >
            Legacy
          </div>
        )}
      </div>

      <section className="mb-6 flex flex-grow flex-col pt-8 text-white">
        {event.imgSrc && (
          <Image
            src={event.imgSrc}
            alt={event.name}
            width={500}
            height={300}
            className="mb-4 h-48 w-full rounded-md object-cover"
            unoptimized
          />
        )}
        <h2 className="mb-2 text-2xl font-semibold">{event.name}</h2>
        <div className="flex flex-row gap-2 rounded-3xl bg-gray-50 p-2 text-sm text-gray-600">
          <p className=" rounded-3xl ">
            {new Date(event.fromDate).toLocaleDateString()} -{" "}
            {new Date(event.toDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">| {event.venue ?? "Not specified"}</p>
        </div>

        <p className="mt-2 text-gray-200">
          {event.description ?? "No description available"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center rounded-lg bg-blue-100 px-2  py-1">
            <span className="font-semibold text-gray-700">Event Type:</span>
            <p className="ml-2  text-blue-800">{event.eventType}</p>
          </div>

          <div className="flex items-center  rounded-lg bg-green-100 px-2 py-1">
            <span className="font-semibold text-gray-700 ">Category:</span>
            <p className="ml-2 text-green-800">{event.category}</p>
          </div>

          <div className="flex items-center rounded-lg bg-yellow-100 px-2 py-1">
            <span className="font-semibold text-gray-700 ">Max Teams:</span>
            <p className="ml-2  text-yellow-800">{event.maxTeams}</p>
          </div>

          <div className="flex items-center rounded-lg bg-purple-100 px-2 py-1">
            <span className="font-semibold text-gray-700 ">Min Team Size:</span>
            <p className="ml-2  text-purple-800">{event.minTeamSize}</p>
          </div>

          <div className="flex items-center rounded-lg bg-red-100 px-2 py-1">
            <span className="font-semibold text-gray-700 ">Max Team Size:</span>
            <p className="ml-2  text-red-800">{event.maxTeamSize}</p>
          </div>

          <div className="flex items-center rounded-lg bg-teal-100 px-2 py-1">
            <span className="font-semibold text-gray-700 ">FLC Amount:</span>
            <p className="ml-2  text-teal-800">${event.flcAmount}</p>
          </div>

          <div className="flex items-center rounded-lg bg-teal-100 px-2 py-1">
            <span className="font-semibold text-gray-700 ">
              Non-FLC Amount:
            </span>
            <p className="ml-2  text-teal-800">${event.nonFlcAmount}</p>
          </div>
        </div>
        <div className=" mt-5 rounded-lg bg-white p-4  text-black ">
          30 User Registered | 6 Teams On feild
        </div>
      </section>

      <section className="mt-auto flex flex-col gap-4">
        <button
          onClick={() => handleWinnerClick(event.id)}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Winner
        </button>
        <button
          onClick={() => handleFeedbackClick(event.id)}
          className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Feedback
        </button>
        
        <Link href={`/dashboard/organiser/attendance/${event.id}`} className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
        <button
          onClick={() => handleAttendanceClick(event.id)}
          
        >
          Attendance
        </button></Link> 
        <button
          onClick={() => handleCertificateClick(event.id)}
          className="rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          Certificate
        </button>
        <button
          onClick={() => handleActivityPointsClick(event.id)}
          className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
        >
          Activity Points
        </button>
      </section>
    </div>
  );
};

export default OrganisorCard;
