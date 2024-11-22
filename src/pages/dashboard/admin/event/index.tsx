import React from "react";

import CreateEvent from "~/components/admin/event/create-event";

function index() {
  return (
    <div className="order-1 mx-8 mt-16 w-4/5 flex-col justify-center rounded-lg sm:w-2/3 lg:order-2 lg:w-1/2">
      <div className="m-0 sm:m-4">
        <CreateEvent />
      </div>
    </div>
  );
}

export default index;
