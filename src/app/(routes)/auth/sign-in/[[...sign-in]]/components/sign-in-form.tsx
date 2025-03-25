"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import EmailInput from "@/components/ui/inputs/email-input";
import PasswordInput from "@/components/ui/inputs/password-input";
import { appRoutes } from "@/lib/constants";
import Link from "next/link";
import useSignInForm from "./use-sign-in-form";

export default function SignInForm() {
  const { form, onSubmit, isPending } = useSignInForm();

  return (
    <div className="flex flex-col gap-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <EmailInput placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Senha</FormLabel>
                  <Link
                    href={appRoutes.forgotPassword}
                    passHref
                    className="text-sm text-muted-foreground"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending && <Icons.loader className="animate-spin mr-2 size-4" />}
            Acessar
          </Button>
        </form>
      </Form>
    </div>
  );
}
