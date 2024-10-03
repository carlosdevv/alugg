"use client";

import { appRoutes } from "@/lib/constants";
import { useClerk } from "@clerk/nextjs";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <Button
      onClick={() => signOut({ redirectUrl: appRoutes.signIn })}
      variant="ghost"
      className="mt-auto m-3 mb-4"
    >
      <Icons.signOut className="size-4 mr-2" />
      Sair
    </Button>
  );
}
