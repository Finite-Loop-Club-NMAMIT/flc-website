import React from "react";
import CloudinaryUpload from "~/components/cloudinary/cloudinaryUpload";
import CloudinaryDelete from "~/components/cloudinary/cloudinaryDelete";
import { uploadTypeEnum } from "~/components/cloudinary/cloudinaryUpload";
import { getServerAuthSession } from "~/server/auth";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};


export default function Index() {
  const session = useSession();
  
  const userId = session?.data?.user.id ?? undefined;
  console.log(session?.data?.user.id); 
  const imageYouWantToDelete ="https://res.cloudinary.com/dh0sqelog/image/upload/v1718884775/ln9uaziq0lnkzrzxiqqx.jpg";
  return (
    <div>
      <p className="text-center mt-6">Refer /pages/cloudinary/index.tsx to understand usage of upload and delete </p>

      {/*1. Uploading images to userLink*/}

      <CloudinaryUpload
        uploadName="upload image to userLink schema"
        userId={userId}
        type={uploadTypeEnum.userLink}
      />

      {/*2. Uploading images for Events*/}

      <CloudinaryUpload
        uploadName="upload image to an Event "
        eventId={"cly4g5jlv000246ht681op1lc"}
        type={uploadTypeEnum.eventPicture}
      />

      {/*3. Uploading images to user*/}

      {/* <CloudinaryUpload
        uploadName="Deletion test"
        userId={userId}
        type={uploadTypeEnum.userPicture}
      /> */}

      {/* use this to delete Image from cloudinary only, delete from db with ur mutation */}

      <CloudinaryDelete imageUrl={imageYouWantToDelete}></CloudinaryDelete>
    </div>
  );
}
