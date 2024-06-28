//use This to upload Images in any form 
//refer eg. pages/coudinary/index.tsx

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
  linkName: string;
  userId?: string | null;
  eventId?: string | null;
  type: uploadTypeEnum;
};

export default function CloudinaryUpload({ linkName, userId, eventId, type }: CloudinaryProp) {
 
  const [url, setUrl] = useState<string | null>(null);

  // let addImageTouserLink: UseTRPCMutationResult<{ id: string; linkName: string; url: string; userId: string | null; updatedAt: Date; createdAt: Date; }, TRPCClientErrorLike<{ input: { linkName: string; userId: string; url: string; }; output: { id: string; linkName: string; url: string; userId: string | null; updatedAt: Date; createdAt: Date; }; transformer: true; errorShape: { data: { zodError: z.typeToFlattenedError<any, string> | null; code: TRPC_ERROR_CODE_KEY; httpStatus: number; path?: string; stack?: string; }; message: string; code: TRPC_ERROR_CODE_NUMBER; }; }>, { linkName: string; userId: string; url: string; }, unknown>;

  const addImageToUserLink = api.userLink.createUserLink.useMutation();
  // const addImageToUser = api.user.update.useMutaion();
  // const addImageToEvent = api.event.updateEvent.useMutaion()
 
  async function addImageToDB(secure_url:string) {
    if (type == uploadTypeEnum.userLink) {
      addImageToUserLink.mutate({
        userId: userId ?? "clxikjroh00003bzlqsg5znhd", //from the auth
        url: secure_url,
        linkName: linkName ?? "Name of link", //from prop
      });
    }
    
    else if(type == uploadTypeEnum.userPicture){
      // addImageToUser.mutate({
      //   userId: userId ?? "clxikjroh00003bzlqsg5znhd", //from the auth
      //   image: secure_url,
      // });
    }
    else if(type == uploadTypeEnum.eventPicture){
      //  addImageToEvent.mutate({
      //    eventId: eventId ?? "clxgbokx4000ewc828rix4mxn", //from the auth
      //    imgSrc: secure_url,
      //  });
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
            return <button onClick={() => open()}>Upload an Image</button>;
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
