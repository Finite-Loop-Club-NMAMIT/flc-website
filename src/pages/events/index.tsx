'use client'

import React from "react";
import Card from "~/components/Card";
import CloudinaryUpload from "~/components/cloudinary/cloudinaryUpload";
import RadioButtons from "~/components/RadioButtons";
import { api } from "~/utils/api";
import { uploadTypeEnum } from "~/components/cloudinary/cloudinaryUpload";
function page() {

  const { data: events, isLoading, error } = api.event.getAllEvents.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading events</div>;
  }

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-gradient mt-8 text-7xl font-bold">Events</h1>
      </div>

      <div className="flex justify-center py-8 md:py-16">
        <RadioButtons />
      </div>
      <CloudinaryUpload linkName="Deletion test" type={uploadTypeEnum.eventPicture} />

      <div className="mx-2 mt-8 flex flex-wrap justify-center gap-20 md:mx-8">
        {events && events.length > 0 ? (
          <>
            {events.map((event, index) => (
              <Card key={index} src={event.imgSrc} />
            ))}
          </>
        ) : (
          <div>No events available</div>
        )}
      </div>

      
    </>
  );
}

export default page;
