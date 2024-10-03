"use client";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(appRoutes.home);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl">Oops! Página não encontrada.</p>
        <p className="text-gray-400">
          Você será redirecionado para a página inicial em breve.
        </p>

        <Button onClick={() => router.push(appRoutes.home)} className="mt-4">
          Voltar para Home
        </Button>
      </div>

      <div className="absolute bottom-10 text-gray-500">
        <p>Redirecionamento automático em 5 segundos...</p>
      </div>
    </div>
  );
}
