import { type UploadApiResponse } from "cloudinary";
import Image from "next/image";
import React, { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";

import { useRefetchContext } from "~/context/refetchContext";
import { api } from "~/utils/api";

interface UploadFormProps {
  oldImage: string;
  buttonText?: string;
}

export default function UploadForm({ oldImage, buttonText }: UploadFormProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  //   const { executeRefetch } = useRefetchContext("user");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const editUserImage = api.user.editUserImage.useMutation();

  const handleChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    for (const entry of formData.entries()) {
      const [, value] = entry;
      if (value instanceof File) {
        const previewUrl = URL.createObjectURL(value);
        setPreview(previewUrl);
        console.log(preview);
      }
    }
  };
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    preview ? URL.revokeObjectURL(preview) : ""; // free up memory
    setPreview(null);
    setIsLoading(true);

    // Append folderPath as a query parameter
    const queryString = new URLSearchParams({
      folder: "UserProfiles",
    }).toString();

    try {
      const response = await fetch(`/api/cloudinary/upload?${queryString}`, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as UploadApiResponse;
      if (response.ok) {
        // toast.success("uploaded succesfully");
        setImageUrl(data.url);
        
        // editUserImage.mutate(
        //   {
        //     image: data.url,
        //   },
        //   {
        //     onSuccess: () => {
        //       void handleDelete()
        //       executeRefetch();
        //       toast.dismiss();
        //       toast.success("Profile Picture Updated");
        //     },
        //     onError: () => {
        //       toast.dismiss();
        //       toast.error("Cloudn't change profile picture");
        //     },
        //   },
        // );
      } else {
        toast.error(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: oldImage }),
      });

      if (response.ok) {
        // toast("deleted succesfully");
      } else {
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      // toast("couldnt delete");
    }
  };
  return (
    <div className="relative bottom-[-100px] right-2">
      <Dialog>
        <DialogTrigger asChild>
          <div className="border-1  w-fit rounded-md border-white bg-slate-700 p-1 text-sm hover:text-slate-300">
            {!buttonText && (
              <div>
                {" "}
                <LuPencil
                  className="inline text-sm hover:text-slate-700"
                  title="Edit Image"
                />
                <p className="ml-1 inline">Edit</p>
              </div>
            )}

            {buttonText && (
              <div>
                <FaUpload
                  className="inline text-sm hover:text-slate-700"
                  title="Upload Image"
                />
                <p className="ml-1 inline">{buttonText}</p>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Your Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="content mx-6 mt-6">
            <form
              className="text-left"
              onChange={(e) => handleChange(e)}
              onSubmit={(e) => {
                void handleUpload(e);
              }}
            >
              <input type="file" name="file" accept="image/*" required />
              <div>
                {preview && (
                  <div className="mb-4 mt-4 ">
                    <h2 className="mb-12 md:mb-14">Preview Image:</h2>
                    <div className="relative bottom-[20px] m-auto h-[200px] w-[200px]">
                      <Image
                        src={preview}
                        className="m-auto rounded-full border-4 border-white object-fill object-center"
                        alt="Uploaded"
                        fill
                        objectFit="cover"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  </div>
                )}
                {imageUrl && (
                  <div className="mb-4 mt-4">
                    <h2 className="mb-12 md:mb-14">Uploaded Image:</h2>
                    <div className="relative bottom-[15px] m-auto h-[200px] w-[200px]">
                      <Image
                        src={imageUrl}
                        className="m-auto rounded-full border-4 border-white object-fill object-center"
                        alt="Uploaded"
                        fill
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="mt-6 flex w-full flex-col sm:flex-row sm:items-center sm:gap-2 md:justify-between">
                {" "}
                {/* Adjusted margin-top */}
                <DialogClose asChild>
                  <Button
                    onClick={() => {
                      setImageUrl("");
                      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                      preview ? URL.revokeObjectURL(preview) : ""; // free up memory
                      setPreview(null);
                    }}
                    className="mt-1 sm:mt-0"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 sm:mt-0"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <VscLoading className="mr-2 animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
