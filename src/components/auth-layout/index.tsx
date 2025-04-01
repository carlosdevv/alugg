"use client";

import { Icons } from "@/components/icons";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
        <div className="mb-4 flex items-center justify-center">
          <Icons.logo className="size-6" />
          <h1 className="text-xl font-medium">Alugg</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
