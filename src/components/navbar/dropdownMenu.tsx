"use client"

import React from 'react'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { inter } from '~/pages/_app';
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

import {  Menu } from 'lucide-react';
import Link from 'next/link';


const NavBarMenu = () => {
  return (
    <>
    <DropdownMenu.Root modal={false}>
    <DropdownMenu.Trigger asChild className='sm:hidden'>
    <button className="p-2"><Menu color='white' /></button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content side='bottom' className={`z-50 ${inter.className} border border-border min-w-[130px] bg-primary-foreground rounded-md   shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade overflow-hidden p-2 mr-4`}
          sideOffset={5}>
        <DropdownMenu.Item asChild className=" text-sm font-semibold group text-[13px] leading-none text-violet11 rounded-[5px] flex items-center h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-violet1 text-foreground py-2 ">
          <Link href="/events"><p className='text-foreground'>Events</p></Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild className=" text-sm font-semibold group text-[13px] leading-none text-violet11 rounded-[5px] flex items-center h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-violet1 py-2">
        <Link href="/team"><p className='text-foreground'>Team</p></Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
    </>
  )
}

export default NavBarMenu