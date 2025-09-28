"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function NavbarGate(){
  const pathname = usePathname() || "/"
  // Hide the default Navbar for these routes
  const HIDE_ON = ["/knowledge-graphs"]
  const shouldHide = HIDE_ON.some(p => pathname === p || pathname.startsWith(p + "/"))
  if (shouldHide) return null
  return <Navbar />
}
