import { DropletIcon, Drum, Instagram } from "lucide-react";
import Link from "next/link";
import BinarizedTextEffect from "../BinarizedTextEffect/BinarizedTectEffect";

function FixedSocialBar() {
    return (
        <nav className="bg-black w-fit px-4 pt-3 pb-4 social-bar flex gap-2 items-center">
            <span>
                <BinarizedTextEffect trigger="hover" text="Join Our Community :"/>
            </span>
            <ul className="flex gap-2">
                {/* svg filter maynot work on svgs on chromium browsers ->if not working change images to other than svg */}
                <li><Link href="/"><Instagram className="social-link" /></Link></li>
                <li><Link href="/"><Drum className="social-link" /></Link></li>
                <li><Link href="/"><DropletIcon className="social-link" /></Link></li>
            </ul>
        </nav>
    )
}

export default FixedSocialBar;