"use client";

import { Icons } from "@/components/icons";
import {
  Cards,
  CircleHalfDottedClock,
  Crosshair,
} from "@/components/icons/custom";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const OPTIONS = [
  {
    label: "Preview do Produto",
    icon: Cards,
    checked: true,
  },
  {
    label: "Customizar Cláusulas",
    icon: Crosshair,
    checked: true,
  },
  {
    label: "Tempo Adicional",
    icon: CircleHalfDottedClock,
    checked: false,
  },
  {
    label: "Tipos de Contrato",
    icon: Icons.bringToFront,
    checked: true,
  },
  {
    label: "Membros da Equipe",
    icon: Icons.users,
    checked: true,
  },
];

export function Personalization() {
  return (
    <div
      className="size-full overflow-clip [mask-image:linear-gradient(black_70%,transparent)]"
      aria-hidden
      tabIndex={-1}
    >
      <div className="mx-3.5 flex cursor-default flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_20px_20px_0_#00000017]">
        <h3 className="text-base font-medium">Customizar Recursos</h3>

        <div className="flex flex-col gap-2.5">
          {OPTIONS.map(({ label, icon: Icon, checked }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 p-2.5"
            >
              <div className="flex items-center gap-2 text-neutral-800">
                <Icon className="size-5" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <div>
                <DummySwitch checked={checked} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DummySwitch({ checked }: { checked: boolean }) {
  const [isChecked, setIsChecked] = useState(checked);

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={setIsChecked}
      className="radix-state-checked:bg-orange-600 focus-visible:ring-orange-500"
    />
  );
}
