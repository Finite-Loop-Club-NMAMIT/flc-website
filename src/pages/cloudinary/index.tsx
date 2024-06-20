import React from "react";
import CloudinaryUpload from "~/components/CloudinaryUpload";
import CloudinaryDelete from "~/components/CloudinaryDelete";
import { api } from "~/utils/api";
export default function Index() {
 
  return (
    <div>
      {/*@FrontEnd use the component in any form - image will be uploaded to DB as userLink  */}

      <CloudinaryUpload linkName="Component test" />

      {/* #props 
             linkName : for the userLink schema
             userId : is optional, suggested to pass from parent component
      */}
 
      <CloudinaryDelete></CloudinaryDelete>
    </div>
  );
}
