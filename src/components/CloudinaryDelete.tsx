import React from "react";
import { api } from "~/utils/api";
import { deleteImage } from "~/utils/cloudinary";


export default function CloudinaryDelete() {
  const mutation = api.userLink.delete.useMutation();
  const userLinks= api.userLink.getAll.useQuery()
  console.log(userLinks)

  const handleDelete = async (url:string,id:string) => {
    try {
      void deleteImage(url)  
      const response = await mutation.mutateAsync({
        url: url?? "https://res.cloudinary.com/dh0sqelog/image/upload/v1718884775/ln9uaziq0lnkzrzxiqqx.jpg",
        id: id?? "clxn7mc5y000511jmsbxi9xzk",
      });
      console.log("Delete successful:", response);
     
    } catch (error) {
      console.error("Delete failed:", error);
      
    }
  };
  return (
    <div>
     <p>delete component</p>
      {/* <button onClick={handleDelete()}>Delete User Link</button> */}
    </div>
  );
}
