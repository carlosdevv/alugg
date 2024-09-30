"use client";

import googleImg from "@/assets/google-icon.svg";
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
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import useSignInForm from "./use-sign-in-form";

export default function SignInForm() {
  const { form, onSubmit, showPassword, setShowPassword, isPending } =
    useSignInForm();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center relative">
        <div className="w-full">
          <Button variant="outline" disabled className="w-full">
            <Image src={googleImg} alt="Google Logo" className="size-4 mr-2" />
            Google (em breve)
          </Button>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-sm bg-background text-foreground">ou</span>
        </div>
      </div>
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
                  <Input placeholder="email@exemplo.com" {...field} />
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
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  {showPassword ? (
                    <Icons.eye
                      className="absolute size-4 right-3 top-2.5 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <Icons.eyeOff
                      className="absolute size-4 right-3 top-2.5 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  )}
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
