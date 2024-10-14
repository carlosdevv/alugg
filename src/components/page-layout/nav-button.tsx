"use client";

import { SideNavContext } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Icons } from "../icons";

export function NavButton() {
  const { setIsOpen } = useContext(SideNavContext);

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => setIsOpen((o) => !o)}
      className="h-auto w-fit p-1 md:hidden"
    >
      <Icons.panelLeft className="size-4" />
    </Button>
  );
}
