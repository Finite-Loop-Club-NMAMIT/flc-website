"use client"
import { useEffect, useRef } from "react";
import logoStyles from "./logo.module.css"

function Logo() {

    const eyeLeftRef = useRef<HTMLSpanElement>(null);
    const eyeRightRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        window.addEventListener("mousemove", (event: MouseEventInit) => {
            // const center = eyeLeftRef.current?.clientLeft ?? 0;
            [eyeLeftRef, eyeRightRef].forEach((eye) => {
                if (!eye.current) return;
                const boundingRect = eye.current.getBoundingClientRect();
                const eyeX = event.clientX ? event.clientX : 0;
                const eyeY = event.clientY ? event.clientY : 0;
                const x = boundingRect.left + boundingRect.width / 2;
                const y = boundingRect.top + boundingRect.height / 2;
                const rad = Math.atan2(eyeX - x, eyeY - y);
                const degree = ((rad * 180) / Math.PI) * -1;
                eye.current.style.transform = `rotate(${degree}deg)`;
            });

        })
    }, [])

    return (
        <h1 className={`${logoStyles.logo} text-[1.5rem]`}>
            FINITEL
            <span className={logoStyles.eye} ref={eyeLeftRef}></span>
            <span className={logoStyles.eye} ref={eyeRightRef}></span>P
        </h1>
    )
}

export default Logo