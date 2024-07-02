import Navbar from "./navbar/navbar";
import React from "react";

export default function Layout({ children}: {children :React.ReactNode} ) {
    return (
      <>
        <Navbar />
        <main>{children}</main>
        
      </>
    )
  }