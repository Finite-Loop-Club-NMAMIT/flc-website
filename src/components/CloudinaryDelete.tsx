import React from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CloudinaryDelete() {
    const router = useRouter();
  const mutation = api.userLink.delete.useMutation();
  const userLinks = api.userLink.getAll.useQuery();
  console.log(userLinks);

  const handleDelete = async (url:string, id:string) => {
    try {
      const res = await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url:
            url ??
            "https://res.cloudinary.com/dh0sqelog/image/upload/v1718884775/ln9uaziq0lnkzrzxiqqx.jpg",
        }),
      });

    //   If you're using the mutation:
      const response = await mutation.mutateAsync({
        url: url ?? "https://res.cloudinary.com/dh0sqelog/image/upload/v1718884775/ln9uaziq0lnkzrzxiqqx.jpg",
        id: id ?? "clxn7mc5y000511jmsbxi9xzk",
      });
      console.log("Delete successful:", response);
      router.refresh();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const createHandleDelete = (url:string, id:string) => () => handleDelete(url, id);

  return (
    <div>
      <p>delete component</p>
      <br />
      <p className="text-center">all the images in db: </p>
      <br />
      <div className="m-auto flex justify-center">
        {userLinks.data?.map((link) => (
          <div className="m-2" key={link.id}>
            <span>{link.linkName}: &nbsp;</span>
            <Image src={link.url} width={100} height={100} alt={""} />
            <button
              onClick={createHandleDelete(link.url, link.id)}
              className="mt-4 rounded-md bg-slate-200 p-2"
            >
              Delete This Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
