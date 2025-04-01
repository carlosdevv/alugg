"use client";

import AuthLayout from "@/components/auth-layout";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { appRoutes } from "@/lib/constants";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-2 flex flex-col gap-y-2 justify-center items-center text-center">
          <Icons.checkCircle className="size-10 text-green-500" />
          <h1 className="text-md font-semibold tracking-tight">
            Email Verificado!
          </h1>
          <p className="text-sm text-muted-foreground">
            Seu email foi verificado com sucesso.
          </p>
        </div>
        <Button className="mt-4 w-full" asChild>
          <Link href={appRoutes.signIn}>Acessar aplicação</Link>
        </Button>
      </Card>
    </AuthLayout>
  );
}
