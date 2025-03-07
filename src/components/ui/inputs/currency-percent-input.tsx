import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export interface CurrencyPercentInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number, mode?: "currency" | "percent") => void;
  defaultMode?: "currency" | "percent";
  defaultValue?: number;
  maxCurrencyValue?: number;
}

export function CurrencyPercentInput({
  className,
  onValueChange,
  defaultMode = "currency",
  defaultValue = 0,
  maxCurrencyValue,
  ...props
}: CurrencyPercentInputProps) {
  const [mode, setMode] = useState<"currency" | "percent">(defaultMode);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicializa o valor de exibição com base no defaultValue
  useEffect(() => {
    if (defaultValue !== undefined) {
      const formattedValue =
        mode === "currency"
          ? defaultValue.toString().replace(".", ",")
          : defaultValue.toString();
      setDisplayValue(formattedValue);
    }
  }, [defaultValue, mode]);

  const parseValue = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(",", "."));
  };

  const validateValue = (value: number) => {
    if (
      mode === "currency" &&
      maxCurrencyValue !== undefined &&
      value > maxCurrencyValue
    ) {
      setIsInvalid(true);
      return false;
    }
    setIsInvalid(false);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Permite apenas números e separador decimal (vírgula ou ponto)
    value = value.replace(/[^\d,.]/g, "");
    
    // Garante que só tenha um separador decimal
    const commaCount = (value.match(/,/g) || []).length;
    const dotCount = (value.match(/\./g) || []).length;
    
    if (commaCount > 1 || dotCount > 1 || (commaCount >= 1 && dotCount >= 1)) {
      // Se houver mais de um separador, mantém apenas o primeiro
      const parts = value.split(/[,.]/);
      if (mode === "currency") {
        value = parts[0] + (parts.length > 1 ? "," + parts.slice(1).join("") : "");
      } else {
        value = parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");
      }
    }
    
    // Limita casas decimais
    if (value.includes(",") || value.includes(".")) {
      const separator = mode === "currency" ? "," : ".";
      const parts = value.split(separator);
      
      if (parts.length > 1) {
        const decimal = parts[1];
        if ((mode === "currency" && decimal.length > 2) || 
            (mode === "percent" && decimal.length > 1)) {
          const maxLength = mode === "currency" ? 2 : 1;
          value = parts[0] + separator + decimal.slice(0, maxLength);
        }
      }
    }
    
    // Limita valores máximos
    const numValue = parseValue(value);
    if (mode === "percent" && numValue > 100) {
      value = "100";
    }
    
    setDisplayValue(value);
    onValueChange?.(parseValue(value), mode);
    validateValue(parseValue(value));
  };

  const toggleMode = () => {
    const newMode = mode === "currency" ? "percent" : "currency";
    setMode(newMode);
    
    if (displayValue) {
      const value = parseValue(displayValue);
      
      // Limita o valor a 100 ao mudar para modo porcentagem
      const limitedValue = newMode === "percent" && value > 100 ? 100 : value;
      
      // Formata o valor de acordo com o novo modo
      const formattedValue = newMode === "currency" 
        ? limitedValue.toString().replace(".", ",") 
        : limitedValue.toString();
      
      setDisplayValue(formattedValue);
      onValueChange?.(limitedValue, newMode);
      validateValue(limitedValue);
    }
    
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const inputComponent = (
    <Input
      ref={inputRef}
      className={cn(
        "peer ps-9",
        className,
        isInvalid ? "border-red-500 focus-visible:ring-red-500" : ""
      )}
      value={displayValue}
      onChange={handleChange}
      placeholder={mode === "currency" ? "0,00" : "0.0"}
      {...props}
    />
  );

  return (
    <div className="relative flex w-full">
      <Button
        type="button"
        onClick={toggleMode}
        className="absolute text-xs inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground hover:text-foreground z-10 bg-transparent border-none shadow-none hover:bg-transparent"
      >
        {mode === "currency" ? "R$" : "%"}
      </Button>

      {isInvalid && mode === "currency" ? (
        <Tooltip>
          <TooltipTrigger asChild>{inputComponent}</TooltipTrigger>
          <TooltipContent className="text-xs bg-red-500 text-white">
            O desconto não pode ser maior que o valor do item
          </TooltipContent>
        </Tooltip>
      ) : (
        inputComponent
      )}
    </div>
  );
}
