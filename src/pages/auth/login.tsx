import { type NextPage } from "next";
import Image from "next/image";
import React from "react";

import Background from "~/components/background";
import LoginForm from "~/components/forms/login";

const Login: NextPage = () => {
  return (
    <>
      {/* <div className="z-0">
        <Background />
      </div> */}
      <div className=" radialgradient flex min-h-screen gap-10 ">
        <div className="my-10 flex w-full flex-col items-center gap-8 sm:my-20 sm:gap-16 lg:mx-24  lg:flex-row">
          <div className="order-2 w-full flex-col  md:w-4/5 lg:order-1 lg:w-1/2 ">
            {/* <div className=" px-6 sm:px-10">
              <h1 className="flex justify-start text-2xl sm:text-4xl ">
                Finite Loop Club
              </h1>

              <div className="mt-6 lg:mt-12">
                <Image
                  className="ml-1 "
                  src="/assets/github.png"
                  alt="GitHub Logo"
                  width={40}
                  height={40}
                />
                <h1 className="pt-2 text-lg font-bold text-black dark:text-cyan-50">
                  Github
                </h1>
                <p className="text-black  dark:text-gray-300">
                  Join Finiteloop Club on GitHub for collaborative coding and
                  innovative projects. Explore repositories, contribute to open
                  source, and enhance your programming skills with our
                  community.
                </p>
              </div>
              <div className="mt-6 lg:mt-12">
                <Image
                  className="ml-2"
                  src="/assets/discord.png"
                  alt="Discord Logo"
                  width={40}
                  height={40}
                />
                <h1 className="pt-1 text-lg font-bold text-black dark:text-cyan-50">
                  Discord
                </h1>
                <p className="text-black  dark:text-gray-300">
                  Connect with Finiteloop Club on Discord to engage in lively
                  tech discussions, receive coding support, and participate in
                  exclusive events. Join our community to grow and network with
                  fellow developers.
                </p>
              </div>
            </div> */}

            <Image
              className="ml-2 h-auto w-full rounded-lg object-cover p-8 "
              src="/assets/loginimagenew.png"
              alt="Discord Logo"
              layout="responsive"
              width={1600}
              height={900}
            />
          </div>

          <div className="order-1 mx-8 w-4/5 flex-col justify-center rounded-lg  border-2 border-purple-950  bg-white bg-opacity-5 backdrop-blur-lg sm:w-2/3 lg:order-2 lg:w-1/3">
            <div className="m-4">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
