"use client";

import React, { useState } from "react";

import EventCard from "~/components/events/card";
import Loader from "~/components/loader";
import { RadialCard, RadialCardWrapper } from "~/components/utils/radialCard";
import { api } from "~/utils/api";

function Events() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const years: string[] = ["2020", "2021", "2022", "2023", "2024"];

  const handleYearClick = (year: string) => setSelectedYear(year);

  const { data: events, isLoading } = api.event.getAllEventsForUser.useQuery({
    year: selectedYear,
  });
  console.log("event:", events);
  return (
    <div className="relative bottom-0 top-0 min-h-screen pb-2 font-sans">
      <div className="event-bg"></div>
      <div className="line-break"></div>
      <div className="h-full w-full text-white">
        <div className="flex justify-center">
          <h1 className=" mt-8 font-title text-7xl font-bold">Events</h1>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-4 py-12">
          {years.map((year) => (
            <li
              key={year}
              onClick={() => handleYearClick(year)}
              className={`cursor-pointer ${year === selectedYear ? "border-b-2 border-white p-1 text-white" : "events-heading"}`}
            >
              {`${year}-${parseInt(year) + 1}`}
            </li>
          ))}
        </ul>

        {isLoading ? (
          <div className="flex w-full items-center justify-center">
            <Loader />
          </div>
        ) : events && events.length > 0 ? (
          <RadialCardWrapper className="mx-auto mb-4 grid max-w-7xl grid-cols-1 gap-10 px-5 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event, idx) => (
              <RadialCard
                key={idx}
                className="relative h-full w-full rounded-2xl p-2 py-3"
                withGlow
              >
                <EventCard event={event} />
              </RadialCard>
            ))}
          </RadialCardWrapper>
        ) : (
          <div className="flex justify-center">No events available</div>
        )}
      </div>
    </div>
  );
}

export default Events;
