"use client"
import { usePathname } from "next/navigation";
import Navbar from "./navbar/navbar";
import React from "react";
import { MouseTrailer } from "./MouseTrailer/MouseTrailer";

export default function Layout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname()
  const specificRoute = "/landing";
  return (
    <>
      <MouseTrailer />
      {(pathname === specificRoute) ? (
        <>
          {/* change colorInterpolationFilters color-interpolation-filters if the svg is used outside react*/}
          <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
            <filter id="bgfilter" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
              <feImage width="100" height="100" href="/images/bg-noise.jpg" result="grid" />
              <feTile />
              <feColorMatrix type="matrix"
                values="1 0 0 0 0 
                    0 1 0 0 0 
                    0 0 1 0 0 
                    0 0 0 0.025 0" />
              <feComposite operator="over" in2="SourceGraphic" />
            </filter>

            <filter id="smooth">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>

            <filter id="turbulenceFilter" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type='fractalNoise' baseFrequency='.5' numOctaves='1' stitchTiles='stitch' seed="0"
                result="static">
                <animate attributeName="seed" values="0;20" dur="4s" repeatCount="indefinite" />
              </feTurbulence>
              <feComponentTransfer result="binaryMask" in="static">
                <feFuncA type="discrete" tableValues="0 1" />
              </feComponentTransfer>
              <feFlood x="1" y="1" height="1" width="1" />
              <feComposite width="2" height="2" />
              <feTile result="a" />
              <feComposite in="SourceGraphic" in2="a" operator="in" result="b" />
              <feComposite in="b" in2="binaryMask" operator="in" />
            </filter>
          </svg>

          {children}
        </>
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
        </>
      )}
    </>
  )
}