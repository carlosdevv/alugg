import UiDark from "@/assets/ui-dark.png";
import UiLight from "@/assets/ui-light.png";
import UiSystem from "@/assets/ui-system.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Minus } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { toast } from "sonner";

const options = [
  { value: "light", label: "Claro", image: UiLight },
  { value: "dark", label: "Escuro", image: UiDark },
  { value: "system", label: "Sistema", image: UiSystem },
];

export function ToggleAppTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tema</CardTitle>
        <CardDescription>Escolha o tema da aplicação</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        <fieldset className="space-y-4">
          <legend className="text-sm font-medium leading-none text-foreground">
            Escolha seu tema
          </legend>
          <RadioGroup className="flex gap-3" defaultValue={theme ?? "system"}>
            {options.map((item) => (
              <label key={item.value}>
                <RadioGroupItem
                  id={item.value}
                  value={item.value}
                  className="peer sr-only after:absolute after:inset-0"
                  onClick={() => {
                    setTheme(item.value);
                    toast.success("Tema alterado com sucesso");
                  }}
                />
                <Image
                  src={item.image}
                  alt={item.label}
                  width={88}
                  height={70}
                  className="relative cursor-pointer overflow-hidden rounded-lg border border-input shadow-sm shadow-black/5 ring-offset-background transition-colors peer-[:focus-visible]:ring-2 peer-[:focus-visible]:ring-ring/70 peer-[:focus-visible]:ring-offset-2 peer-data-[disabled]:cursor-not-allowed peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent peer-data-[disabled]:opacity-50"
                />
                <span className="group mt-2 flex items-center gap-1 peer-data-[state=unchecked]:text-muted-foreground/70">
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="peer-data-[state=unchecked]:group-[]:hidden"
                    aria-hidden="true"
                  />
                  <Minus
                    size={16}
                    strokeWidth={2}
                    className="peer-data-[state=checked]:group-[]:hidden"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>
      </CardContent>
    </Card>
  );
}
