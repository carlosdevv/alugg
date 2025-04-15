import { Icons } from "@/components/icons";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ArrowRight, Copy, Search } from "lucide-react";

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

      <div className="relative z-10 mx-auto max-w-[1200px] px-4">
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

          {/* Simulador interativo */}
          <div className="mt-16 mx-auto max-w-2xl bg-background rounded-xl shadow-lg overflow-hidden border">
            {/* Input de busca simulado */}
            <div className="p-4 bg-muted/50 border-b">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Buscar imóvel...</span>
              </div>
            </div>

            {/* Resultado da simulação */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-6 w-6">🏠</div>
                  </div>
                  <div>
                    <h3 className="font-medium">Apartamento - Centro</h3>
                    <p className="text-sm text-muted-foreground">
                      Disponível para aluguel
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">R$ 1.500,00</span>
                  <button className="p-1 rounded-full hover:bg-muted">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Visualizações: 65
                  </span>
                </div>
                <a
                  href="/imovel/apartamento-centro"
                  className="flex items-center text-sm text-primary hover:text-primary/90"
                >
                  Ver detalhes
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
