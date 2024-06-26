import React from "react";
import Image from "next/image";
function Card() {
  return (
    <>
      <div className="card">
        <div className="relative mb-4 h-80">
          <Image
            src="/assets/sample.png"
            alt="Example Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <div className="">
              <p className="text-4xl font-bold">DSA Workshop</p>
              <p></p>
            </div>
            <div className="flex items-end">
              <button className="relative overflow-hidden rounded-lg bg-white px-8 py-2 text-base font-bold text-black shadow-md transition-all ease-in-out before:absolute before:-left-full before:top-0 before:z-[-1] before:h-full before:w-full before:rounded-lg before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out hover:scale-105 hover:text-white hover:shadow-lg hover:before:left-0 active:scale-90">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
