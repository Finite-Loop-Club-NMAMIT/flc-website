import { v2 as cloudinary, type SignApiOptions } from "cloudinary";
import { api } from "./api";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});



export async function deleteImage(public_id:string){
    await cloudinary.uploader.destroy(public_id,(result)=>{
       console.log(result)
       
     })}