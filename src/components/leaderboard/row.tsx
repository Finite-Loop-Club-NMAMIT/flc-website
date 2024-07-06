import React from "react";
import AvatarCustom from "../avatar";

interface rowProps {
  name: string;
  usn: string;
  eventsAttended: number;
  xp: number;
}

const Row = ({ name, usn, eventsAttended, xp }: rowProps) => {
  return (
    <div className="flex w-full rounded-lg border-2 border-border">
      <div className="flex flex-1 items-center justify-center gap-2  border-orange-700 py-4">
        <div className="hidden md:block">
          <AvatarCustom height={40} width={40} />
        </div>
        <p className="font-semibol text-center text-xs sm:text-base md:text-lg">
          {name}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center border-orange-700 py-4">
        <p className="font-semibol text-center text-xs sm:text-base md:text-lg">
          {usn}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center border-orange-700 py-4">
        <p className="font-semibol text-center text-xs sm:text-base md:text-lg">
          {eventsAttended}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center border-orange-700 py-4">
        <p className="font-semibol text-center text-xs sm:text-base md:text-lg">
          {xp}xp
        </p>
      </div>
    </div>
  );
};

export default Row;
