import { appRoutes } from "@/lib/constants";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-[1120px] px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              {/* <Image src="/logo.svg" alt="Alugg logo" width={32} height={32} /> */}
              <div>logo</div>
              <span className="text-xl font-bold">Alugg</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Soluções</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={appRoutes.resources}>Contratos</Link>
              </li>
              <li>
                <Link href={appRoutes.resources}>Inventário</Link>
              </li>
              <li>
                <Link href={appRoutes.resources}>Colaboração</Link>
              </li>
              <li>
                <Link href={appRoutes.plans}>Planos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={appRoutes.aboutUs}>Sobre nós</Link>
              </li>
              <li>
                <Link href={appRoutes.contact}>Contato</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={appRoutes.privacyPolicy}>Privacidade</Link>
              </li>
              <li>
                <Link href={appRoutes.termsOfService}>Termos de uso</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-8 sm:flex-row">
          <div className="group flex max-w-fit items-center gap-2 rounded-lg border border-neutral-200 bg-white py-2 pl-2 pr-2.5 transition-colors hover:bg-neutral-50 active:bg-neutral-100">
            <div className="relative size-2">
              <div className="absolute bg-green-500 inset-0 m-auto size-2 animate-ping items-center justify-center rounded-full group-hover:animate-none" />
              <div className="absolute inset-0 z-10 m-auto size-2 rounded-full bg-green-500" />
            </div>
            <p className="text-xs font-medium leading-none text-neutral-600">
              Plataforma Online
            </p>
          </div>
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Alugg.
          </p>
        </div>
      </div>
    </footer>
  );
}
