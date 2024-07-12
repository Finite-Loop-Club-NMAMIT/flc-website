//use This to upload Images in any form 
// HOW TO USE - 1.refer eg. pages/coudinary/index.tsx
//            - 2. look into prps of this component 


import React, { useState } from "react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { api } from "~/utils/api";


export enum uploadTypeEnum {
  userLink = "userLink",
  userPicture = "userProfile",
  eventPicture = "eventPicture",
}

export type CloudinaryProp = {
  uploadName: string;
  userId?: string | null;
  eventId?: string | null;
  type: uploadTypeEnum;
};

export default function CloudinaryUpload({ uploadName, userId, eventId, type }: CloudinaryProp) {
  const [url, setUrl] = useState<string | null>(null);

  

  const addImageToUserLink = api.userLink.createUserLink.useMutation();
  const addImageToEvent = api.event.updateEvent.useMutation();
  // const addImageToUser = api.user.update.useMutaion();

  async function addImageToDB(secure_url: string) {
    if (type == uploadTypeEnum.userLink) {
      addImageToUserLink.mutate({
        userId: userId ?? "clxikjroh00003bzlqsg5znhd", //from the auth
        url: secure_url,
        linkName: "Test Images" , //from prop
      });
    } else if (type == uploadTypeEnum.userPicture) {
      // addImageToUser.mutate({
      //   userId: userId ?? "clxikjroh00003bzlqsg5znhd", //from the auth
      //   image: secure_url,
      // });
    } else if (type == uploadTypeEnum.eventPicture) {
      addImageToEvent.mutate({
        eventId: eventId ?? "clxgbokx4000ewc828rix4mxn", //from the auth
        imgSrc: secure_url,
      });
    }
  }

  const handleSuccess = async (result: CloudinaryUploadWidgetResults) => {
    const { info } = result;
    const { secure_url } = info as CloudinaryUploadWidgetInfo;
    setUrl(secure_url);
    await addImageToDB(secure_url);
  };

  return (
    <div>
      <div className="m-auto my-12 w-fit rounded-md bg-slate-200 p-3">
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          onSuccess={(result) => {
            void handleSuccess(result);
          }}
        >
          {({ open }) => {
            return (
              <button onClick={() => open()}>
               {uploadName}
              </button>
            );
          }}
        </CldUploadWidget>
      </div>

      {url && (
        <div className="mt-26 text-center">
          {url} <p className="m-12 text-blue-700">refresh the page</p>{" "}
        </div>
      )}
    </div>
  );
}