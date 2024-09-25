import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import AnimatedShinyText from "~/components/magicui/animated-shiny-text";
import { api } from "~/utils/api";

function Hero() {
  const { data: session } = useSession();
  const { data: user } = api.user.getUser.useQuery(void null, {
    enabled: !!session,
  });
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [shimmerWidth, setShimmerWidth] = useState<number>(0);

  useEffect(() => {
    if (textContainerRef.current) {
      setShimmerWidth(textContainerRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className="absolute min-h-screen w-full place-content-center text-center">
      <div className="relative -translate-y-[12vh] space-y-6 md:space-y-9 xl:space-y-12">
        <div ref={textContainerRef} className="w-full">
          <AnimatedShinyText
            className="inline-flex w-full items-center justify-center  px-4 py-1 font-title text-5xl brightness-[1.15] [text-shadow:_0_0_10px_#ffd70066] dark:text-[#ffb222a5] sm:text-4xl md:text-7xl lg:text-7xl xl:text-8xl"
            shimmerWidth={shimmerWidth}
          >
            <span>FINITE LOOP CLUB</span>
          </AnimatedShinyText>
        </div>
        <p className="mx-auto max-w-lg px-4 text-center font-sub-heading font-thin sm:text-lg md:max-w-xl md:text-xl lg:max-w-5xl lg:text-3xl ">
          NMAMIT&apos;s premier coding community. Realizing ideas, inspiring the
          next.
        </p>
        {/*
          {!user?.paymentId && (
            <div className="z-10 flex items-center justify-center">
              <Link href="/register">
                <Button>
                  <span className=" mr-2 text-center font-title text-sm font-thin tracking-tight text-white sm:text-sm md:text-lg lg:text-xl">
                    Register Now
                  </span>
                  <LuArrowRight size={16} color="white" />
                </Button>
              </Link>
            </div>
          )}
          */}
      </div>
    </section>
  );
}

export default Hero;
