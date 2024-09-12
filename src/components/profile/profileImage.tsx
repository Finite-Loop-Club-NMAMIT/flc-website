import Image from "next/image";
import React, { forwardRef } from "react";

import { type User, useUser } from "~/store";

import UploadForm from "../cloudinary/upload";

const ProfileImage = forwardRef<HTMLDivElement, { notMine: boolean }>(
  ({ notMine }, ref) => {
    const { user } = useUser();
    if (!user) return null;
    return <InnerProfileImage ref={ref} user={user} notMine={notMine} />;
  },
);
ProfileImage.displayName = "ProfileImage";

const InnerProfileImage = forwardRef<
  HTMLDivElement,
  { user: User; notMine: boolean }
>(({ user, notMine }, ref) => {
  return (
    <div
      ref={ref}
      className="relative size-36 min-h-36 min-w-36 rounded-full border-4 border-white text-foreground drop-shadow-md"
    >
      {user?.image ? (
        <div>
          <Image
            src={user.image}
            alt={"Profile Image"}
            fill
            objectFit="cover"
            className="rounded-full object-cover object-center"
          />
          {!notMine && <UploadForm oldImage={user.image} />}
          {/* mutation, uploading, deletion of image is taken care of here*/}
        </div>
      ) : (
        !notMine && (
          <div>
            <UploadForm oldImage="" buttonText={"Upload"} />
            {/* mutation, uploading, deletion of image is taken care of here*/}
          </div>
        )
      )}
    </div>
  );
});
InnerProfileImage.displayName = "InnerProfileImage";

export default ProfileImage;
