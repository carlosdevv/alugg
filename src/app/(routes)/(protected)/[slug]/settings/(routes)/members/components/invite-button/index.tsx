"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";

export default function InviteButton() {
  const [, setModal] = useQueryState("modal");

  return (
    <Button type="button" onClick={() => setModal("create-invite")}>
      <Icons.circlePlus className="size-4 mr-2" />
      Convidar
    </Button>
  );
}
