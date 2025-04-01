import { appRoutes } from "@/lib/constants";
import Link from "next/link";
import SignUpForm from "./components/sign-up-form";

export default function SignUpPage() {
  return (
    <section className="h-screen flex flex-1">
      <div className="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r shadow-lg">
        <div className="flex-1 flex flex-col justify-center w-80 sm:w-96">
          <div className="mb-10">
            <h1 className="text-2xl lg:text-3xl mb-2">Comece agora</h1>
            <h2 className="text-sm font-light text-muted-foreground">
              Crie uma nova conta.
            </h2>
          </div>
          <SignUpForm />
          <div className="self-center my-8 text-sm">
            <div className="flex gap-x-1">
              <span className="text-muted-foreground">Já tem uma conta?</span>
              <Link
                href={appRoutes.signIn}
                passHref
                className="underline transition text-foreground hover:text-muted-foreground"
              >
                Entre Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
      <aside className="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex bg-muted" />
    </section>
  );
}
