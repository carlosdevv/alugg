import { SVGProps, useEffect, useRef } from "react";

export function CustomerIcon({
  "data-hovered": hovered,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const heads = ref.current.querySelectorAll("circle");

    if (hovered) {
      // Animação da primeira cabeça (leve movimento circular)
      heads[0].animate(
        [
          { transform: "translate(0, 0)" },
          { transform: "translate(1px, -1px)" },
          { transform: "translate(0, -2px)" },
          { transform: "translate(-1px, -1px)" },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: 1500,
          iterations: Infinity,
          easing: "ease-in-out",
        }
      );

      // Animação da segunda cabeça (movimento levemente diferente)
      heads[1].animate(
        [
          { transform: "translate(0, 0)" },
          { transform: "translate(-1px, -1px)" },
          { transform: "translate(-1px, 1px)" },
          { transform: "translate(1px, 1px)" },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: 1800,
          iterations: Infinity,
          easing: "ease-in-out",
          delay: 200, // Pequeno atraso para dessincronizar do primeiro
        }
      );
    } else {
      // Cancela todas as animações quando não estiver em hover
      heads.forEach((head) =>
        head.getAnimations().forEach((anim) => anim.cancel())
      );
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
      {/* Primeiro usuário (frente) */}
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />

      {/* Segundo usuário (atrás) */}
      <circle cx="16" cy="11" r="4" />
      <path d="M21 21v-2a4 4 0 0 0-4-4h-4" />
    </svg>
  );
}
