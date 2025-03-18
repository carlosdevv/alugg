"use client";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { AddItemsDialog } from "@/components/modals/add-items-dialog";
import { Calendar } from "@/components/ui/custom/calendar-rac";
import { DateInput } from "@/components/ui/custom/date-rac";
import {
  Form,
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
import { Textarea } from "@/components/ui/textarea";
import type { ContractProps } from "@/http/contracts/types";
import { cn, formatToCurrency } from "@/lib/utils";
import { CalendarDate, parseDate } from "@internationalized/date";
import { PaymentMethod } from "@prisma/client";
import { compareDesc } from "date-fns";
import {
  Button as AriaButton,
  Popover as AriaPopover,
  DatePicker,
  Dialog,
  Group,
} from "react-aria-components";
import useUpdateContractForm from "./use-update-contract-form";

type UpdateContractFormProps = {
  contract: ContractProps;
};

const paymentMethodLabels = {
  [PaymentMethod.CREDIT_CARD]: "Cartão de Crédito",
  [PaymentMethod.DEBIT_CARD]: "Cartão de Débito",
  [PaymentMethod.PIX]: "PIX",
  [PaymentMethod.BANK_TRANSFER]: "Transferência Bancária",
  [PaymentMethod.VOUCHER]: "Voucher",
  [PaymentMethod.CASH]: "Dinheiro",
  [PaymentMethod.OTHER]: "Outro",
};

export default function UpdateContractForm({
  contract,
}: UpdateContractFormProps) {
  const {
    form,
    onSubmit,
    isUpdatingContract,
    isGeneratingDocument,
    addPayment,
    removePayment,
    calculateTotalPaid,
    calculatePendingDebt,
    statusFormattedText,
    statusColorVariant,
    handleCurrencyInputChange,
    paymentToRemove,
    setPaymentToRemove,
    confirmRemovePayment,
    addNewItems,
    removeItem,
    updateItemValue,
    updateTotalValue,
    availableItems,
  } = useUpdateContractForm({ contract });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_350px] lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Contrato</CardTitle>
                  <CardDescription>
                    Informações básicas sobre o contrato.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3 w-full">
                          <FormLabel
                            aria-label="Data do Evento"
                            className="pt-2"
                          >
                            Data do Evento
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              className="space-y-2"
                              onChange={(value) => {
                                form.clearErrors("eventDate");
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
                                  : null
                              }
                            >
                              <div className="flex">
                                <Group className="w-full">
                                  <DateInput className="pe-9" />
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
                      name="withdrawalDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3 w-full">
                          <FormLabel
                            aria-label="Data da Retirada"
                            className="pt-2"
                          >
                            Data da Retirada
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              className="space-y-2"
                              onChange={(value) => {
                                form.clearErrors("withdrawalDate");
                                if (!value) return;
                                const day =
                                  value.day > 9 ? value.day : `0${value.day}`;
                                const month =
                                  value.month > 9
                                    ? value.month
                                    : `0${value.month}`;
                                const formattedDate = `${day}/${month}/${value.year}`;
                                field.onChange(formattedDate);

                                if (
                                  form.watch("eventDate") &&
                                  compareDesc(
                                    new Date(
                                      value.year,
                                      value.month - 1,
                                      value.day
                                    ),
                                    new Date(
                                      parseInt(
                                        form.watch("eventDate").split("/")[2]
                                      ),
                                      parseInt(
                                        form.watch("eventDate").split("/")[1]
                                      ) - 1,
                                      parseInt(
                                        form.watch("eventDate").split("/")[0]
                                      )
                                    )
                                  ) === -1
                                ) {
                                  form.setError("withdrawalDate", {
                                    type: "onChange",
                                    message:
                                      "Data de retirada deve ser antes da data do evento",
                                  });
                                }
                              }}
                              defaultValue={
                                field.value
                                  ? parseDate(
                                      field.value.split("/").reverse().join("-")
                                    )
                                  : null
                              }
                            >
                              <div className="flex">
                                <Group className="w-full">
                                  <DateInput className="pe-9" />
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
                      name="returnDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3 w-full">
                          <FormLabel
                            aria-label="Data da Devolução"
                            className="pt-2"
                          >
                            Data da Devolução
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              className="space-y-2"
                              onChange={(value) => {
                                form.clearErrors("returnDate");
                                if (!value) return;
                                const day =
                                  value.day > 9 ? value.day : `0${value.day}`;
                                const month =
                                  value.month > 9
                                    ? value.month
                                    : `0${value.month}`;
                                const formattedDate = `${day}/${month}/${value.year}`;
                                field.onChange(formattedDate);

                                if (
                                  form.watch("eventDate") &&
                                  compareDesc(
                                    new Date(
                                      value.year,
                                      value.month - 1,
                                      value.day
                                    ),
                                    new Date(
                                      parseInt(
                                        form.watch("eventDate").split("/")[2]
                                      ),
                                      parseInt(
                                        form.watch("eventDate").split("/")[1]
                                      ) - 1,
                                      parseInt(
                                        form.watch("eventDate").split("/")[0]
                                      )
                                    )
                                  ) === 1
                                ) {
                                  form.setError("returnDate", {
                                    type: "onChange",
                                    message:
                                      "Data de devolução deve ser depois da data do evento",
                                  });
                                }
                              }}
                              defaultValue={
                                field.value
                                  ? parseDate(
                                      field.value.split("/").reverse().join("-")
                                    )
                                  : null
                              }
                            >
                              <div className="flex">
                                <Group className="w-full">
                                  <DateInput className="pe-9" />
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
                  </div>

                  <Separator />
                  {/* Details */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Código do Contrato
                      </span>
                      <Input
                        type="text"
                        value={
                          contract.code > 9
                            ? contract.code
                            : `0${contract.code}`
                        }
                        className="font-medium h-8 w-32"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Cliente
                      </span>
                      <Input
                        type="text"
                        value={contract.customer?.name.toUpperCase()}
                        className="font-medium h-8"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Status
                      </span>
                      <Badge
                        variant={statusColorVariant()}
                        className="font-medium"
                      >
                        {statusFormattedText()}
                      </Badge>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInformation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informações Adicionais</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informações adicionais sobre o contrato"
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Itens Alugados</CardTitle>
                  <CardDescription>
                    Itens incluídos neste contrato.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Item
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Quantidade
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Valor Unitário
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Desconto
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Valor Final
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {contract.rentedItems.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">
                                {item.item.name}
                              </td>
                              <td className="p-4 align-middle">
                                {item.quantity}
                              </td>
                              <td className="p-4 align-middle">
                                {formatToCurrency(item.item.price)}
                              </td>
                              <td className="p-4 align-middle">
                                {formatToCurrency(item.discount || 0)}
                              </td>
                              <td className="p-4 align-middle">
                                {formatToCurrency(item.finalValue)}
                              </td>
                              <td className="p-4 align-middle">
                                {/* Sem ações para itens originais */}
                              </td>
                            </tr>
                          ))}

                          {form
                            .watch("items")
                            ?.filter((item) => !item.id)
                            .map((item, index) => {
                              const itemDetails = availableItems.find(
                                (i) => i.id === item.itemId
                              );
                              if (!itemDetails) return null;

                              // Encontrar o índice real no array completo de itens
                              const realIndex =
                                form
                                  .watch("items")
                                  ?.findIndex((i) => i === item) || 0;

                              const basePrice = itemDetails.rentPrice;
                              const totalPrice = basePrice * item.quantity;

                              return (
                                <tr
                                  key={`new-${index}`}
                                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                  <td className="p-4 align-middle">
                                    {itemDetails.name}
                                  </td>
                                  <td className="p-4 align-middle">
                                    {item.quantity}
                                  </td>
                                  <td className="p-4 align-middle">
                                    {formatToCurrency(basePrice)}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <CurrencyPercentInput
                                      value={item.discount || 0}
                                      maxCurrencyValue={totalPrice}
                                      onValueChange={(value, mode) => {
                                        const basePrice = itemDetails.rentPrice;
                                        const totalPrice =
                                          basePrice * item.quantity;
                                        
                                        let finalValue: number;
                                        let limitedPercent = 0;
                                        let limitedDiscount = 0;
                                        
                                        if (mode === "percent") {
                                          limitedPercent = Math.min(value, 100);
                                          finalValue = Math.max(0, totalPrice - (totalPrice * limitedPercent / 100));
                                        } else {
                                          limitedDiscount = Math.min(value, totalPrice);
                                          finalValue = Math.max(0, totalPrice - limitedDiscount);
                                        }
                                        
                                        updateItemValue(
                                          realIndex,
                                          mode === "percent" ? limitedPercent : limitedDiscount,
                                          finalValue,
                                          mode
                                        );
                                        updateTotalValue();
                                      }}
                                    />
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="relative w-full max-w-24">
                                      <Input
                                        className="peer ps-9"
                                        placeholder="0,00"
                                        value={item.finalValue
                                          .toFixed(2)
                                          .replace(".", ",")}
                                        onChange={(e) => {
                                          handleCurrencyInputChange(e, (value) => {
                                            const basePrice =
                                              itemDetails.rentPrice;
                                            const totalPrice =
                                              basePrice * item.quantity;
                                            
                                            // Remover a limitação do valor final
                                            const finalValue = value;
                                            
                                            // Não recalcular o desconto, apenas atualizar o valor final
                                            const items =
                                              form.getValues("items") || [];
                                            const currentItem =
                                              items[realIndex];
                                            const mode =
                                              currentItem?.discountMode ||
                                              "currency";
                                            
                                            // Manter o desconto atual, apenas atualizar o valor final
                                            updateItemValue(
                                              realIndex,
                                              currentItem.discount, // Manter o desconto atual
                                              finalValue,
                                              mode
                                            );
                                            
                                            updateTotalValue();
                                          });
                                        }}
                                      />
                                      <div className="text-muted-foreground/80 text-xs pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                        R$
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        removeItem(realIndex);
                                        updateTotalValue();
                                      }}
                                      className="text-rose-500 hover:text-rose-700"
                                    >
                                      <Icons.delete className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>

                    <AddItemsDialog
                      eventDate={form.watch("eventDate")}
                      withdrawalDate={form.watch("withdrawalDate")}
                      returnDate={form.watch("returnDate")}
                      onItemsSelected={(items) => {
                        addNewItems(items);
                        updateTotalValue();
                      }}
                      existingItemIds={
                        form.watch("items")?.map((item) => item.itemId) || []
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isUpdatingContract || isGeneratingDocument}
                className="w-min"
              >
                {(isUpdatingContract || isGeneratingDocument) && (
                  <Icons.loader className="mr-2 size-4 animate-spin" />
                )}
                Atualizar Contrato
              </Button>
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pagamentos</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPayment}
                    >
                      <Icons.circlePlus className="mr-2 size-4" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                  {form.watch("payments").map((_, index) => (
                    <div
                      key={index}
                      className="space-y-4 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Pagamento {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmRemovePayment(index)}
                        >
                          <Icons.delete className="size-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`payments.${index}.method`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Método de Pagamento</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um método de pagamento" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(paymentMethodLabels).map(
                                    ([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`payments.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Valor</FormLabel>
                              <FormControl>
                                <div className="relative w-full">
                                  <Input
                                    className="peer ps-9"
                                    placeholder="0,00"
                                    value={field.value
                                      .toFixed(2)
                                      .replace(".", ",")}
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
                        {form.watch(`payments.${index}.method`) ===
                          PaymentMethod.CREDIT_CARD && (
                          <FormField
                            control={form.control}
                            name={`payments.${index}.creditParcelAmount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Parcelas</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    {...field}
                                    onChange={(e) => {
                                      const value = Math.max(
                                        1,
                                        parseInt(e.target.value)
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
                          name={`payments.${index}.paymentDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col space-y-3 w-full">
                              <FormLabel
                                aria-label="Data de Pagamento"
                                className="pt-2"
                              >
                                Data de Pagamento
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  className="space-y-2"
                                  onChange={(value: CalendarDate | null) => {
                                    if (!value) return;
                                    const day =
                                      value.day > 9
                                        ? value.day
                                        : `0${value.day}`;
                                    const month =
                                      value.month > 9
                                        ? value.month
                                        : `0${value.month}`;
                                    const formattedDate = `${value.year}-${month}-${day}`;
                                    field.onChange(formattedDate);
                                  }}
                                  defaultValue={
                                    field.value ? parseDate(field.value) : null
                                  }
                                >
                                  <div className="flex">
                                    <Group className="w-full">
                                      <DateInput className="pe-9" />
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
                          name={`payments.${index}.isPaid`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Pagamento Realizado</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="rounded-md border p-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Pago:</span>
                      <span className="font-semibold">
                        {formatToCurrency(calculateTotalPaid())}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="font-medium">Valor Pendente:</span>
                      <span
                        className={cn(
                          "font-semibold",
                          calculatePendingDebt() > 0
                            ? "text-rose-600 dark:text-rose-500"
                            : "text-emerald-600 dark:text-emerald-500"
                        )}
                      >
                        {formatToCurrency(calculatePendingDebt())}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      {/* Dialog de confirmação para remover pagamento */}
      <AlertDialog
        open={paymentToRemove !== null}
        onOpenChange={() => setPaymentToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este pagamento? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-500 text-white hover:bg-rose-600"
              onClick={() => {
                if (paymentToRemove !== null) {
                  removePayment(paymentToRemove);
                  setPaymentToRemove(null);
                }
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
