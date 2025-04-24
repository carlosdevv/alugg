"use client";

import { Icons } from "@/components/icons";
import { DubButton } from "@/components/ui/dub-button";
import { appRoutes } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PricingSection = () => {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1120px] px-4">
        <div className="mx-auto w-full max-w-xl px-4 text-center">
          <div
            className="mx-auto flex h-7 w-fit items-center rounded-full border border-neutral-200 bg-white px-4 text-xs text-neutral-800 cursor-pointer"
            onClick={() => router.push(appRoutes.plans)}
          >
            Saiba mais
          </div>
          <h2 className="font-display mt-2 text-3xl font-medium text-neutral-900">
            Planos para todos os tipos de negócio
          </h2>
          <p className="mt-3 text-balance text-lg text-neutral-500">
            Escolha o plano que melhor se adapta às suas necessidades e comece a
            transformar sua operação de aluguel em uma máquina eficiente.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex rounded-full border border-gray-200 overflow-hidden">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`text-xs px-3 py-1 ${billingCycle === "monthly" ? "bg-gray-200 text-black" : "bg-white text-black"}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`text-xs px-3 py-1 ${billingCycle === "annual" ? "bg-gray-200 text-black" : "bg-white text-black"}`}
            >
              Anual
            </button>
          </div>
        </div>

        {/* Espaço reservado para o texto explicativo para evitar "flick" */}
        <div className="h-4 text-xs text-center mt-2 text-gray-600">
          {billingCycle === "annual" && "*2 Meses Grátis"}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-6">
          {/* Basic Plan */}
          <div className="rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg">Básico</h3>
            <p className="mb-6 text-gray-600 text-sm">
              O mais generoso do mercado.
            </p>
            <p className="mb-4">
              <span className="text-3xl font-medium">R$ 0</span>
              <span className="text-gray-600 text-xs">/eternamente</span>
            </p>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">50 contratos/mês</span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">100 itens no inventário</span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">25 clientes</span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm underline decoration-dotted underline-offset-4">
                  Categorias ilimitadas
                </span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm underline decoration-dotted underline-offset-4">
                  Organizações ilimitadas
                </span>
              </li>
            </ul>
            <div className="flex items-center justify-center">
              <DubButton
                text="Começar Agora"
                onClick={() => router.push(appRoutes.signUp)}
                className="bg-transparent rounded-full border-neutral-800 text-neutral-800 border hover:bg-neutral-950 hover:text-white transition-colors duration-200"
              />
            </div>
          </div>

          {/* Professional Plan */}
          <div className="rounded-xl border-2 border-black p-8">
            <div className="mb-6 -mt-10 rounded-full bg-black px-3 py-1 text-center text-sm text-white w-32 mx-auto">
              Recomendado
            </div>
            <h3 className="text-lg">Profissional</h3>
            <p className="mb-6 text-gray-600 text-sm">
              Para quem precisa de estrutura, colaboração e performance.
            </p>
            <div className="flex items-center mb-4">
              <span className="text-3xl font-medium">
                R$ {billingCycle === "monthly" ? "97" : "81"}
              </span>
              <span className="text-gray-600 text-xs">
                /{billingCycle === "monthly" ? "mês" : "mês*"}
              </span>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center">
                <span className="text-xs">
                  Todas as funcionalidades do Básico, mais:
                </span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">1000 contratos/mês</span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">250 clientes</span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">300 itens no inventário</span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">3 membros na organização</span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">Suporte prioritário</span>
              </li>
            </ul>
            <div className="flex flex-col gap-y-3 items-center justify-center">
              <DubButton
                text="Começar Agora"
                onClick={() => router.push(appRoutes.signUp)}
              />
              <p className="text-xs italic font-light text-gray-600 underline decoration-dotted underline-offset-4">
                Ganhe 14 dias de teste grátis
              </p>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-xl border border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">Elite</h3>
              <div className="text-[8px] bg-neutral-500 text-white px-2 py-1 rounded-full">
                EM BREVE
              </div>
            </div>
            <p className="mb-6 text-gray-600 text-sm">
              Para quem não aceita limites.
            </p>
            <div className="flex items-center mb-4">
              <span className="text-3xl font-medium">
                R$ {billingCycle === "monthly" ? "197" : "164"}
              </span>
              <span className="text-gray-600 text-xs">
                /{billingCycle === "monthly" ? "mês" : "mês*"}
              </span>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center">
                <span className="text-xs">
                  Todas as funcionalidades do Pro, mais:
                </span>
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 size-4" />
                <span className="text-sm">Funcionalidades Ilimitadas</span>
              </li>
            </ul>
            <div className="flex items-center justify-center">
              <DubButton
                text="Começar Agora"
                disabled={true}
                onClick={() => router.push(appRoutes.signUp)}
                className="bg-neutral-400 text-white hover:bg-neutral-500 transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
