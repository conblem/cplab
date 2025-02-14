"use client";

import { useSidebar } from "./ui/sidebar";
import { PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Header({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Button
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        variant="ghost"
        size="icon"
        className="h-7 w-7 -ml-1"
        onClick={() => toggleSidebar()}
      >
        <PanelLeftIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      {children}
    </header>
  );
}
