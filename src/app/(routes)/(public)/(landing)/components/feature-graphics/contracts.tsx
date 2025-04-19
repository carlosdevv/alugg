import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

const CONTRACTS = [
  {
    name: "contrato-locação.pdf",
    clicks: "967 usos",
    primary: true,
  },
  {
    name: "contrato-venda.pdf",
    clicks: "233 usos",
  },
  {
    name: "contrato-devolução.pdf",
    clicks: "111 usos",
  },
];

export function Contracts() {
  return (
    <div className="flex size-full flex-col justify-center" aria-hidden>
      <div className="flex flex-col gap-2.5 [mask-image:linear-gradient(90deg,black_70%,transparent)]">
        {CONTRACTS.map(({ name, clicks, primary }, idx) => (
          <div
            key={name}
            className="transition-transform duration-300 hover:translate-x-[-2%]"
          >
            <div
              className={cn(
                "flex cursor-default items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
                "ml-[calc((var(--idx)+1)*5%)]"
              )}
              style={{ "--idx": idx } as CSSProperties}
            >
              <div className="flex-none rounded-full border border-neutral-200 bg-gradient-to-t from-neutral-100 p-2">
                <div className="size-3 bg-muted-foreground rounded-full" />
              </div>

              <span className="text-base font-medium text-neutral-900">
                {name}
              </span>

              <div className="ml-2 flex items-center gap-x-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-[0.2rem]">
                <Icons.mousePointer className="size-4 text-neutral-700" />
                <div className="flex items-center whitespace-nowrap text-sm text-neutral-500">
                  {clicks}
                </div>
              </div>

              {primary && (
                <div className="flex items-center gap-x-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-[0.2rem]">
                  <Icons.flag className="size-4 text-blue-700" />
                  <div className="flex items-center whitespace-nowrap text-sm text-blue-600">
                    Principal
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
