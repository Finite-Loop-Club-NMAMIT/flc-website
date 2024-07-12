"use client";
import React, { useRef, useEffect } from 'react';

type Props = {
    text: string,
    maxIteration?: number,
    trigger?: "hover" | "appear" | "appearAndHover"
};

function BinarizedTextEffect({ text, maxIteration = Math.min(40, text.length), trigger: triggerType = "appear" }: Props) {
    const ref = useRef<HTMLSpanElement>(null);
    const interval = useRef<NodeJS.Timeout | undefined>(undefined)

    function startAnimation() {
        let iterations = 0;
        interval.current = setInterval(() => {
            if (ref.current) {
                ref.current.innerText = ref.current.innerText.split("").map((_, index) => {
                    if (index < iterations) return text[index]
                    if (text[index] == " ") return " "
                    return Math.random() > 0.5 ? "1" : "0"
                }).join("")
            }
            iterations += text.length / maxIteration
            if (iterations > text.length) clearInterval(interval.current)
        }, 30)
    }

    function stopAnimation() {
        clearInterval(interval.current)
        ref.current!.innerText = text;
    }

    useEffect(() => {
        if (triggerType !== "hover") {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry?.isIntersecting) {
                        startAnimation();
                        if (ref.current) {
                            observer.unobserve(ref.current);
                        }
                    }
                },
                { threshold: 0.1 }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => {
                if (ref.current) {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    observer.unobserve(ref.current);
                }
            };

        }
        return () => clearInterval(interval.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerType])

    return (
        <span ref={ref} onMouseOver={triggerType == "appear" ? undefined : startAnimation} onMouseOut={triggerType == "appear" ? undefined : stopAnimation} className='w-full h-full'>
            {text}
        </span>
    )

}

export default BinarizedTextEffect;