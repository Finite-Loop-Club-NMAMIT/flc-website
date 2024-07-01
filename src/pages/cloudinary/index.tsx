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

  return (
    <div>
      {/*@FrontEnd use the component in any form - image will be uploaded to DB as userLink  */}

      <CloudinaryUpload
        linkName="Deletion test"
        userId={userId}
        type={uploadTypeEnum.userLink}
      />

      {/* #props 
             linkName : for the userLink schema
             userId : is optional, suggested to pass from parent component
      */}

      {/* you will see list of images, option to delete- both from cloudinary and db */}
      <CloudinaryDelete></CloudinaryDelete>
    </div>
  );
}
