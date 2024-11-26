import { toast } from "sonner";

const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    const res = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: imageUrl,
      }),
    });
    if (res.ok) toast.success("Image deleted successfully");
    else toast.error("Image deletion failed");
  } catch (e) {
    toast.error("Something went wrong");
  }
};

export { deleteFromCloudinary };
