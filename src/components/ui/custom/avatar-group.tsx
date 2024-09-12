import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const AvatarGroup: React.FunctionComponent<{
  images: (string | null)[];
}> = ({ images }) => {
  return (
    <div className="relative px-2 pb-6 pt-2">
      {images.map((image, idx) => (
        <Avatar
          key={idx}
          className={`absolute left-${idx * 6} z-${0 + idx * 10}`}
        >
          <AvatarImage src={image ?? "https://github.com/shadcn.png"} />
          <AvatarFallback>PP</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};

export { AvatarGroup };
