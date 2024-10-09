// import { useTheme } from "next-themes";
import Link from "next/link";
import { type FunctionComponent } from "react";

import { Button } from "~/components/ui/button";

import Particles from "~/components/magicui/particles";

const Error: FunctionComponent = () => {
  // const { theme } = useTheme();
  const isDarkMode = true;

  return (
    <section className="relative -mt-4 flex min-h-screen items-center justify-center overflow-hidden">
      <Particles
        className="absolute inset-0 z-0"
        quantity={300}
        staticity={50}
        ease={50}
        size={2}
        color={isDarkMode ? "#fff" : "#000"}
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <div className="my-8 grid grid-cols-3 items-center justify-items-center gap-4 sm:mx-28 md:mx-28 lg:mx-28">
            <div className="bg-[radial-gradient(circle,_#facc15,_#f87171)] bg-clip-text text-9xl font-extrabold tracking-tight text-transparent dark:bg-[radial-gradient(circle,_#fff,_#423966)]">
              4
            </div>
            <div
              className={`relative flex h-24 w-24 transform items-center justify-center rounded-full border-b-4 border-r-4 border-t-4 border-transparent ${
                isDarkMode
                  ? "shadow-[0_0_7px_#e7f1a3a2 border-b-white border-r-white border-t-white bg-[radial-gradient(circle,_#fff,_#423966)]"
                  : "border-b-gray-500 border-r-gray-500 border-t-gray-500 bg-[radial-gradient(circle,_#facc15,_#f87171)] shadow-[0_0_7px_#e7f1a3a2]"
              }`}
            >
              <div
                className={`absolute h-12 w-32 rotate-[-45deg] animate-pulse rounded-[50%] border-b-4 border-l-2 border-r-2 border-t-0 border-solid ${
                  isDarkMode ? "border-[#fafafa]" : "border-gray-500"
                }`}
              />
            </div>
            <div className="bg-[radial-gradient(circle,_#facc15,_#f87171)] bg-clip-text text-9xl font-extrabold tracking-tight text-transparent dark:bg-[radial-gradient(circle,_#fff,_#423966)]">
              4
            </div>
          </div>

          <p className="my-4 animate-pulse text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Oops! Page not found
          </p>
          <p className="my-8 text-lg text-gray-500 dark:text-gray-400">
            What are you doing here? Did you get lost? No worries, just head
            back to our homepage and we&apos;ll get you back on track!
          </p>

          <Link href="/">
            <Button>Back to Homepage</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Error;
