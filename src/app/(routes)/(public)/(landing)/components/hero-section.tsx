import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 w-full -translate-x-1/2 text-neutral-300 [mask-image:linear-gradient(transparent,black_70%)]">
          <div className="h-full w-full bg-[radial-gradient(circle_600px_at_50%_350px,rgba(14,118,253,0.15),transparent)]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1120px] px-4">
        <div className="mx-auto max-w-[64rem] text-center">
          <AnimatedGradientText className="text-sm font-normal text-muted-foreground py-1 flex items-center gap-x-2 mb-4">
            Beta teste | Inscreva-se agora
          </AnimatedGradientText>
          <h1 className="font-bold text-4xl sm:text-5xl">
            Alugg transforma seu aluguel <br className="hidden sm:inline" /> em
            potência de negócio
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-center w-3/4 mx-auto">
            A plataforma completa para gerenciar o aluguel de itens — roupas,
            móveis, equipamentos e o que mais você imaginar. Sem limites. Sem
            complicações.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/cadastro"
              className="w-full sm:w-auto rounded-full bg-foreground px-8 py-3 text-background font-medium hover:bg-foreground/90"
            >
              Comece agora
            </a>
          </div>

          {/* Simulador interativo: visão de item no inventário */}
          <div className="mt-16 mb-2 mx-auto max-w-2xl bg-background rounded-xl shadow-lg overflow-hidden border">
            {/* Header do item */}
            <div className="p-4 bg-muted/50 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="size-9 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  📦
                </div>
                <div>
                  <h3 className="font-medium text-lg">Cadeira de escritório</h3>
                  <p className="text-sm text-muted-foreground">
                    Em estoque: 12 unidades
                  </p>
                </div>
              </div>

              <span className="text-sm rounded-full bg-green-100 text-green-700 px-3 py-1">
                Disponível
              </span>
            </div>

            {/* Corpo com infos + ações rápidas */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Valor de aluguel
                  </p>
                  <p className="font-medium">R$ 35,00 / dia</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">Mobiliário</p>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end gap-3">
                <button className="text-sm px-4 py-2 border rounded-md hover:bg-muted">
                  Editar item
                </button>
                <button className="text-sm px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90">
                  Registrar aluguel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
