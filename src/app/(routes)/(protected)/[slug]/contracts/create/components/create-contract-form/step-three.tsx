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
import { cn, formatToCurrency, handleCurrencyInputChange } from "@/lib/utils";
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
    id: "PIX",
    name: "Pix",
  },
  {
    id: "CREDIT_CARD",
    name: "Cartão de Crédito",
  },
  {
    id: "DEBIT_CARD",
    name: "Cartão de Débito",
  },
  {
    id: "BANK_TRANSFER",
    name: "Transferência Bancária",
  },
  {
    id: "CASH",
    name: "Dinheiro",
  },
];

export function StepThree() {
  const { slug } = useParams() as { slug: string };
  const { form, selectedItems, setCurrentStep, setTotalValue } =
    useCreateContractContext();
  const { data: items } = useGetItemsService({ slug });
  const [totalValueState, setTotalValueState] = useState(0);

  const formatBrazilianDate = (dateString: string) => {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/").map(Number);

    return format(new Date(year, month - 1, day), "dd MMM", {
      locale: ptBR,
    });
  };

  // Inicializar os itens no formulário
  useEffect(() => {
    if (items && selectedItems.size > 0 && !form.getValues("items")) {
      const formItems = Array.from(selectedItems)
        .map(([itemId, quantity]) => {
          const item = items.find((i) => i.id === itemId);
          if (!item) return null;

          const baseValue = item.rentPrice * quantity;

          return {
            itemId,
            quantity,
            isBonus: false,
            baseValue,
            discount: {
              value: 0,
              mode: "currency" as const,
            },
            finalValue: baseValue,
          };
        })
        .filter(Boolean) as {
        itemId: string;
        quantity: number;
        isBonus: boolean;
        baseValue: number;
        discount: {
          value: number;
          mode: "currency" | "percent";
        };
        finalValue: number;
      }[];

      form.setValue("items", formItems);
    }
  }, [items, selectedItems, form]);

  // Função para adicionar novo método de pagamento
  const addPaymentMethod = () => {
    const currentPaymentMethods = form.getValues("paymentMethod") || [];
    const totalPaid = currentPaymentMethods.reduce(
      (sum, method) => sum + (method.value || 0),
      0
    );
    const remainingValue = Math.max(0, totalValueState - totalPaid);

    form.setValue("paymentMethod", [
      ...currentPaymentMethods,
      {
        method: "",
        value: remainingValue,
        cardInstallments: 1,
        paymentDate: format(new Date(), "dd/MM/yyyy"),
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

  // Função para aplicar desconto e atualizar o valor do item
  const applyDiscount = (
    index: number,
    value: number,
    mode: "currency" | "percent"
  ) => {
    const formItems = form.getValues("items") || [];
    const item = formItems[index];

    if (!item) return;

    // Validar desconto em valor para não exceder o valor do item
    if (mode === "currency" && value > item.baseValue) {
      value = item.baseValue;
    }

    // Validar desconto percentual para não exceder 100%
    if (mode === "percent" && value > 100) {
      value = 100;
    }

    // Calcular o valor final após o desconto
    let finalValue = item.baseValue;
    if (mode === "percent") {
      finalValue = item.baseValue * (1 - value / 100);
    } else {
      finalValue = Math.max(0, item.baseValue - value);
    }

    // Atualizar o item no formulário
    const updatedItems = [...formItems];
    updatedItems[index] = {
      ...item,
      discount: { value, mode },
      finalValue: item.isBonus ? 0 : finalValue,
    };

    form.setValue("items", updatedItems);
  };

  // Função para atualizar o valor base do item
  const updateItemBaseValue = (index: number, unitValue: number) => {
    const formItems = form.getValues("items") || [];
    const item = formItems[index];

    if (!item) return;

    const baseValue = unitValue * item.quantity;

    // Atualizar o item no formulário
    const updatedItems = [...formItems];
    updatedItems[index] = {
      ...item,
      baseValue,
      finalValue: item.isBonus ? 0 : baseValue,
      discount: { value: 0, mode: "currency" as const }, // Resetar desconto quando o valor base é alterado manualmente
    };

    form.setValue("items", updatedItems);
  };

  // Função para atualizar o status de bônus do item
  const updateItemBonusStatus = (index: number, isBonus: boolean) => {
    const formItems = form.getValues("items") || [];
    const item = formItems[index];

    if (!item) return;

    // Atualizar o item no formulário
    const updatedItems = [...formItems];
    updatedItems[index] = {
      ...item,
      isBonus,
      finalValue: isBonus ? 0 : item.finalValue,
    };

    form.setValue("items", updatedItems);
  };

  // Inicializar com um método de pagamento se não houver nenhum
  useEffect(() => {
    const currentPaymentMethods = form.getValues("paymentMethod");
    if (!currentPaymentMethods || currentPaymentMethods.length === 0) {
      form.setValue("paymentMethod", [
        {
          method: "",
          value: totalValueState,
          cardInstallments: 1,
          paymentDate: format(new Date(), "dd/MM/yyyy"),
          isPaid: false,
        },
      ]);
    }
  }, [form, totalValueState]);

  // Calcular o valor total dos itens
  useEffect(() => {
    const formItems = form.getValues("items") || [];
    const total = formItems.reduce(
      (sum, item) => sum + (item.isBonus ? 0 : item.finalValue),
      0
    );

    setTotalValueState(total);
    setTotalValue(total); // Atualiza o valor total no contexto
  }, [form.watch("items"), setTotalValue]);

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
              <Icons.circlePlus className="size-4 mr-2" />
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
              {form.watch("items")?.map((formItem, index) => {
                const item = items?.find((i) => i.id === formItem.itemId);
                if (!item) return null;

                return (
                  <div
                    key={formItem.itemId}
                    className="grid grid-cols-2 sm:grid-cols-6 items-center gap-x-4 gap-y-2 py-2 border-b border-border"
                  >
                    <span className="col-span-1 sm:col-span-1 font-medium text-xs truncate">
                      {item.name}
                    </span>
                    <span className="hidden sm:block sm:col-span-1 font-medium text-xs">
                      {item.code ?? "N/A"}
                    </span>
                    <span className="col-span-1 sm:col-span-1 font-medium text-xs">
                      {formItem.quantity}
                    </span>
                    <div className="hidden sm:flex sm:col-span-1 justify-center">
                      <Checkbox
                        checked={formItem.isBonus}
                        onCheckedChange={(checked) => {
                          updateItemBonusStatus(index, !!checked);
                        }}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-1 relative flex rounded-md shadow-xs justify-center">
                      <CurrencyPercentInput
                        className="rounded shadow-none"
                        defaultMode={formItem.discount.mode}
                        defaultValue={formItem.discount.value}
                        onValueChange={(value, mode) => {
                          applyDiscount(
                            index,
                            value,
                            mode || formItem.discount.mode
                          );
                        }}
                        maxCurrencyValue={formItem.baseValue}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-1 relative flex rounded-md shadow-xs justify-end">
                      <div className="relative w-full">
                        <Input
                          className="peer ps-9"
                          placeholder="0,00"
                          value={(formItem.finalValue / formItem.quantity)
                            .toFixed(2)
                            .replace(".", ",")}
                          onChange={(e) => {
                            handleCurrencyInputChange(e, (value) => {
                              updateItemBaseValue(index, value);
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
          <CardHeader className="flex items-center flex-row w-full justify-between">
            <CardTitle>Método de Pagamento</CardTitle>
            <div className="flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={addPaymentMethod}
                className="w-full sm:w-auto"
                type="button"
              >
                <Icons.circlePlus className="size-4 mr-2" />
                Adicionar método de pagamento
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-6">
            {form.watch("paymentMethod")?.map((_, index) => (
              <div key={index} className="relative">
                <div className="absolute -top-3 -right-3 z-10">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => removePaymentMethod(index)}
                    disabled={form.watch("paymentMethod").length === 1}
                  >
                    <Icons.x className="size-3" strokeWidth={3} />
                    <span className="sr-only">Remover método de pagamento</span>
                  </Button>
                </div>

                <div
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-md",
                    form.watch(`paymentMethod.${index}.method`) ===
                      "CREDIT_CARD" && "md:grid-cols-[1fr_1fr_1fr_0.4fr_0.4fr]"
                  )}
                >
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
                              value={field.value.toFixed(2).replace(".", ",")}
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
                                value.month > 9
                                  ? value.month
                                  : `0${value.month}`;
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

                  {form.watch("paymentMethod")[index].method ===
                    "CREDIT_CARD" && (
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
                  )}

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
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary Total Card */}
      <Card className="h-min lg:min-h-96 w-full lg:w-auto">
        <CardHeader>
          <CardTitle>
            Total: {formatToCurrency(totalValueState.toString())}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Resumo dos Pagamentos</h3>
              {form.watch("paymentMethod")?.length > 0 ? (
                <div className="space-y-2">
                  {form.watch("paymentMethod").map((method, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {paymentMethods.find((m) => m.id === method.method)
                          ?.name || "Método não selecionado"}
                      </span>
                      <span>{formatToCurrency(method.value.toString())}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span className="text-sm">Total dos Pagamentos:</span>
                    <span>
                      {formatToCurrency(
                        form
                          .watch("paymentMethod")
                          .reduce((sum, method) => sum + (method.value || 0), 0)
                          .toString()
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum método de pagamento adicionado.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
