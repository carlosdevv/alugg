"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function InviteButton() {
  return (
    <Button>
      <Icons.userPlus className="size-4 mr-2" />
      Convidar
    </Button>
  );
}
