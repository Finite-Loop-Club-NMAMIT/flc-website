import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

import Loader from "~/components/loader";
import MemberCard from "~/components/team/memberCard";
import { teamTabs } from "~/constants";
import { api } from "~/utils/api";

function Team() {
  const [toggleState, setToggleState] = useState<string>("2024"); //Default year is 2024-25
  const { data: core, isLoading } =
    api.core.getCoreByYear.useQuery(toggleState);
  const { data: faculty } = api.core.getFacultyCoords.useQuery();

  useGSAP(() => {
    // Title animation when screen width > 1024px
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const vw = window.innerWidth * 0.01;
    const fontSize = `${vw}vmin`;

    if (mediaQuery.matches) {
      gsap.from([".meet", ".the", ".team"], {
        opacity: 0,
        stagger: 0.5,
        ease: "power1.out",
        delay: 0.2,
        duration: 0.05,
      });
      gsap.from([".meet", ".the", ".team"], {
        fontSize: fontSize,
        ease: "power1.out",
        paddingTop: "2.5rem",
        delay: 1.5,
      });
      gsap.from(".titleContainer", {
        width: "100vw",
        height: "70vh",
        paddingBottom: "30vh",
        gap: 60,
        ease: "power1.out",
        delay: 1.5,
      });
      gsap.to(".mainDiv", {
        paddingTop: 0,
        delay: 1.5,
        ease: "power1.out",
      });
    }
  });

  const cardsContainer = useRef<HTMLDivElement | null>(null);
  const { contextSafe } = useGSAP({ scope: cardsContainer });
  const onYearChange = contextSafe(() => {
    gsap.from(".mainCard", {
      delay: 0.2,
      scale: 0.8,
      y: 50,
      stagger: 0.1,
      duration: 0.1,
      display: "none",
    });
  });

  return (
    <>
      <div className="mainDiv top-0 flex min-h-screen flex-col items-center lg:pt-48">
        <div className="my-10 flex w-full flex-col items-center">
          <div className="titleContainer flex items-center justify-center gap-4 font-title">
            <h1 className="meet mb-3 h-full bg-gradient-to-r from-amber-200 to-[#E98F81] bg-clip-text text-2xl font-bold text-transparent md:text-4xl xl:text-6xl">
              MEET THE TEAM
            </h1>
          </div>
          <p className="text-lg text-foreground">Dynamic and Agile</p>
        </div>

        <ul className="hidden flex-wrap justify-center md:flex">
          {teamTabs.map((tab) => (
            <li key={tab}>
              <a
                onClick={() => {
                  if (tab === "2016") setToggleState("2017");
                  else setToggleState(tab);
                  onYearChange();
                }}
                className="relative block cursor-pointer p-4"
              >
                {toggleState === tab ||
                (toggleState === "2017" && tab === "2016") ? (
                  <span className="absolute inset-x-0 -bottom-px h-px w-full bg-primary" />
                ) : null}
                <div className="flex items-center justify-center">
                  <span className="ml-3 text-xs font-light text-foreground lg:text-sm lg:font-medium">
                    {tab !== "Faculty"
                      ? tab == "2016"
                        ? "2016-2020"
                        : `${parseInt(tab)}-${parseInt(tab) + 1}`
                      : tab}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex w-full items-center justify-center md:hidden">
          <select
            className="rounded-md border-2 border-border bg-card px-3 py-1 text-white"
            value={toggleState}
            onChange={(e) => {
              if (e.target.value === "2016") setToggleState("2017");
              else setToggleState(e.target.value);
              onYearChange();
            }}
          >
            {teamTabs.map((year) => (
              <option
                className="text-center text-xs text-white"
                key={year}
                value={year}
              >
                {year !== "Faculty"
                  ? year == "2016"
                    ? "2016-2020"
                    : `${parseInt(year)}-${parseInt(year) + 1}`
                  : year}
              </option>
            ))}
          </select>
        </div>

        <div
          ref={cardsContainer}
          className="mt-8 flex w-full justify-center pb-24"
        >
          <div className="grid gap-4 gap-y-24 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex min-h-[300px] items-center justify-center">
                <Loader />
              </div>
            ) : toggleState === "Faculty" ? (
              faculty?.map((member, idx) => (
                <MemberCard
                  key={idx}
                  name={member.User.name}
                  role={member.position}
                  src={member.User.image ?? ""}
                  github={undefined}
                  linkedin={undefined}
                  instagram={undefined}
                />
              ))
            ) : (
              core?.map((member, idx) => (
                <MemberCard
                  key={idx}
                  name={member.User.name}
                  role={member.position}
                  src={member.User.image ?? ""}
                  github={
                    member.User.UserLink.find(
                      (link) => link.linkName === "GitHub",
                    )?.url
                  }
                  linkedin={
                    member.User.UserLink.find(
                      (link) => link.linkName === "LinkedIn",
                    )?.url
                  }
                  instagram={
                    member.User.UserLink.find(
                      (link) => link.linkName === "Instagram",
                    )?.url
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Team;
