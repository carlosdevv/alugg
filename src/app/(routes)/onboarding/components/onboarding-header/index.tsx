"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { appRoutes } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function OnboardingHeader() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <section className="w-full py-3 px-8 bg-muted border-b shadow-sm">
      <div className="max-w-screen-2xl mx-auto justify-between flex items-center">
        <div className="flex items-center space-x-3">
          <Icons.logo className="size-6" />
          <h1 className="font-light text-lg">Alugg</h1>
        </div>
        <Button
          onClick={async () =>
            await signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push(appRoutes.signIn);
                },
              },
            })
          }
          className="flex items-center gap-x-2"
          size="sm"
        >
          <Icons.signOut className="size-4" />
          Sair
        </Button>
      </div>
    </section>
  );
}
