import React from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export enum uploadTypeEnum {
  userLink = "userLink",
  userPicture = "userProfile",
  eventPicture = "eventPicture",
}

export type CloudinaryProp = {
  imageUrl: string;
 
};


export default function CloudinaryDelete({
  imageUrl,
}: CloudinaryProp) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url:
            imageUrl ??
            "https://res.cloudinary.com/dh0sqelog/image/upload/v1718884775/ln9uaziq0lnkzrzxiqqx.jpg",
        }),
      });
      console.log("Delete successful:", res);
      router.refresh();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div  className="m-auto text-center">
      
      <br />
      <p className="text-center">Pass image Link and delete image from cloudinary </p>
      <br />
       
       <Image src={imageUrl} alt={"this image was deleted"} width={200} height={200} className="m-auto"></Image>
      <button
        onClick={handleDelete}
        className="mt-4 rounded-md bg-slate-200 p-2 text-black"
      >
        Delete This Link
      </button>
    </div>
  );
}
