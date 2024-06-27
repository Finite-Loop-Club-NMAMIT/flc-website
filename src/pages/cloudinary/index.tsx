import React from "react";
import CloudinaryUpload from "~/components/CloudinaryUpload";
import CloudinaryDelete from "~/components/CloudinaryDelete";
import { uploadTypeEnum } from "~/components/CloudinaryUpload";
export default function Index() {
 
  return (
    <div>
      {/*@FrontEnd use the component in any form - image will be uploaded to DB as userLink  */}

      <CloudinaryUpload linkName="Deletion test" type={uploadTypeEnum.userLink} />

      {/* #props 
             linkName : for the userLink schema
             userId : is optional, suggested to pass from parent component
      */}

      {/* you will see list of images, option to delete- both from cloudinary and db */}
      <CloudinaryDelete></CloudinaryDelete>
    </div>
  );
}
