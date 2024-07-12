"use client";

import React from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Menu } from "lucide-react";
import Link from "next/link";

const NavBarMenu = () => {
  return (
    <>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild className="sm:hidden">
          <button className="p-2">
            <Menu color="white" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            className={`z-50  data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade mr-4   min-w-[130px] overflow-hidden rounded-md border border-border bg-primary-foreground p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]`}
            sideOffset={5}
          >
            <DropdownMenu.Item
              asChild
              className=" text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 group relative flex h-[30px] select-none items-center rounded-[5px] px-[5px] py-2 pl-[25px] text-[13px] text-sm font-semibold leading-none text-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent "
            >
              <Link href="/events">
                <p className="text-foreground">Events</p>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              asChild
              className=" text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 group relative flex h-[30px] select-none items-center rounded-[5px] px-[5px] py-2 pl-[25px] text-[13px] text-sm font-semibold leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent"
            >
              <Link href="/team">
                <p className="text-foreground">Team</p>
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default NavBarMenu;
