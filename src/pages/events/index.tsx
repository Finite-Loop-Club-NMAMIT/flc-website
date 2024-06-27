import React from "react";
import Card from "~/components/Card";
import RadioButtons from "~/components/RadioButtons";
function page() {
  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-gradient mt-8 text-7xl font-bold">Events</h1>
      </div>

      <div className="flex justify-center py-8 md:py-16">
        <RadioButtons />
      </div>

      <div className=" mx-2 mt-8 flex flex-wrap justify-center gap-20 md:mx-8">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </>
  );
}

export default page;
