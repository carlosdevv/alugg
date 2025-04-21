"use client";

import { Icons } from "@/components/icons";
import { CustomFile, ManyFiles } from "@/components/icons/custom";
import { appRoutes } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const AnimatedPrice = ({ value }: { value: number }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    className="inline"
  >
    {value}
  </motion.span>
);

export default function PlansPageClient() {
  const [billingPeriod, setBillingPeriod] = useState("yearly");
  const monthlyButtonRef = useRef<HTMLButtonElement>(null);
  const yearlyButtonRef = useRef<HTMLButtonElement>(null);
  const [buttonSizes, setButtonSizes] = useState({ monthly: 85, yearly: 200 });

  const planPrices = {
    pro: {
      monthly: 97,
      yearly: Math.round((97 * 10) / 12), // Desconto de 2 meses (10/12 do valor anual)
    },
    elite: {
      monthly: 197,
      yearly: Math.round((197 * 10) / 12), // Desconto de 2 meses (10/12 do valor anual)
    },
  };

  const slideAnimation = {
    monthly: { x: 0, width: `${buttonSizes.monthly}px` },
    yearly: { x: `${buttonSizes.monthly}px`, width: `${buttonSizes.yearly}px` },
  };

  useEffect(() => {
    if (monthlyButtonRef.current && yearlyButtonRef.current) {
      setButtonSizes({
        monthly: monthlyButtonRef.current.offsetWidth,
        yearly: yearlyButtonRef.current.offsetWidth,
      });
    }
  }, []);

  return (
    <main className="flex-grow bg-white">
      <div className="py-12 sm:py-16">
        {/* Hero */}
        <div className="grid-section relative [.grid-section_~_&_>_div]:border-t-0">
          <div className="border-border relative z-0 mx-auto border-b">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-white" />
              <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="pointer-events-none absolute left-1/2 top-0 w-full -translate-x-1/2 text-neutral-300 [mask-image:linear-gradient(transparent,black_70%)]">
                <div className="h-full w-full bg-[radial-gradient(circle_600px_at_50%_350px,rgba(14,118,253,0.15),transparent)]" />
              </div>
            </div>
            <div className="border-border pointer-events-none absolute inset-0 border-x [mask-image:linear-gradient(transparent,black)]" />
            <div className="relative px-8 pb-6 pt-16">
              <div className="border-border absolute inset-0 border-x [mask-image:linear-gradient(transparent,black)]" />
              {/* Hero Text */}
              <div className="relative mx-auto text-center sm:max-w-lg">
                <h1 className="mt-5 text-center font-display text-4xl text-neutral-900 sm:text-5xl sm:leading-[1.15] text-balance font-medium">
                  Planos flexíveis que crescem com você
                </h1>
                <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
                  Comece gratuitamente, sem cartão de crédito.
                  <span className="hidden md:inline text-base">
                    <br />
                    Atualize quando precisar de um plano que se adapte
                    <br />
                    às suas necessidades.
                  </span>
                </p>
              </div>
              <div className="mt-4 flex flex-col items-center justify-between gap-4 gap-y-6 md:mt-16 md:flex-row md:items-end">
                <div />
                <div className="relative z-0 inline-flex items-center gap-x-0.5 border rounded-lg border-neutral-300 bg-neutral-100">
                  <motion.div
                    className="absolute left-0 top-0 -z-[1] h-full border bg-white border-neutral-200 rounded-md"
                    animate={billingPeriod === "monthly" ? "monthly" : "yearly"}
                    variants={slideAnimation}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <button
                    ref={monthlyButtonRef}
                    type="button"
                    data-selected={billingPeriod === "monthly"}
                    onClick={() => setBillingPeriod("monthly")}
                    className="relative flex items-center gap-2 font-medium capitalize hover:text-content-subtle z-[11] transition-colors text-xs text-neutral-800 data-[selected=true]:text-neutral-800 px-5 py-2 leading-none"
                  >
                    <p>Mensal</p>
                  </button>
                  <button
                    ref={yearlyButtonRef}
                    type="button"
                    data-selected={billingPeriod === "yearly"}
                    onClick={() => setBillingPeriod("yearly")}
                    className="relative z-10 flex items-center gap-2 font-medium capitalize text-xs text-neutral-800 data-[selected=true]:text-neutral-800 px-5 py-2 leading-none"
                  >
                    <p>Anual (2 meses grátis)</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de planos */}
        <div className="grid-section relative [.grid-section_~_&_>_div]:border-t-0">
          <div className="border-border relative z-0 mx-auto border-y border-x">
            <div className="overflow-x-hidden [container-type:inline-size]">
              <div className="bg-border grid grid-cols-2 gap-x-px overflow-hidden max-lg:w-[calc(400cqw+3*32px)] max-lg:gap-x-8 max-lg:bg-transparent">
                {/* Card Pro */}
                <div className="relative top-0 flex h-full flex-col gap-6 bg-white p-5 bg-gradient-to-b from-[#f5f5f5] to-40% max-lg:translate-x-[calc(-1*var(--index)*(100%+32px))] max-lg:transition-[transform,opacity] max-lg:opacity-0">
                  <div className="pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="py-1 text-xl font-semibold leading-none text-neutral-800">
                        Pro
                      </h3>
                      <div className="w-fit whitespace-nowrap rounded-full bg-violet-900 px-2 py-1.5 text-center text-[0.5rem] font-medium uppercase leading-none text-white">
                        Popular
                      </div>
                    </div>
                    <div>
                      <div className="relative flex items-center gap-1">
                        <span className="text-sm font-normal tabular-nums text-neutral-700">
                          R${" "}
                          <AnimatePresence mode="popLayout">
                            <AnimatedPrice
                              value={
                                planPrices.pro[
                                  billingPeriod as keyof typeof planPrices.pro
                                ]
                              }
                            />
                          </AnimatePresence>
                        </span>
                        <span className="text-sm font-medium text-neutral-400 whitespace-nowrap">
                          por mês
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="min-h-10 text-[0.8125rem] text-neutral-600">
                    Ideal para quem precisa de mais estrutura, colaboração e
                    performance.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      className="block w-full rounded-lg py-2.5 text-center text-sm font-medium text-white transition-all duration-200 ease-in-out hover:ring-4 bg-neutral-900 ring-neutral-100 hover:bg-neutral-800"
                      href={appRoutes.signUp}
                    >
                      Comece agora
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="relative flex flex-col">
                      <ul className="flex flex-col gap-2.5 pb-3">
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.check className="size-4 shrink-0" />
                          <p>1000 contratos/mês</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.check className="size-4 shrink-0" />
                          <p>250 clientes</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.check className="size-4 shrink-0" />
                          <p>300 itens no inventário</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.check className="size-4 shrink-0" />
                          <p>3 membros na organização</p>
                        </li>
                      </ul>
                    </div>
                    <div className="relative flex flex-col">
                      <h4 className="mb-3 font-medium text-neutral-700">
                        Funcionalidades Pro
                      </h4>
                      <p className="mb-2.5 text-neutral-500">
                        Todas as funcionalidades do Básico, mais:
                      </p>
                      <ul className="flex flex-col gap-2.5 pb-3">
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.component className="size-4 shrink-0" />
                          <p>Mais membros na organização</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.badgeHelp className="size-4 shrink-0" />
                          <p>Suporte prioritário</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.waypoints className="size-4 shrink-0" />
                          <p>Mais limites</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <CustomFile className="size-4 shrink-0" />
                          <p>Personalizar contratos</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Elite */}
                <div className="relative top-0 flex h-full flex-col gap-6 bg-white p-5 max-lg:translate-x-[calc(-1*var(--index)*(100%+32px))] max-lg:transition-[transform,opacity] max-lg:opacity-0">
                  <div className="pb-0">
                    <div className="pb-0 flex items-center justify-between gap-2">
                      <h3 className="py-1 text-xl font-semibold leading-none text-neutral-800">
                        Elite
                      </h3>
                      <div className="w-fit whitespace-nowrap rounded-full bg-neutral-500 px-2 py-1.5 text-center text-[0.5rem] font-medium uppercase leading-none text-white">
                        Em Breve
                      </div>
                    </div>
                    <div>
                      <div className="relative flex items-center gap-1">
                        <span className="text-sm font-normal tabular-nums text-neutral-700">
                          R${" "}
                          <AnimatePresence mode="popLayout">
                            <AnimatedPrice
                              value={
                                planPrices.elite[
                                  billingPeriod as keyof typeof planPrices.elite
                                ]
                              }
                            />
                          </AnimatePresence>
                        </span>
                        <span className="text-sm font-medium text-neutral-400 whitespace-nowrap">
                          por mês
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="min-h-10 text-[0.8125rem] text-neutral-600">
                    Para quem não aceita limites — nem na operação, nem no
                    crescimento.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      className="block w-full rounded-lg cursor-not-allowed bg-neutral-400 py-2.5 text-center text-sm font-medium text-white ring-neutral-200 transition-all duration-200 ease-in-out hover:ring-4"
                      href={appRoutes.plans}
                    >
                      Comece agora
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="relative flex flex-col">
                      <ul className="flex flex-col gap-2.5 pb-3">
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.check className="size-4 shrink-0" />
                          <p>Contratos ilimitados</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.check className="size-4 shrink-0" />
                          <p>Clientes ilimitados</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.check className="size-4 shrink-0" />
                          <p>Itens ilimitados</p>
                        </li>
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.check className="size-4 shrink-0" />
                          <p>Membros ilimitados</p>
                        </li>
                      </ul>
                    </div>
                    <div className="relative flex flex-col">
                      <h4 className="mb-3 font-medium text-neutral-700">
                        Funcionalidades Extras
                      </h4>
                      <p className="mb-2.5 text-neutral-500">
                        Todas as funcionalidades do Pro, mais:
                      </p>
                      <ul className="flex flex-col gap-2.5 pb-3">
                        <li className="flex items-center gap-2 text-neutral-600">
                          <Icons.gem className="size-4 shrink-0" />
                          <p>Sua empresa sem limites.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Free */}
        <div className="grid-section relative border-border [.grid-section_~_&]:border-t-0 border-y border-t-0">
          <div className="border-border max-w-grid-width relative z-0 mx-auto border-x pt-10">
            <div className="border-border border-t bg-neutral-50">
              <div className="flex flex-col justify-between gap-4 px-6 py-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">
                    Básico
                  </h3>
                  <p className="text-sm text-neutral-500">
                    <strong className="font-medium text-neutral-900">
                      R$ 0
                    </strong>{" "}
                    gratuito para sempre – o plano gratuito mais generoso do
                    mercado
                  </p>
                </div>
                <Link
                  className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-lg bg-black px-4 text-center text-sm font-medium text-white ring-neutral-200 transition-all duration-200 ease-in-out hover:ring-4 sm:w-fit"
                  href={appRoutes.signUp}
                >
                  Comece agora
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-neutral-200 p-6 sm:grid-cols-2 md:grid-cols-4">
                <div className="flex items-center gap-2 text-neutral-600">
                  <ManyFiles className="size-4 shrink-0" />
                  <p className="text-sm">50 contratos/mês</p>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Icons.package className="size-4 shrink-0" />
                  <p className="text-sm">100 itens no inventário</p>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Icons.users className="size-4 shrink-0" />
                  <p className="text-sm">25 clientes</p>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Icons.help className="size-4 shrink-0" />
                  <p className="text-sm">Suporte básico</p>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Icons.userCog className="size-4 shrink-0" />
                  <p className="text-sm">1 membro (Dono)</p>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 underline decoration-dotted underline-offset-4">
                  <Icons.layers className="size-4 shrink-0" />
                  <p className="text-sm">Categorias ilimitadas</p>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 underline decoration-dotted underline-offset-4">
                  <Icons.globe className="size-4 shrink-0" />
                  <p className="text-sm">Organizações ilimitadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compare Plans */}
        <div className="grid-section relative border-border [.grid-section_~_&]:border-t-0 border-y">
          <div className="border-border relative z-0 mx-auto border-x">
            <div className="pt-8">
              <h2 className="text-center font-display text-3xl font-medium sm:text-4xl">
                Compare os Planos
              </h2>
              {/* Header */}
              <div className="sticky top-[55px] z-10 mt-10">
                <div className="border-border from-border overflow-x-hidden border-b [container-type:inline-size] lg:bg-gradient-to-t">
                  <div
                    className="grid grid-cols-3 gap-px overflow-hidden text-sm text-neutral-800 [&amp;_strong]:font-medium max-lg:w-[calc(400cqw+3*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform"
                    style={{ "--index": 2 } as React.CSSProperties}
                  >
                    {/* Básico */}
                    <div className="relative top-0 flex h-full flex-col gap-6 bg-white p-5 max-lg:opacity-0">
                      <div>
                        <h3 className="py-1 text-base font-semibold leading-none text-neutral-800">
                          Básico
                        </h3>
                        <div>
                          <div className="relative mt-0.5 flex items-center gap-1">
                            <span className="text-sm font-medium tabular-nums text-neutral-700">
                              R$ 0
                            </span>
                            <span className="text-sm font-medium text-neutral-400">
                              por mês
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          className="flex h-8 w-full items-center justify-center rounded-lg bg-black text-center text-sm font-medium text-white ring-neutral-200 transition-all duration-200 ease-in-out hover:ring-4"
                          href={appRoutes.signUp}
                        >
                          Comece agora
                        </Link>
                      </div>
                    </div>
                    {/* Pro */}
                    <div className="relative top-0 flex h-full flex-col gap-6 bg-white p-5 max-lg:opacity-0">
                      <div>
                        <h3 className="py-1 text-base font-semibold leading-none text-neutral-800">
                          Pro
                        </h3>
                        <div>
                          <div className="relative mt-0.5 flex items-center gap-1">
                            <span className="text-sm font-medium tabular-nums text-neutral-700">
                              R${" "}
                              <AnimatePresence mode="popLayout">
                                <AnimatedPrice
                                  value={
                                    planPrices.pro[
                                      billingPeriod as keyof typeof planPrices.pro
                                    ]
                                  }
                                />
                              </AnimatePresence>
                            </span>
                            <span className="text-sm font-medium text-neutral-400">
                              por mês
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          className="flex h-8 w-full items-center justify-center rounded-lg bg-black text-center text-sm font-medium text-white ring-neutral-200 transition-all duration-200 ease-in-out hover:ring-4"
                          href={appRoutes.signUp}
                        >
                          Comece agora
                        </Link>
                      </div>
                    </div>
                    {/* Elite */}
                    <div className="relative top-0 flex h-full flex-col gap-6 bg-white p-5 max-lg:opacity-0">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="py-1 text-base font-semibold leading-none text-neutral-800">
                            Elite
                          </h3>
                          <div className="w-fit whitespace-nowrap rounded-full bg-neutral-500 px-2 py-1.5 text-center text-[0.5rem] font-medium uppercase leading-none text-white">
                            Em Breve
                          </div>
                        </div>
                        <div>
                          <div className="relative mt-0.5 flex items-center gap-1">
                            <span className="text-sm font-medium tabular-nums text-neutral-700">
                              R${" "}
                              <AnimatePresence mode="popLayout">
                                <AnimatedPrice
                                  value={
                                    planPrices.elite[
                                      billingPeriod as keyof typeof planPrices.elite
                                    ]
                                  }
                                />
                              </AnimatePresence>
                            </span>
                            <span className="text-sm font-medium text-neutral-400">
                              por mês
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          className="flex h-8 w-full items-center justify-center rounded-lg bg-neutral-400 cursor-not-allowed text-center text-sm font-medium text-white ring-neutral-200 transition-all duration-200 ease-in-out hover:ring-4"
                          href={appRoutes.plans}
                        >
                          Comece agora
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-8 bg-gradient-to-b from-white"></div>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-12">
                {/*** Domínio: Organizações ***/}
                <div className="w-full overflow-x-hidden [container-type:inline-size]">
                  <span className="border-border flex items-center gap-2 border-b px-5 pb-4 pt-2">
                    <Icons.globe className="size-4 text-neutral-600" />
                    <h3 className="text-base font-medium text-black">
                      Organizações
                    </h3>
                  </span>
                  <table
                    style={{ "--index": 2 } as React.CSSProperties}
                    className="grid grid-cols-3 overflow-hidden text-sm text-neutral-800 [&_strong]:font-medium max-lg:w-[calc(400cqw+3*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform"
                  >
                    <thead className="sr-only">
                      <tr>
                        <th>Básico</th>
                        <th>Pro</th>
                        <th>Elite</th>
                      </tr>
                    </thead>
                    <tbody className="contents">
                      <tr className="contents [&:last-of-type_td]:border-b-0">
                        {/* Free */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitadas</strong>
                          </span>
                        </td>
                        {/* Pro */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitadas</strong>
                          </span>
                        </td>
                        {/* Elite */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitadas</strong>
                          </span>
                        </td>
                      </tr>
                      <tr className="contents">
                        {/* Free */}
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4 text-neutral-300">
                          <span className="w-3">•</span>
                          <span className="underline decoration-dotted underline-offset-2 cursor-help">
                            Perfis customizáveis
                          </span>
                        </td>
                        {/* Pro */}
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>Perfis customizáveis</span>
                        </td>
                        {/* Elite */}
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>Perfis customizáveis + SSO/SAML</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*** Domínio: Contratos ***/}
                <div className="w-full overflow-x-hidden [container-type:inline-size]">
                  <span className="border-border flex items-center gap-2 border-b px-5 pb-4 pt-2">
                    <ManyFiles className="size-4 text-neutral-600" />
                    <h3 className="text-base font-medium text-black">
                      Contratos
                    </h3>
                  </span>
                  <table
                    style={{ "--index": 2 } as React.CSSProperties}
                    className="grid grid-cols-3 overflow-hidden text-sm text-neutral-800 [&_strong]:font-medium max-lg:w-[calc(400cqw+3*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform"
                  >
                    <thead className="sr-only">
                      <tr>
                        <th>Básico</th>
                        <th>Pro</th>
                        <th>Elite</th>
                      </tr>
                    </thead>
                    <tbody className="contents">
                      {/* Fluxos de contratos */}
                      <tr className="contents [&:last-of-type_td]:border-b-0">
                        {/* Free */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Até 50</strong> contratos/mês
                          </span>
                        </td>
                        {/* Pro */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Até 500</strong> contratos/mês
                          </span>
                        </td>
                        {/* Elite */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitados</strong>
                          </span>
                        </td>
                      </tr>
                      <tr className="contents">
                        {/* Flow de retirada/retorno */}
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4 text-neutral-300">
                          <span className="w-3">•</span>
                          <span className="underline decoration-dotted underline-offset-2 cursor-help">
                            Multi‑flow completo
                          </span>
                        </td>
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>Multi‑flow completo</span>
                        </td>
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>Multi‑flow completo</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*** Domínio: Clientes ***/}
                <div className="w-full overflow-x-hidden [container-type:inline-size]">
                  <span className="border-border flex items-center gap-2 border-b px-5 pb-4 pt-2">
                    <Icons.users className="size-4 text-neutral-600" />
                    <h3 className="text-base font-medium text-black">
                      Clientes
                    </h3>
                  </span>
                  <table
                    style={{ "--index": 2 } as React.CSSProperties}
                    className="grid grid-cols-3 overflow-hidden text-sm text-neutral-800 [&_strong]:font-medium max-lg:w-[calc(400cqw+3*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform"
                  >
                    <thead className="sr-only">
                      <tr>
                        <th>Básico</th>
                        <th>Pro</th>
                        <th>Elite</th>
                      </tr>
                    </thead>
                    <tbody className="contents">
                      {/* Limite de clientes */}
                      <tr className="contents [&:last-of-type_td]:border-b-0">
                        {/* Free */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>25</strong> clientes
                          </span>
                        </td>
                        {/* Pro */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>250</strong> clientes
                          </span>
                        </td>
                        {/* Elite */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitados</strong>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*** Domínio: Inventário ***/}
                <div className="w-full overflow-x-hidden [container-type:inline-size]">
                  <span className="border-border flex items-center gap-2 border-b px-5 pb-4 pt-2">
                    <Icons.package className="size-4 text-neutral-600" />
                    <h3 className="text-base font-medium text-black">
                      Inventário
                    </h3>
                  </span>
                  <table
                    style={{ "--index": 2 } as React.CSSProperties}
                    className="grid grid-cols-3 overflow-hidden text-sm text-neutral-800 [&_strong]:font-medium max-lg:w-[calc(400cqw+3*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform"
                  >
                    <thead className="sr-only">
                      <tr>
                        <th>Básico</th>
                        <th>Pro</th>
                        <th>Elite</th>
                      </tr>
                    </thead>
                    <tbody className="contents">
                      {/* Itens no estoque */}
                      <tr className="contents [&:last-of-type_td]:border-b-0">
                        {/* Free */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>100</strong> itens
                          </span>
                        </td>
                        {/* Pro */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>1.000</strong> itens
                          </span>
                        </td>
                        {/* Elite */}
                        <td className="border-grid-border flex items-center gap-2 border-b bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitados</strong>
                          </span>
                        </td>
                      </tr>
                      {/* Categorias */}
                      <tr className="contents">
                        {/* Free */}
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitadas</strong>
                          </span>
                        </td>
                        {/* Pro */}
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitadas</strong>
                          </span>
                        </td>
                        {/* Elite */}
                        <td className="border-grid-border flex items-center gap-2 bg-white px-5 py-4">
                          <Icons.check className="size-3 text-neutral-500" />
                          <span>
                            <strong>Ilimitadas</strong>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
