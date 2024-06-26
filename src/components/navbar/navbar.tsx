import React from 'react'
import Logo from '../logo'
import Link from 'next/link'
import NavBarMenu from './dropdownMenu'
import { Button } from '@radix-ui/themes'

const Navbar = () => {
    return (
        <nav className='sticky top-0 left-0 w-full min-h-8  border px-[8%] sm:px-[12%] py-3 sm:py-5  border-border bg-background flex items-center '>
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
                <Button asChild className="border border-border bg-primary-foreground hover:bg-accent text-white font-bold py-2 px-4 rounded">
                    <Link href="/" className="text-white no-underline">
                        Register
                    </Link>
                </Button>
                {/* <Button className='text-foreground' variant="soft">Register</Button> */}
                <NavBarMenu />
            </div>

        </nav >
    )
}

export default Navbar