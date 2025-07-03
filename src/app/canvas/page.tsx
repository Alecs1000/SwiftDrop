"use client";
import dynamic from "next/dynamic";

const CanvasClient = dynamic(() => import("./CanvasClient"), { ssr: false });

export default function CanvasPageWrapper() {
  return <CanvasClient />;
} 