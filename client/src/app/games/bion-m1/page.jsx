import React from "react"
import BionM1Enhanced from "@/components/games/BionM1Enhanced"

export const metadata = {
  title: "Bion-M1 Space Biology Mission | Interactive Visual Novel • Biolore",
  description: "Experience the complete Bion-M1 space biology mission through an interactive visual novel. Make critical decisions as Dr. Sarah Chen and discover the secrets of bone loss in space through engaging storytelling and animations.",
}

export default function BionM1GamePage(){
  return (
    <div className="bg-black min-h-screen">
      <BionM1Enhanced />
    </div>
  )
}
