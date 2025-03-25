import { SVGProps, useEffect, useRef } from "react";

export function CreditCardIcon({
  "data-hovered": hovered,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (hovered) {
      // Animar o chip do cartão
      const chip = ref.current.querySelector(".card-chip");
      if (chip) {
        chip.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.1)" },
            { transform: "scale(1)" },
          ],
          {
            duration: 1200,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      }

      // Animar a linha de assinatura
      const signatureLine = ref.current.querySelector(".signature-line");
      if (signatureLine) {
        signatureLine.animate(
          [
            { opacity: 0.6, transform: "translateX(0)" },
            { opacity: 1, transform: "translateX(2px)" },
            { opacity: 0.6, transform: "translateX(0)" },
          ],
          {
            duration: 1000,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      }

      // Animar o contorno do cartão
      const cardOutline = ref.current.querySelector(".card-outline");
      if (cardOutline) {
        cardOutline.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(-1px)" },
            { transform: "translateY(0)" },
          ],
          {
            duration: 1500,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      }

      // Animar as linhas de dados
      const dataLines = ref.current.querySelectorAll(".data-line");
      dataLines.forEach((line, index) => {
        line.animate(
          [
            { opacity: 0.7, transform: "translateX(0)" },
            {
              opacity: 1,
              transform: `translateX(${index % 2 === 0 ? 1 : -1}px)`,
            },
            { opacity: 0.7, transform: "translateX(0)" },
          ],
          {
            duration: 900,
            delay: index * 150,
            iterations: Infinity,
          }
        );
      });
    } else {
      // Cancela todas as animações em execução
      ref.current
        .querySelectorAll("*")
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
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Contorno do cartão */}
        <rect
          className="card-outline"
          x="1"
          y="4"
          width="22"
          height="16"
          rx="2"
        />

        {/* Chip do cartão */}
        <rect
          className="card-chip"
          x="4"
          y="8"
          width="4"
          height="3"
          fill="currentColor"
          stroke="none"
        />

        {/* Linha de dados */}
        <line className="data-line" x1="4" y1="15" x2="12" y2="15" />

        {/* Linha de assinatura */}
        <line
          className="signature-line"
          x1="15"
          y1="15"
          x2="20"
          y2="15"
          stroke="currentColor"
        />

        {/* Linha de dados adicional */}
        <line className="data-line" x1="4" y1="12" x2="14" y2="12" />
      </g>
    </svg>
  );
}

export default CreditCardIcon;
