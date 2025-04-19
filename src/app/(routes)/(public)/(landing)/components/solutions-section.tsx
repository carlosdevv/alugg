"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Collaboration } from "./feature-graphics/collaboration";
import { Contracts } from "./feature-graphics/contracts";
import { Inventory } from "./feature-graphics/inventory";
import { Personalization } from "./feature-graphics/personalization";

export default function SolutionsSection() {
  return (
    <div className="mt-20">
      <div className="mx-auto w-full max-w-xl px-4 text-center">
        <div className="mx-auto flex h-7 w-fit items-center rounded-full border border-neutral-200 bg-white px-4 text-xs text-neutral-800">
          O que é Alugg?
        </div>
        <h2 className="font-display mt-2 text-balance text-3xl font-medium text-neutral-900">
          Recursos poderosos para empresas modernas
        </h2>
        <p className="mt-3 text-pretty text-lg text-neutral-500">
          Alugg é uma plataforma completa de gestão de aluguéis. Organize
          contratos, inventário e equipe com eficiência — e transforme sua
          operação em uma máquina profissional.
        </p>
      </div>
      <div className="mx-auto mt-14 grid w-full max-w-screen-lg grid-cols-1 px-4 sm:grid-cols-2">
        <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x">
          <FeatureCard
            title="Contratos prontos, sem complicação"
            description="Modelos prontos, organização automatizada e tudo acessível em poucos cliques. Crie, edite e acompanhe seus contratos com agilidade."
          >
            <Contracts />
          </FeatureCard>
          <FeatureCard
            title="Controle total do que você aluga"
            description="Visualize, adicione e controle todos os itens disponíveis para aluguel em um só lugar. Sem bagunça, sem planilhas."
          >
            <Inventory />
          </FeatureCard>
        </div>

        <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x [&>*]:border-t [&>*]:border-neutral-200">
          <FeatureCard
            title="Personalize tudo do seu jeito"
            description="Adapte o sistema à sua operação. Personalize campos, fluxos e funcionalidades do jeito que seu negócio precisa."
          >
            <Personalization />
          </FeatureCard>
          <FeatureCard
            title="Sua equipe no controle, com você"
            description="Convide membros da equipe e controle permissões com segurança. Alugg cresce com você, sem complicar a gestão."
          >
            <Collaboration />
          </FeatureCard>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  children,
  className,
  graphicClassName,
}: PropsWithChildren<{
  title: string;
  description: string;
  className?: string;
  graphicClassName?: string;
}>) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-10 px-4 py-14 sm:px-12",
        className
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 top-1/3 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[50px]",
          "bg-[conic-gradient(from_270deg,#F4950C,#EB5C0C,transparent,transparent)]"
        )}
      />
      <div
        className={cn(
          "relative h-64 overflow-hidden sm:h-[302px]",
          graphicClassName
        )}
      >
        {children}
      </div>
      <div className="relative flex flex-col">
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        <p
          className={cn(
            "mt-2 text-neutral-500 transition-colors",
            "[&_a]:font-medium [&_a]:text-neutral-600 [&_a]:underline [&_a]:decoration-dotted [&_a]:underline-offset-2 hover:[&_a]:text-neutral-800"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
