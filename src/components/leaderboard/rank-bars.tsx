"use client";

import React from "react";
import AvatarCustom from "../avatar";

const RankBars = ({
  className,
  rank,
}: {
  className: string;
  size: number;
  rank: number;
}) => {
  const bgColor =
    rank == 1
      ? "#f6c388" /* gold */
      : rank === 2
        ? "#8f959f" /* silver */
        : "#846262 "; /* bronze */
  return (
    <div
      className={`relative  w-12 overflow-visible ${className}`}
      style={{ /*  height: `${size}px`, */ backgroundColor: `${bgColor}` }}
    >
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform ">
        <AvatarCustom height={75} width={75} />
      </div>
    </div>
  );
};

export default RankBars;
