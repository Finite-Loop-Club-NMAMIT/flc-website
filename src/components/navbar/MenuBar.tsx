import { useRef } from "react";
import { MenuIcon } from "lucide-react"

function MenuBar() {
    const menuDialogRef = useRef<HTMLDialogElement>(null);
    return (
        <>
            <nav className="bg-black w-fit px-6 pt-2 pb-3 menu-bar flex gap-2 items-center" onClick={() => menuDialogRef.current?.showModal()}>
                <MenuIcon />
                <span className="text-lg">menu</span>
            </nav>

            <dialog ref={menuDialogRef} className="menu-dialog">
                <div>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores nulla tempora nesciunt et laboriosam? Culpa, veritatis doloribus saepe laborum odio impedit repellendus, omnis commodi quos consequuntur in, voluptate amet minima.
                </div>
            </dialog>
        </>
    )
}

export default MenuBar;