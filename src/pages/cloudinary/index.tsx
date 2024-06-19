import React from "react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { useState } from "react";

export default function Index() {
  const [url, setUrl] = useState<string | null>(null);

  return (
    <div>
      <div className="m-auto w-fit rounded-md bg-slate-200 p-3 my-12">
        {" "}
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          onSuccess={(result, widget) => {
            const { info } = result;
            const { secure_url } = info as CloudinaryUploadWidgetInfo;
            setUrl(secure_url);
            console.log(widget);
          }}
        >
          {({ open }) => {
            return <button onClick={() => open()}>Upload an Image</button>;
          }}
        </CldUploadWidget>
      </div>

      {url && <div className="text-center mt-26">{url}</div>}
    </div>
  );
}
