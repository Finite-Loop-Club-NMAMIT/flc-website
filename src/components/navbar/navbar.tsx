import React from 'react'
import Logo from '../logo'
import Link from 'next/link'
import NavBarMenu from './dropdownMenu'
import { Button } from '@radix-ui/themes'
import { LogIn } from 'lucide-react'

const Navbar = () => {
    return (
        <nav className='sticky top-0 left-0 w-full min-h-8  border px-[8%] sm:px-[12%] py-3 sm:py-5  border-border  bg-primary-foreground/5 bg-clip-padding backdrop-blur-lg backdrop-filter flex items-center z-50 '>
            <Link href="/" className='flex items-center'>
                <Logo />
                <p className='text-sm md:text-lg font-bold text-white ml-3'>Finite-Loop-Club</p>
            </Link>
            <div className='flex gap-4 ml-auto items-center '>
                <div className='hidden sm:flex gap-8'>
                    <Link className='text-foreground' href="/">Home</Link>
                    <Link className='text-foreground' href="/events">Events</Link>
                    <Link className='ml-auto text-foreground' href="/team">Team</Link>
                </div>
                <Button asChild className="border border-border bg-white hover:bg-white/5  font-bold py-2 px-3 rounded">
                    <Link href="/" className="text-black no-underline  text-sm font-light flex gap-3">
                        <LogIn size={18} />
                        Login
                    </Link>
                </Button>
                {/* <Button className='text-foreground' variant="soft">Register</Button> */}
                <NavBarMenu />
            </div>

        </nav >
    )
}

export default Navbar