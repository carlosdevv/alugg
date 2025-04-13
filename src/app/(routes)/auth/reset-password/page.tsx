"use client";

import AuthLayout from "@/components/auth-layout";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DubButton } from "@/components/ui/dub-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/ui/inputs/password-input";
import { Suspense } from "react";
import useResetPassword from "./use-reset-password";

export function ResetPasswordContent() {
  const { form, onSubmit, isPending, errorParam, redirectToLogin } =
    useResetPassword();

  if (errorParam === "invalid_token") {
    return (
      <AuthLayout>
        <Card className="p-6">
          <div className="mb-2 flex flex-col gap-y-1">
            <h1 className="text-md font-semibold tracking-tight">
              Link inválido
            </h1>
            <p className="text-sm text-muted-foreground">
              O link para redefinição de senha é inválido. Por favor, solicite
              um novo link.
            </p>
            <DubButton
              className="mt-8"
              text="Voltar para o login"
              onClick={redirectToLogin}
            />
          </div>
        </Card>
      </AuthLayout>
    );
  }

  if (errorParam === "expired_token") {
    return (
      <AuthLayout>
        <Card className="p-6">
          <div className="mb-2 flex flex-col gap-y-1">
            <h1 className="text-md font-semibold tracking-tight">
              Link expirado
            </h1>
            <p className="text-sm text-muted-foreground">
              O link para redefinição de senha expirou. Por favor, solicite um
              novo link.
            </p>
            <DubButton
              className="mt-8"
              text="Solicitar novo link"
              onClick={redirectToLogin}
            />
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-2 flex flex-col gap-y-1">
          <h1 className="text-md font-semibold tracking-tight">
            Redefinir senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite sua nova senha abaixo.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <PasswordInput
                        placeholder="Senha"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirmar senha"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full" disabled={isPending}>
              {isPending && (
                <Icons.loader className="size-4 animate-spin mr-2" />
              )}
              Redefinir senha
            </Button>
          </form>
        </Form>
      </Card>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
