import { SVGProps, useEffect, useRef } from "react";

export function ContractIcon({
  "data-hovered": hovered,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const lines = ref.current.querySelectorAll("line");
    const pen = ref.current.querySelector("path#pen");

    if (hovered) {
      // Anima as linhas (representando texto no documento)
      lines.forEach((line, index) => {
        line.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          {
            duration: 500,
            delay: index * 100,
            iterations: Infinity,
            direction: "alternate", // Vai e volta no fade
          }
        );
      });

      // Anima a caneta (movimento suave para frente e para trás)
      pen?.animate(
        [
          { transform: "translate(0, 0)" },
          { transform: "translate(2px, -2px)" },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: 1000,
          iterations: Infinity,
        }
      );
    } else {
      // Cancela todas as animações
      lines.forEach((line) =>
        line.getAnimations().forEach((anim) => anim.cancel())
      );
      pen?.getAnimations().forEach((anim) => anim.cancel());
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
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Documento */}
        <rect x="6" y="3" width="12" height="18" rx="2" ry="2" />
        {/* Linhas de texto */}
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
        {/* Caneta */}
        <path
          id="pen"
          d="M17 21l4-4-2-2-4 4 2 2z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
