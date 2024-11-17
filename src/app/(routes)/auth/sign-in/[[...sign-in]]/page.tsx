import { appRoutes } from "@/lib/constants";
import Link from "next/link";
import SignInForm from "./components/sign-in-form";

export default function SignInPage() {
  return (
    <section className="h-screen flex flex-1">
      <div className="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r shadow-lg">
        <div className="flex-1 flex flex-col justify-center w-80 sm:w-96">
          <div className="mb-10">
            <h1 className="text-2xl lg:text-3xl mb-2">Bem vindo de volta!</h1>
            <h2 className="text-sm font-light text-muted-foreground">
              Faça o login na sua conta.
            </h2>
          </div>
          <SignInForm />
          <div className="self-center my-8 text-sm">
            <div className="flex gap-x-1">
              <span className="text-muted-foreground">Não tem uma conta?</span>
              <Link
                href={appRoutes.signUp}
                passHref
                className="underline transition text-foreground hover:text-muted-foreground"
              >
                Registre-se Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
      <aside className="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex bg-muted" >
          <div className="text-4xl ">
        Allug logo
          </div>
      </aside>
    </section>
  );
}
