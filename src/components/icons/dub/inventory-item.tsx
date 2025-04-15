import { SVGProps, useEffect, useRef } from "react";

export function InventoryItemsIcon({
  "data-hovered": hovered,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (hovered) {
      // Animar a parte superior da caixa (tampa)
      const topPaths = ref.current.querySelectorAll("path");
      topPaths.forEach((path) => {
        path.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(-2px)" },
            { transform: "translateY(0)" },
          ],
          {
            duration: 800,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      });

      // Animar as linhas internas (pulsando)
      const lines = ref.current.querySelectorAll("line");
      lines.forEach((line) => {
        line.animate(
          [{ strokeWidth: "2" }, { strokeWidth: "3" }, { strokeWidth: "2" }],
          {
            duration: 1200,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      });

      // Animar o polígono principal (leve tremor)
      const polygon = ref.current.querySelector("polygon");
      if (polygon) {
        polygon.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(1px)" },
            { transform: "translateY(0)" },
          ],
          {
            duration: 600,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      }
    } else {
      // Cancelar todas as animações
      ref.current
        .querySelectorAll("path, line, polygon")
        .forEach((el) => el.getAnimations().forEach((anim) => anim.cancel()));
    }
  }, [hovered]);

  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...rest}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Forma principal do pacote */}
      <path d="M16.5 9.4l-9-5.19" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />

      {/* Linhas internas do pacote */}
      <line x1="3.27" y1="6.96" x2="12" y2="12.01" />
      <line x1="12" y1="12.01" x2="20.73" y2="6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
