import { useSession } from "next-auth/react";
import Logo from "./Logo";
import MenuBar from "./MenuBar";
import Link from "next/link";
import { LogIn, MoveUpRight } from "lucide-react";
import BinarizedTextEffect from "../BinarizedTextEffect/BinarizedTectEffect";

function NewNavBar() {
    const { data: session, status } = useSession()
    return (
        <header className="fixed top-0 w-full left-0 px-[8%] py-3 flex justify-between items-center z-10">
            <Logo />
            <MenuBar />

            {
                (status == "authenticated") ? (
                    // todo: profile icon
                    <Link href="/">
                        <span>Profile</span>
                        <MoveUpRight />
                    </Link>
                ) : (
                    <Link
                        href="/"
                        className="skewed-box flex gap-3  text-sm font-light text-black no-underline rounded border border-border bg-white  px-3 py-2"
                    >
                        <LogIn size={18} />
                        <BinarizedTextEffect trigger="hover" text="Login"/>
                    </Link>
                )
            }
        </header>
    )
}

export default NewNavBar