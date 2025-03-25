"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InputPhone from "@/components/ui/custom/phone-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseToNumber } from "@/lib/utils";
import { DateField, DateInput, DateSegment } from "react-aria-components";
import useCreateCustomerForm from "./use-create-customer-form";

export default function CreateCustomerForm() {
  const {
    form,
    onSubmit,
    isCreatingCustomer,
    showAddressFields,
    isLoadingAddress,
    handleSearchAddress,
  } = useCreateCustomerForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes</CardTitle>
                <CardDescription>
                  Informações básicas sobre o cliente.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <div className="flex w-full gap-x-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do Cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>CPF / CNPJ *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Cpf ou Cnpj"
                            {...field}
                            onChange={(value) => {
                              const formattedValue = parseToNumber(
                                value.currentTarget.value
                              );

                              if (formattedValue.length > 14) {
                                return;
                              }
                              field.onChange(formattedValue.toString());
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-6">
                  <FormField
                    control={form.control}
                    name="secondDocument"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>RG</FormLabel>
                        <FormControl>
                          <Input placeholder="RG" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                          <InputPhone
                            placeholder="+55 (00) 00000-0000"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-x-6">
                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-3 w-full">
                        <FormLabel className="pt-2">
                          Data de Nascimento
                        </FormLabel>
                        <FormControl>
                          <DateField
                            onChange={(value) => {
                              if (!value) return;
                              const formattedValue = `${value.day}/${value.month}/${value.year}`;
                              field.onChange(formattedValue);
                            }}
                          >
                            <DateInput className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                              {(segment) => (
                                <DateSegment
                                  segment={segment}
                                  className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
                                />
                              )}
                            </DateInput>
                          </DateField>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mediaContact"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-3 w-full">
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Instagram"
                              className="peer ps-9"
                              {...field}
                            />
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                              <Icons.atSign className="size-4" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="additionalInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informações adicionais</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoadingAddress}
                          placeholder="ex: 00000-000"
                          {...field}
                          onChange={async (value) => {
                            const zipcode = value.currentTarget.value;
                            const formatted = parseToNumber(zipcode);
                            form.setValue("zipcode", formatted.toString());
                            if (
                              formatted &&
                              formatted.toString().length === 8
                            ) {
                              await handleSearchAddress(zipcode);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Informe o CEP para preencher o endereço automaticamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {showAddressFields && (
                  <>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full gap-x-4 flex items-center">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="Estado" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Button
          type="submit"
          className="w-min mt-8"
          disabled={isCreatingCustomer}
        >
          {isCreatingCustomer ? (
            <Icons.loader className="animate-spin size-4 mr-2" />
          ) : (
            <Icons.circlePlus className="size-4 mr-2" />
          )}
          Adicionar Cliente
        </Button>
      </form>
    </Form>
  );
}
