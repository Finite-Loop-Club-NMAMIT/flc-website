import { type UploadApiResponse } from "cloudinary";
import Image from "next/image";
import React, { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { toast } from "sonner";
import { useRefetchContext } from "~/context/refetchContext";
import { LuPencil } from "react-icons/lu";
import { Button } from "~/components/ui/button";
import { VscLoading } from "react-icons/vsc";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

interface UploadFormProps {
  oldImage:string;
  buttonText?:string;
}

export default function UploadForm({oldImage,buttonText}: UploadFormProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [preview, setPreview] = useState<string|null>(null);
  const { executeRefetch } = useRefetchContext("user");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const editUserImage = api.user.editUserImage.useMutation();

  const handleChange= async (event: React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    for (const entry of formData.entries()) {
      const [,value] = entry;
      if (value instanceof File) {
        const previewUrl = URL.createObjectURL(value);
        setPreview(previewUrl)
        console.log(preview)
      } 
    }
  }
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    preview?URL.revokeObjectURL(preview):""  // free up memory 
    setPreview(null)
    setIsLoading(true);
   
    // Append folderPath as a query parameter
    const queryString = new URLSearchParams({ folder: "UserProfiles" }).toString();

    try {
      const response = await fetch(`/api/cloudinary/upload?${queryString}`, {
        method: "POST",
        body: formData,
      });


      const data = (await response.json()) as UploadApiResponse;
      if (response.ok) {
        // toast.success("uploaded succesfully");
        setImageUrl(data.url); 
        editUserImage.mutate(
          {
            image: data.url,
          },
          {
            onSuccess: () => {
              void handleDelete()
              executeRefetch();
              toast.dismiss();
              toast.success("Profile Picture Updated");
            },
            onError: () => {
              toast.dismiss();
              toast.error("Cloudn't change profile picture");
            },
          },
        );
        
      } else {
        toast.error(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload error");
    }finally{
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
        body: JSON.stringify({ url:oldImage  }),
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
          <div className="bg-slate-700  hover:text-slate-300 w-fit p-1 text-sm rounded-md border-1 border-white">

          {!buttonText&&(<div > <LuPencil  className="text-sm hover:text-slate-700 inline"
            title="Edit Image" />
           <p className="inline ml-1">Edit</p> 
            </div>)}
          
          {buttonText&&(<div><FaUpload  className="text-sm hover:text-slate-700 inline"
            title="Upload Image" />
            <p className="inline ml-1">{buttonText}</p>
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
        <div className="mt-4 mb-4 "> 
          <h2 className="mb-12 md:mb-14">
            Preview Image:
          </h2> 
          <div className="m-auto w-[200px] h-[200px] relative bottom-[20px]">
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
        <div className="mt-4 mb-4"> 
          <h2 className="mb-12 md:mb-14"> 
            Uploaded Image:
          </h2> 
          <div className="m-auto w-[200px] h-[200px] relative bottom-[15px]">
            <Image
              src={imageUrl}
              className="m-auto border-4 border-white rounded-full object-fill object-center"
              alt="Uploaded"
              fill
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        </div>
      )}
    </div>
    <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:gap-2 md:justify-between sm:items-center w-full"> {/* Adjusted margin-top */}
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
      <Button type="submit" disabled={isLoading} className="mt-1 sm:mt-0">
        {isLoading ? (
          <div className="flex items-center">
            <VscLoading className="animate-spin mr-2" />
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