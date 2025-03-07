import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/custom/calendar-rac";
import { DateInput } from "@/components/ui/custom/date-rac";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateContractContext } from "@/contexts/create-contract-context";
import { useGetCustomersService } from "@/http/customers/use-customers-service";
import { appRoutes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { parseDate } from "@internationalized/date";
import { compareDesc } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Button as AriaButton,
  Popover as AriaPopover,
  DatePicker,
  Dialog,
  Group,
} from "react-aria-components";

export function StepOne() {
  const { slug } = useParams() as { slug: string };
  const { form } = useCreateContractContext();

  const [openCustomerSelect, setOpenCustomerSelect] = useState<boolean>(false);

  const { data: customers, isLoading } = useGetCustomersService({ slug });

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informe as datas do contrato:</CardTitle>
          <CardDescription>
            Informe as datas do contrato para que o sistema possa calcular as
            datas de retirada, devolução e retorno do item.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3 w-full">
                  <FormLabel aria-label="Data do Evento" className="pt-2">
                    Data do Evento
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      className="space-y-2"
                      onChange={(value) => {
                        form.clearErrors("eventDate");
                        if (!value) return;
                        const day = value.day > 9 ? value.day : `0${value.day}`;
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
                          <Icons.calendar className="size-4" strokeWidth={2} />
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
                  <FormLabel aria-label="Data da Retirada" className="pt-2">
                    Data da Retirada
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      className="space-y-2"
                      onChange={(value) => {
                        form.clearErrors("withdrawalDate");
                        if (!value) return;
                        const day = value.day > 9 ? value.day : `0${value.day}`;
                        const month =
                          value.month > 9 ? value.month : `0${value.month}`;
                        const formattedDate = `${day}/${month}/${value.year}`;
                        field.onChange(formattedDate);

                        if (
                          form.watch("eventDate") &&
                          compareDesc(
                            new Date(value.year, value.month - 1, value.day),
                            new Date(
                              parseInt(form.watch("eventDate").split("/")[2]),
                              parseInt(form.watch("eventDate").split("/")[1]) -
                                1,
                              parseInt(form.watch("eventDate").split("/")[0])
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
                          <Icons.calendar className="size-4" strokeWidth={2} />
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
                  <FormLabel aria-label="Data da Devolução" className="pt-2">
                    Data da Devolução
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      className="space-y-2"
                      onChange={(value) => {
                        form.clearErrors("returnDate");
                        if (!value) return;
                        const day = value.day > 9 ? value.day : `0${value.day}`;
                        const month =
                          value.month > 9 ? value.month : `0${value.month}`;
                        const formattedDate = `${day}/${month}/${value.year}`;
                        field.onChange(formattedDate);

                        if (
                          form.watch("eventDate") &&
                          compareDesc(
                            new Date(value.year, value.month - 1, value.day),
                            new Date(
                              parseInt(form.watch("eventDate").split("/")[2]),
                              parseInt(form.watch("eventDate").split("/")[1]) -
                                1,
                              parseInt(form.watch("eventDate").split("/")[0])
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
                          <Icons.calendar className="size-4" strokeWidth={2} />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informe o cliente:</CardTitle>
          <CardDescription>
            Informe o cliente para esse contrato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel aria-label="Cliente">Cliente</FormLabel>
                <Popover
                  open={openCustomerSelect}
                  onOpenChange={(open) => {
                    if (isLoading) return;
                    setOpenCustomerSelect(open);
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={isLoading}
                      aria-expanded={openCustomerSelect}
                      className="w-full max-w-64 justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
                    >
                      <span
                        className={cn(
                          "truncate",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <Icons.loader className="animate-spin size-4" />
                            <span className="text-sm">Carrengado...</span>
                          </div>
                        ) : (
                          customers?.data.find((c) => c.id === field.value)
                            ?.name ?? "Selecione Cliente"
                        )}
                      </span>
                      <Icons.chevronsUpDown
                        className="size-4 shrink-0 text-muted-foreground/80"
                        aria-hidden="true"
                        strokeWidth={2}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Procurar pelo nome" />
                      <CommandList>
                        <CommandEmpty>Cliente não encontrado.</CommandEmpty>
                        <CommandGroup>
                          {customers &&
                            customers.data.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={customer.name}
                                onSelect={(currentValue) => {
                                  const customerId = customers.data.find(
                                    (c) => c.name === currentValue
                                  )?.id;
                                  field.onChange(customerId);
                                  setOpenCustomerSelect(false);
                                }}
                              >
                                {customer.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-normal"
                            asChild
                          >
                            <Link
                              href={`/${slug}/${appRoutes.customers.create}`}
                            >
                              <Icons.circlePlus
                                strokeWidth={2}
                                className="-ms-2 size-4 me-2 opacity-60"
                                aria-hidden="true"
                              />
                              Adicionar Cliente
                            </Link>
                          </Button>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
