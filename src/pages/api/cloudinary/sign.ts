import { v2 as cloudinary,type SignApiOptions } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const { paramsToSign } = req.body as SignApiOptions;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign as SignApiOptions,
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
  );

  res.status(200).json({ signature });
}
