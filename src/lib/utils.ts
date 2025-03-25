import { type ClassValue, clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlug(text: string): string {
  return slugify(text, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
}

/**
 * Sorts an array using the specified compare function, preserving the order
 * of elements that compare equally.
 */
export const stableSort = <T>(arr: T[], compare: (a: T, b: T) => number) =>
  arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => compare(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);

export function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return initials;
}

export function currencyToNumber(value: string): number {
  // Remove o símbolo de moeda e outros caracteres não numéricos, exceto vírgulas e pontos
  const numericValue = value.replace(/[^\d,-]/g, "").replace(",", ".");

  // Converte para número
  const numberValue = parseFloat(numericValue);

  // Retorna 0 se a conversão falhar
  return isNaN(numberValue) ? 0 : numberValue;
}

export const itemsFileAcceptTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export const UPLOAD_ITEMS_MAX_FILE_SIZE_MB = 10;

export function parseToNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function parseToCnpj(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

// Função para converter string para número
export const parseValue = (value: string): number => {
  return parseFloat(value.replace(",", ".")) || 0;
};

// Função utilitária para validar e formatar inputs de moeda
export const handleCurrencyInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onValueChange: (value: number) => void,
  maxValue: number = 10000000
) => {
  // Obtém o valor atual do input e a posição do cursor
  let value = e.target.value;
  const cursorPosition = e.target.selectionStart || 0;

  // Permite apenas números e vírgula
  const cleanValue = value.replace(/[^\d,]/g, "");

  // Se o valor foi alterado pela validação, ajusta a posição do cursor
  if (cleanValue !== value) {
    value = cleanValue;
    // Ajusta a posição do cursor se caracteres foram removidos
    setTimeout(() => {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  }

  // Garante que só tenha uma vírgula
  const commaCount = (value.match(/,/g) || []).length;
  if (commaCount > 1) {
    const parts = value.split(",");
    value = parts[0] + "," + parts.slice(1).join("");
  }

  // Limita a duas casas decimais após a vírgula
  if (value.includes(",")) {
    const [whole, decimal] = value.split(",");
    if (decimal && decimal.length > 2) {
      value = whole + "," + decimal.slice(0, 2);
    }
  }

  // Converte para número para validação
  let numValue = 0;
  if (value) {
    // Se o valor termina com vírgula, adiciona zero para conversão
    const valueForParsing = value.endsWith(",") ? value + "0" : value;
    numValue = parseFloat(valueForParsing.replace(",", ".")) || 0;
  }

  // Limita o valor ao máximo definido
  if (numValue > maxValue) {
    numValue = maxValue;
    value = maxValue.toString();
  }

  // Atualiza o valor através do callback
  onValueChange(numValue);

  // Atualiza o input com o valor digitado
  e.target.value = value;

  // Restaura a posição do cursor após a atualização do valor
  setTimeout(() => {
    // Calcula a nova posição do cursor
    const newPosition = Math.min(value.length, cursorPosition);
    e.target.setSelectionRange(newPosition, newPosition);
  }, 0);
};

// Função para formatar um valor para exibição como moeda
export const formatToCurrency = (value: string | number): string => {
  if (!value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(0);
  }

  const numValue =
    typeof value === "string"
      ? parseFloat(value.replace(",", ".")) || 0
      : value;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(numValue);
};
