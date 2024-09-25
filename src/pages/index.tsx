import { type NextPage } from "next";
import { useTheme } from "next-themes";

import Benefits from "~/components/landing/benefits";
import Events from "~/components/landing/event";
import Hero from "~/components/landing/hero";
import TechStack from "~/components/landing/techStack";
import { cn } from "~/lib/utils";

const Home: NextPage = () => {
  const { theme } = useTheme();

  return (
    <main className="flex flex-col">
      <div className="min-h-screen w-full bg-gradient-to-t from-[#ffffff] via-[#efd17bc7] to-[#ffed951a] dark:bg-none" />
      <video
        src="/videos/waves.webm"
        autoPlay
        muted
        loop
        disablePictureInPicture
        controlsList="nodownload"
        className={cn(
          "absolute top-[40vh] h-[60vh] w-full object-cover object-center md:top-[42vh] md:h-auto lg:top-[30vh] xl:top-[20vh]",
          theme === "dark" ? "brightness-100" : "brightness-75 ",
        )}
      />
      <Hero />
      <Events />
      <TechStack />
      <Benefits />
    </main>
  );
};

export default Home;
