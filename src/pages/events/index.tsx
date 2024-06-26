import React from "react";
import Card from "~/components/Card";
import RadioButtons from "~/components/RadioButtons";
function page() {
  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-gradient text-7xl font-bold">Events</h1>
      </div>

      <div className="flex justify-center py-16">
        <RadioButtons />
      </div>

      <div className="mt-8 flex justify-center">
        <Card />
      </div>
    </>
  );
}

export default page;
