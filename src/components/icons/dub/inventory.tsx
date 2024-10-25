import { SVGProps, useEffect, useRef } from "react";

export function InventoryIcon({
  "data-hovered": hovered,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  // Corrigido para referenciar corretamente o tipo SVGRectElement
  const refLid = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!refLid.current) return;

    if (hovered) {
      refLid.current.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }],
        {
          duration: 300,
          fill: "forwards",
        }
      );
    } else {
      refLid.current.animate(
        [{ transform: "translateY(-5px)" }, { transform: "translateY(0)" }],
        {
          duration: 300,
          fill: "forwards",
        }
      );
    }
  }, [hovered]);

  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Caixa */}
        <rect width="20" height="5" x="2" y="3" rx="1" ref={refLid} />
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
        <path d="M10 12h4" />
      </g>
    </svg>
  );
}
