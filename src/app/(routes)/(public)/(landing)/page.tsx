import { BarChart3, Check, Clock, Globe, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/header";
import HeroSection from "./components/hero-section";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen mx-auto max-w-[1200px] flex-col">
      <Header />
      <HeroSection />

      <main className="flex-grow">
        {/* Stats Section */}
        <section className="py-10">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="grid grid-cols-1 gap-5 rounded-xl bg-gray-50 p-8 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center border-b border-gray-200 pb-8 md:border-b-0 md:border-r md:pb-0">
                <p className="text-4xl font-bold">10.000+</p>
                <p className="text-gray-600">Imóveis gerenciados</p>
              </div>
              <div className="flex flex-col items-center justify-center border-b border-gray-200 py-8 md:border-b-0 md:border-r md:py-0">
                <p className="text-4xl font-bold">1.000+</p>
                <p className="text-gray-600">Usuários satisfeitos</p>
              </div>
              <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
                <p className="text-4xl font-bold">99%</p>
                <p className="text-gray-600">Economia de tempo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="mb-16 max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Tudo que você precisa para gerenciar aluguéis
              </h2>
              <p className="text-lg text-gray-600">
                A Alugg oferece ferramentas completas para todo o ciclo de
                gestão de aluguéis, desde a captação até o recebimento dos
                pagamentos.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="space-y-4">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Painel de Controle</h3>
                <p className="text-gray-600">
                  Visualize todos os indicadores importantes do seu negócio em
                  um único lugar, com gráficos e métricas atualizados em tempo
                  real.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">
                  Automação de Cobranças
                </h3>
                <p className="text-gray-600">
                  Automatize o envio de cobranças, recibos e lembretes aos seus
                  inquilinos, economizando tempo e reduzindo a inadimplência.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Portal do Inquilino</h3>
                <p className="text-gray-600">
                  Ofereça aos inquilinos uma área exclusiva para acesso a
                  documentos, pagamentos online e solicitações de manutenção.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="space-y-4">
                <div className="rounded-full bg-red-100 p-3 w-12 h-12 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Contratos Digitais</h3>
                <p className="text-gray-600">
                  Crie, personalize e assine contratos digitalmente, com
                  validade jurídica e armazenamento seguro na nuvem.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="space-y-4">
                <div className="rounded-full bg-yellow-100 p-3 w-12 h-12 flex items-center justify-center">
                  <Check className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold">Gestão de Manutenções</h3>
                <p className="text-gray-600">
                  Acompanhe solicitações de manutenção, orçamentos e cronogramas
                  de execução em uma única interface.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="space-y-4">
                <div className="rounded-full bg-teal-100 p-3 w-12 h-12 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold">
                  Relatórios Financeiros
                </h3>
                <p className="text-gray-600">
                  Acesse relatórios detalhados de receitas, despesas e
                  rentabilidade para melhorar a performance dos seus
                  investimentos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1200px] px-4">
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
          <div className="mx-auto max-w-[1200px] px-4">
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
          <div className="mx-auto max-w-[1200px] px-4">
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

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="Alugg logo"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold">Alugg</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                A plataforma completa para gestão de aluguéis que simplifica seu
                negócio imobiliário.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Produto</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/recursos" className="hover:text-black">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="/precos" className="hover:text-black">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="/clientes" className="hover:text-black">
                    Clientes
                  </Link>
                </li>
                <li>
                  <Link href="/integrações" className="hover:text-black">
                    Integrações
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Empresa</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/sobre" className="hover:text-black">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-black">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/carreiras" className="hover:text-black">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="hover:text-black">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacidade" className="hover:text-black">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/termos" className="hover:text-black">
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-black">
                    Política de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-8 sm:flex-row">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Alugg. Todos os direitos
              reservados.
            </p>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              <Link href="#" className="text-gray-600 hover:text-black">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-black">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
