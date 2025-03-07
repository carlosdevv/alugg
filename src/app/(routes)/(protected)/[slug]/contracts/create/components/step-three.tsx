import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/custom/calendar-rac";
import { DateInput } from "@/components/ui/custom/date-rac";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyPercentInput } from "@/components/ui/inputs/currency-percent-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreateContractContext } from "@/contexts/create-contract-context";
import { useGetItemsService } from "@/http/items/use-items-service";
import { formatToCurrency, handleCurrencyInputChange } from "@/lib/utils";
import { parseDate } from "@internationalized/date";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button as AriaButton,
  Popover as AriaPopover,
  DatePicker,
  Dialog,
  Group,
} from "react-aria-components";

const paymentMethods = [
  {
    id: "pix",
    name: "Pix",
  },
  {
    id: "card",
    name: "Cartão de Crédito/Débito",
  },
  {
    id: "billet",
    name: "Boleto",
  },
];

export function StepThree() {
  const { slug } = useParams() as { slug: string };
  const { form, selectedItems, setCurrentStep } = useCreateContractContext();
  const { data: items } = useGetItemsService({ slug });
  const [totalValue, setTotalValue] = useState(0);
  const [itemValues, setItemValues] = useState<Record<string, number>>({});
  const [bonusItems, setBonusItems] = useState<Record<string, boolean>>({});
  const [discounts, setDiscounts] = useState<
    Record<string, { value: number; mode: "currency" | "percent" }>
  >({});

  const formatBrazilianDate = (dateString: string) => {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/").map(Number);

    return format(new Date(year, month - 1, day), "dd MMM", {
      locale: ptBR,
    });
  };

  // Função para adicionar novo método de pagamento
  const addPaymentMethod = () => {
    const currentPaymentMethods = form.getValues("paymentMethod") || [];
    form.setValue("paymentMethod", [
      ...currentPaymentMethods,
      {
        method: "",
        value: 0,
        cardInstallments: 1,
        paymentDate: "",
        isPaid: false,
      },
    ]);
  };

  // Função para remover método de pagamento
  const removePaymentMethod = (index: number) => {
    const currentPaymentMethods = form.getValues("paymentMethod") || [];
    const updatedMethods = [...currentPaymentMethods];
    updatedMethods.splice(index, 1);
    form.setValue("paymentMethod", updatedMethods);
  };

  // Função para aplicar desconto
  const applyDiscount = (
    itemId: string,
    value: number,
    mode: "currency" | "percent"
  ) => {
    const item = items?.find((i) => i.id === itemId);
    const quantity = selectedItems.get(itemId) || 0;

    if (!item) return;

    const baseValue = itemValues[itemId] || item.rentPrice * quantity;

    // Validar desconto em valor para não exceder o valor do item
    if (mode === "currency" && value > baseValue) {
      value = baseValue;
    }

    // Validar desconto percentual para não exceder 100%
    if (mode === "percent" && value > 100) {
      value = 100;
    }

    setDiscounts({
      ...discounts,
      [itemId]: { value, mode },
    });
  };

  // Inicializar com um método de pagamento se não houver nenhum
  useEffect(() => {
    const currentPaymentMethods = form.getValues("paymentMethod");
    if (!currentPaymentMethods || currentPaymentMethods.length === 0) {
      form.setValue("paymentMethod", [
        {
          method: "",
          value: 0,
          cardInstallments: 1,
          paymentDate: "",
          isPaid: false,
        },
      ]);
    }
  }, [form]);

  // Calcular o valor total dos itens
  useEffect(() => {
    let total = 0;
    Array.from(selectedItems).forEach(([itemId, quantity]) => {
      const item = items?.find((i) => i.id === itemId);
      if (item && !bonusItems[itemId]) {
        const baseValue = itemValues[itemId] || item.rentPrice * quantity;
        let finalValue = baseValue;

        // Aplicar desconto se existir
        if (discounts[itemId]) {
          const { value, mode } = discounts[itemId];
          if (mode === "percent") {
            finalValue = baseValue * (1 - value / 100);
          } else if (mode === "currency") {
            finalValue = Math.max(0, baseValue - value);
          }
        }

        total += finalValue;
      }
    });
    setTotalValue(total);
  }, [itemValues, selectedItems, items, bonusItems, discounts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.45fr] gap-4">
      <div className="flex flex-col gap-4">
        {/* Event Date Card */}
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-center justify-between w-full py-4 px-4 sm:px-20 gap-4">
            <div className="flex flex-col items-center text-xs gap-y-0.5">
              <Icons.calendar className="size-5 mb-1" />
              <span className="font-medium">Evento</span>
              <span className="text-muted-foreground font-medium">
                {formatBrazilianDate(form.watch("eventDate"))}
              </span>
            </div>
            <div className="flex flex-col items-center text-xs gap-y-0.5">
              <Icons.calendar className="size-5 mb-1" />
              <span className="font-medium">Retirada</span>
              <span className="text-muted-foreground font-medium">
                {formatBrazilianDate(form.watch("withdrawalDate"))}
              </span>
            </div>
            <div className="flex flex-col items-center text-xs gap-y-0.5">
              <Icons.calendar className="size-5 mb-1" />
              <span className="font-medium">Devolução</span>
              <span className="text-muted-foreground font-medium">
                {formatBrazilianDate(form.watch("returnDate"))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card className="max-h-96 h-full">
          <CardHeader className="flex flex-col sm:flex-row justify-between">
            <CardTitle className="mb-2 sm:mb-0">Produtos Contratados</CardTitle>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentStep(2)}
            >
              Adicionar Produto
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-y-2">
            <header className="grid grid-cols-2 sm:grid-cols-6 text-xs text-muted-foreground mt-4 gap-x-4">
              <span className="col-span-1 sm:col-span-1">Nome</span>
              <span className="hidden sm:block sm:col-span-1">Código</span>
              <span className="col-span-1 sm:col-span-1">Quantidade</span>
              <span className="hidden sm:block sm:col-span-1 text-center">
                Bônus
              </span>
              <div className="hidden sm:flex sm:col-span-1 items-center gap-x-2 justify-center">
                <span>Desconto</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.help className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Desconto é opcional, caso não seja informado, o desconto
                      será de 0%
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="hidden sm:block sm:col-span-1 text-right truncate">
                Valor por Item
              </span>
            </header>

            {/* body */}
            <div className="h-full max-h-80 overflow-y-auto space-y-4">
              {Array.from(selectedItems).map(([itemId, quantity]) => {
                const item = items?.find((i) => i.id === itemId);
                if (!item) return null;

                const baseValue =
                  itemValues[itemId] || item.rentPrice * quantity;
                const discount = discounts[itemId] || {
                  value: 0,
                  mode: "currency",
                };
                let finalValue = baseValue;

                if (discount.mode === "percent") {
                  finalValue = baseValue * (1 - discount.value / 100);
                } else {
                  finalValue = Math.max(0, baseValue - discount.value);
                }

                return (
                  <div
                    key={itemId}
                    className="grid grid-cols-2 sm:grid-cols-6 items-center gap-x-4 gap-y-2 py-2 border-b border-border"
                  >
                    <span className="col-span-1 sm:col-span-1 font-medium text-xs truncate">
                      {item.name}
                    </span>
                    <span className="hidden sm:block sm:col-span-1 font-medium text-xs">
                      {item.code ?? "N/A"}
                    </span>
                    <span className="col-span-1 sm:col-span-1 font-medium text-xs">
                      {quantity}
                    </span>
                    <div className="hidden sm:flex sm:col-span-1 justify-center">
                      <Checkbox
                        checked={bonusItems[itemId] || false}
                        onCheckedChange={(checked) => {
                          const newBonusItems = { ...bonusItems };
                          newBonusItems[itemId] = !!checked;
                          setBonusItems(newBonusItems);
                        }}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-1 relative flex rounded-md shadow-xs justify-center">
                      <CurrencyPercentInput
                        className="rounded shadow-none"
                        defaultMode={discount.mode}
                        defaultValue={discount.value}
                        onValueChange={(value, mode) => {
                          applyDiscount(itemId, value, mode || discount.mode);
                        }}
                        maxCurrencyValue={baseValue}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-1 relative flex rounded-md shadow-xs justify-end">
                      <div className="relative w-full">
                        <Input
                          className="peer ps-9"
                          placeholder="0,00"
                          defaultValue={item.rentPrice
                            .toString()
                            .replace(".", ",")}
                          onChange={(e) => {
                            handleCurrencyInputChange(e, (value) => {
                              const newItemValues = { ...itemValues };
                              newItemValues[itemId] = value * quantity;
                              setItemValues(newItemValues);
                            });
                          }}
                        />
                        <div className="text-muted-foreground/80 text-xs pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                          R$
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between">
            <CardTitle className="mb-2 sm:mb-0">Método de Pagamento</CardTitle>
            <Button variant="secondary" size="sm" onClick={addPaymentMethod}>
              Adicionar Método
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-y-6 py-4">
            {form.watch("paymentMethod")?.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_0.4fr_0.4fr] gap-4 relative p-4 rounded-md"
              >
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-7 right-2"
                    onClick={() => removePaymentMethod(index)}
                  >
                    <Icons.delete className="size-5 text-rose-500" />
                  </Button>
                )}

                <FormField
                  control={form.control}
                  name={`paymentMethod.${index}.method`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs truncate">
                        Método de Pagamento
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Selecione um método"
                              className="placeholder:text-xs"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`paymentMethod.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs">Valor</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            className="peer ps-9"
                            placeholder="0,00"
                            onChange={(e) => {
                              handleCurrencyInputChange(e, (value) => {
                                field.onChange(value);
                              });
                            }}
                          />
                          <div className="text-muted-foreground/80 text-xs pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                            R$
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`paymentMethod.${index}.paymentDate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2 w-full">
                      <FormLabel className="text-xs">
                        Data de Pagamento
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          className="space-y-2"
                          onChange={(value) => {
                            if (!value) return;
                            const day =
                              value.day > 9 ? value.day : `0${value.day}`;
                            const month =
                              value.month > 9 ? value.month : `0${value.month}`;
                            const formattedDate = `${day}/${month}/${value.year}`;
                            field.onChange(formattedDate);
                          }}
                          defaultValue={
                            field.value
                              ? parseDate(
                                  field.value.split("/").reverse().join("-")
                                )
                              : parseDate(
                                  new Date().toISOString().split("T")[0]
                                ) // Data atual como padrão
                          }
                        >
                          <div className="flex">
                            <Group className="w-full">
                              <DateInput className="pe-9 text-xs" />
                            </Group>
                            <AriaButton
                              type="button"
                              className="z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70"
                            >
                              <Icons.calendar
                                className="size-4"
                                strokeWidth={2}
                              />
                            </AriaButton>
                          </div>
                          <AriaPopover
                            className="z-50 rounded-lg border border-border bg-background text-popover-foreground shadow-lg shadow-black/5 outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
                            offset={4}
                          >
                            <Dialog className="max-h-[inherit] overflow-auto p-2">
                              <Calendar />
                            </Dialog>
                          </AriaPopover>
                        </DatePicker>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`paymentMethod.${index}.cardInstallments`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs">Parcelas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1"
                          type="number"
                          min={1}
                          max={99}
                          {...field}
                          onChange={(e) => {
                            const value = Math.min(
                              Math.max(1, Number(e.target.value)),
                              99
                            );
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`paymentMethod.${index}.isPaid`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-y-2">
                      <FormLabel className="text-xs">Pago</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            {(!form.watch("paymentMethod") ||
              form.watch("paymentMethod").length === 0) && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={addPaymentMethod}
                  className="w-full sm:w-auto"
                >
                  Adicionar método de pagamento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Total Card */}
      <Card className="h-auto lg:h-96 w-full lg:w-auto">
        <CardHeader>
          <CardTitle>
            Total: {formatToCurrency(totalValue.toString())}
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
