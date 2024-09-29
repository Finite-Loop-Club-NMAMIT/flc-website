import React from "react";
import { type FunctionComponent, useRef } from "react";

import BottomPanel from "~/components/profile/bottomPanel";
import LeftTopPanel from "~/components/profile/leftTopPanel";
import RightTopPanel from "~/components/profile/rightTopPanel";
import { RadialCardWrapper } from "~/components/utils/radialCard";

const Profile: FunctionComponent<{ notMine?: boolean }> = ({
  notMine = false,
}) => {
  const leftTopPanelRef = useRef<HTMLDivElement>(null);
  const leftBottomPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  return (
    <main className="mb-20 min-h-screen w-full p-3 md:container md:my-10">
      <RadialCardWrapper className="flex size-full flex-col gap-5">
        <div className="flex w-full flex-col gap-5 md:flex-1 md:flex-row">
          <div className="flex w-full flex-col md:w-1/2">
            <LeftTopPanel
              ref={leftTopPanelRef}
              className="flex-1 border-2 border-white/10"
              notMine={notMine}
            />
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            <RightTopPanel
              ref={rightPanelRef}
              className="flex-1 border-2 border-white/10"
              notMine={notMine}
            />
          </div>
        </div>
        <BottomPanel
          ref={leftBottomPanelRef}
          className="w-full border-2 border-white/10"
          notMine={notMine}
        />
      </RadialCardWrapper>
    </main>
  );
};

export default Profile;
