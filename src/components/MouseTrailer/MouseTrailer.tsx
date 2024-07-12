"use client"
import { MoveUpRight, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export enum ContentType {
    CardLink = "card-link",
    Video = "video",
    None = "none"
}

function getContentType(value: string | null | undefined): ContentType {
    if (value && Object.values(ContentType).includes(value as ContentType)) {
        return value as ContentType;
    }
    return ContentType.None;
}

function getIcon(icon: ContentType | null) {
    switch (icon) {
        case ContentType.CardLink:
            return <MoveUpRight />;
        case ContentType.Video:
            return <Play />;
        default:
            return null;
    }
}


export const MouseTrailer= () => {
    const trailerRef = useRef<HTMLDivElement>(null);
    const [trailerIcon, setTrailerIcon] = useState<ContentType>(ContentType.None);

    useEffect(() => {
        window.addEventListener("mousemove", (e) => {

            const interactable = (e.target instanceof HTMLElement) ? e.target?.closest(".interactable") : null;
            const intersecting = interactable !== null;

            if (!trailerRef.current) return;
            const x = e.clientX - trailerRef.current.offsetWidth / 2;
            const y = e.clientY - trailerRef.current?.offsetHeight / 2;
            
            const keyFrames = {
                transform: `translate(${x}px,${y}px) scale(${intersecting ? "4" : "1"})`
            }

            trailerRef.current.animate(
                [keyFrames],
                {
                    duration: intersecting ? 300 : 800,
                    fill: "forwards",
                }
            )

            if (intersecting) {
                if (interactable instanceof HTMLElement) {
                    const icon = getContentType(interactable.dataset.type);
                    if (icon !== null) {
                        document.documentElement.style.cursor = 'none';
                    } else {
                        document.documentElement.style.cursor = 'auto';
                    }
                    setTrailerIcon(icon);
                }
            } else {
                document.documentElement.style.cursor = 'auto';
                setTrailerIcon(ContentType.None);
            }
        })
    }, [])

    return (
        <div id="trailer" ref={trailerRef}>
            {getIcon(trailerIcon)}
        </div>
    )
}