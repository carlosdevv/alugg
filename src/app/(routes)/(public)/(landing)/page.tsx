import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { Check } from "lucide-react";
import Link from "next/link";
import HeroSection from "./components/hero-section";
import SolutionsSection from "./components/solutions-section";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen mx-auto max-w-[1120px] flex-col">
      <Nav />
      <HeroSection />

      <main className="flex-grow">
        {/* Features Section */}
        <SolutionsSection />

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1120px] px-4">
            <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
              Clientes que confiam na Alugg
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="mb-4 text-gray-600">
                  &quot;A Alugg transformou meu negócio de aluguéis. Reduzi o
                  tempo administrativo em 80% e aumentei minha carteira de
                  imóveis em 30%.&quot;
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <p className="font-medium">Ana Silva</p>
                    <p className="text-sm text-gray-500">
                      Proprietária, Imobiliária Silva
                    </p>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="mb-4 text-gray-600">
                  &quot;Como proprietário de 15 imóveis, eu não conseguia mais
                  gerenciar tudo manualmente. Com a Alugg, tenho tudo sob
                  controle.&quot;
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <p className="font-medium">Carlos Mendes</p>
                    <p className="text-sm text-gray-500">
                      Investidor Imobiliário
                    </p>
                  </div>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="mb-4 text-gray-600">
                  &quot;A automação de cobranças da Alugg reduziu nossa
                  inadimplência em 40%. O investimento se pagou em apenas 3
                  meses.&quot;
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <p className="font-medium">Marina Costa</p>
                    <p className="text-sm text-gray-500">
                      CEO, Administradora Costa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="mx-auto max-w-[1120px] px-4">
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Planos para todos os tipos de negócio
            </h2>
            <p className="mb-16 text-center text-lg text-gray-600">
              Escolha o plano que melhor se adapta às suas necessidades
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="rounded-xl border border-gray-200 p-8">
                <h3 className="mb-2 text-xl font-bold">Básico</h3>
                <p className="mb-6 text-gray-600">
                  Para pequenos proprietários
                </p>
                <p className="mb-4">
                  <span className="text-4xl font-bold">R$99</span>
                  <span className="text-gray-600">/mês</span>
                </p>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Até 10 imóveis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Contratos digitais</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Cobranças automáticas</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Suporte por email</span>
                  </li>
                </ul>
                <Link
                  href="/cadastro?plano=basico"
                  className="block w-full rounded-full border border-black bg-white py-2 text-center font-medium text-black hover:bg-gray-50"
                >
                  Começar grátis
                </Link>
              </div>

              {/* Professional Plan */}
              <div className="rounded-xl border-2 border-black p-8">
                <div className="mb-6 -mt-10 rounded-full bg-black px-3 py-1 text-center text-sm text-white w-32 mx-auto">
                  Mais popular
                </div>
                <h3 className="mb-2 text-xl font-bold">Profissional</h3>
                <p className="mb-6 text-gray-600">
                  Para imobiliárias em crescimento
                </p>
                <p className="mb-4">
                  <span className="text-4xl font-bold">R$299</span>
                  <span className="text-gray-600">/mês</span>
                </p>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Até 50 imóveis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Todas as funcionalidades do Básico</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Portal do inquilino</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Relatórios avançados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Link
                  href="/cadastro?plano=profissional"
                  className="block w-full rounded-full bg-black py-2 text-center font-medium text-white hover:bg-gray-800"
                >
                  Começar agora
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="rounded-xl border border-gray-200 p-8">
                <h3 className="mb-2 text-xl font-bold">Empresarial</h3>
                <p className="mb-6 text-gray-600">
                  Para grandes administradoras
                </p>
                <p className="mb-4">
                  <span className="text-4xl font-bold">R$699</span>
                  <span className="text-gray-600">/mês</span>
                </p>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Imóveis ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Todas as funcionalidades do Profissional</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>API para integração</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Gerente de conta dedicado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span>Personalização avançada</span>
                  </li>
                </ul>
                <Link
                  href="/contato"
                  className="block w-full rounded-full border border-black bg-white py-2 text-center font-medium text-black hover:bg-gray-50"
                >
                  Fale com vendas
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black py-20 text-white">
          <div className="mx-auto max-w-[1120px] px-4">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Comece a transformar sua gestão de aluguéis hoje
            </h2>
            <p className="mb-10 text-lg text-gray-300">
              Junte-se a milhares de proprietários e imobiliárias que já
              otimizaram seus negócios com a Alugg
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                href="/cadastro"
                className="w-full rounded-full bg-white px-6 py-3 font-medium text-black hover:bg-gray-100 sm:w-auto"
              >
                Comece grátis por 14 dias
              </Link>
              <Link
                href="/demo"
                className="w-full rounded-full border border-white px-6 py-3 font-medium text-white hover:bg-gray-900 sm:w-auto"
              >
                Agende uma demonstração
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
