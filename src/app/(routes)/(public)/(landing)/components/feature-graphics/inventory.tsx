"use client";

import { Icons } from "@/components/icons";
import { ClientOnly } from "@/components/ui/client-only";
import { ShimmerDots } from "@/components/ui/shimmer-dots";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";

export function Inventory() {
  const { isMobile } = useMediaQuery();

  return (
    <div className="size-full [mask-image:linear-gradient(black_70%,transparent)]">
      <div
        className="mx-3.5 flex origin-top scale-95 cursor-default flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_20px_20px_0_#00000017]"
        aria-hidden
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Inventário</h3>
          <div className="max-md:hidden" aria-hidden>
            <kbd className="flex size-6 cursor-default items-center justify-center rounded-md border border-neutral-200 font-sans text-xs text-neutral-950">
              I
            </kbd>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700">
                Imagem do produto
              </span>
              <Icons.help className="size-4 text-neutral-500" />
            </div>
            <div className="flex h-6 items-center gap-3 px-1">
              <Icons.download className="size-4 text-neutral-500" />
              <Icons.copy className="size-4 text-neutral-500" />
            </div>
          </div>
          <div className="relative mt-2 flex h-40 items-center justify-center overflow-hidden rounded-md border border-neutral-300">
            <ClientOnly>
              {!isMobile && (
                <ShimmerDots className="opacity-30 [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />
              )}
            </ClientOnly>
            <div className="relative flex size-full items-center justify-center">
              <PlaceholderImage />
            </div>
          </div>
        </div>

        {/* Logo toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">
              Em manutenção
            </span>
            <Icons.help className="size-4 text-neutral-500" />
          </div>
          <Switch checked={false} />
        </div>
      </div>
    </div>
  );
}

function PlaceholderImage() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      {/* Background */}
      <rect width="120" height="120" rx="8" fill="#fafbfc" />

      {/* Polaroid-style frame */}
      <rect x="20" y="25" width="80" height="60" rx="6" fill="#e5e7eb" />
      <rect x="30" y="35" width="60" height="40" rx="4" fill="#f3f4f6" />

      {/* Image icon */}
      <path
        d="M45 60L53 50L60 58L67 49L75 60"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="45" r="3" fill="#94a3b8" />

      {/* Bottom bar (like polaroid caption) */}
      <rect x="20" y="85" width="80" height="10" fill="#e5e7eb" rx="2" />
    </svg>
  );
}
