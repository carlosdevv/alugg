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
import Image from "next/image";
import useSignUpForm from "./use-sign-up-form";

export default function SignUpForm() {
  const { form, onSubmit, showPassword, setShowPassword, isPending } =
    useSignUpForm();

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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormLabel>Senha</FormLabel>
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
          <Button type="submit">
            {isPending && <Icons.loader className="mr-2 size-4 animate-spin" />}
            Cadastrar
          </Button>
        </form>
      </Form>
    </div>
  );
}
