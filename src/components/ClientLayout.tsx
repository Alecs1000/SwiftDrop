'use client';
import React from "react";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();
  return (
    <div className="pb-24 min-h-screen">
      {children}
    </div>
  );
} 