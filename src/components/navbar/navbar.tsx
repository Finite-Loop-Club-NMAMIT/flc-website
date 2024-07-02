import React from 'react'
import Logo from '../logo'
import Link from 'next/link'
import NavBarMenu from './dropdownMenu'
import { Button } from '@radix-ui/themes'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/router'

const links = [
    { label: 'Home', url: '/' },
    { label: 'Events', url: '/events' },
    { label: 'Team', url: '/team' },
];

const Navbar = () => {

    const router = useRouter();

    const activePath = links.find((link) => link.url === router.pathname);

    return (
        <nav className='sticky top-0 left-0 w-full min-h-8  border px-[8%] sm:px-[12%] py-3 sm:py-5  border-border  bg-primary-foreground/5 bg-clip-padding backdrop-blur-lg backdrop-filter flex items-center z-40 '>
            <Link href="/" className='flex items-center'>
                <Logo />
                <p className='text-sm md:text-lg font-bold text-white ml-3'>Finite-Loop-Club</p>
            </Link>
            <div className='flex gap-10 ml-auto items-center '>

                <div className='hidden sm:flex gap-8'>
                    {links.map((link) => (
                        <Link key={link.url} className='group text-foreground space-y-0.5' href={link.url}>
                            <p className='px-0.5 font-bold text-sm md:text-base'>{link.label}</p>
                            <span
                                className={`${activePath?.label === link.label ? 'max-w-full' : 'max-w-0'
                                    } block group-hover:max-w-full transition-all duration-500 h-0.5 bg-white`}
                            ></span>
                        </Link>
                    ))}
                </div>

                <Button asChild className="border border-border bg-white hover:bg-white/5  font-bold py-2 px-3 rounded">
                    <Link href="/" className="text-black no-underline  text-sm font-light flex gap-3">
                        <LogIn size={18} />
                        Login
                    </Link>
                </Button>

                <NavBarMenu />
            </div>

        </nav >
    )
}

export default Navbar