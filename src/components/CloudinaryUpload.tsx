//use This to upload Images in any form 
//refer eg. pages/coudinary/index.tsx

import React, { useState } from "react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { api } from "~/utils/api";

export type CloudinaryProp = {
  linkName: string;
  userId?: string | null;
};

export default function CloudinaryUpload({ linkName, userId }: CloudinaryProp) {
    
  const [url, setUrl] = useState<string | null>(null);

 
  const addImageToDb = api.userLink.create.useMutation();

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    const { info } = result;
    const { secure_url } = info as CloudinaryUploadWidgetInfo;
    setUrl(secure_url);

    addImageToDb.mutate({
      userId: userId ?? "clxikjroh00003bzlqsg5znhd", //from the auth
      url: secure_url,
      linkName: linkName ?? "Name of link", //from prop
    });
  };

  return (
    <div>
      <div className="m-auto my-12 w-fit rounded-md bg-slate-200 p-3">

        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          onSuccess={(result) => {
            handleSuccess(result);
          }}
        >
          {({ open }) => {
            return <button onClick={() => open()}>Upload an Image</button>;
          }}
        </CldUploadWidget>
      </div>

      {url && <div className="mt-26 text-center">{url}</div>}
    </div>
  );
}
