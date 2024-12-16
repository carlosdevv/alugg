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

export function formatToCurrency(value: string) {
  const numericValue = value.replace(/[^\d]/g, "");

  if (!numericValue) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(0);
  }

  const valueAsNumber = parseFloat(numericValue) / 100;

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(valueAsNumber);

  return formattedValue;
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