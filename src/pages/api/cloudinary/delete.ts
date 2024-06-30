import { v2 as cloudinary, type DeleteApiResponse } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// Regular expression pattern to match Cloudinary public_id from URL
const regex = /\/v\d+\/([^/]+)\./;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { url } = req.body as {url:string};

    // Function to extract public_id from Cloudinary URL
    const getPublicIdFromUrl = (url: string) => {
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    // Get public_id from URL
    const public_id = getPublicIdFromUrl(url);

    if (!public_id) {
      return res.status(400).json({ error: "Invalid Cloudinary URL provided" });
    }

    // Destroy the image on Cloudinary
    const result = (await cloudinary.uploader.destroy(
      public_id,
    )) as DeleteApiResponse;

    if (result?.http_code !== 200) {
      console.error("Cloudinary deletion error:", result);
      return res.status(500).json({ error: "Failed to delete image", result });
    }

    // Respond with success message
    res.status(200).json({ message: "Image deleted successfully", result });
  } catch (error) {
    console.error("Error in handler:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error });
  }
}
