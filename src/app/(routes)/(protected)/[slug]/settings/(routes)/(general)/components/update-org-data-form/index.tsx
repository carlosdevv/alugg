"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputPhone from "@/components/ui/inputs/phone-input";
import type { GetOrganizationResponse } from "@/http/organizations/types";
import { parseToCnpj, parseToNumber } from "@/lib/utils";
import useUpdateOrgDataForm from "./use-update-org-data-form";

type UpdateOrgDataFormProps = {
  organization: GetOrganizationResponse;
};

export default function UpdateOrgDataForm({
  organization,
}: UpdateOrgDataFormProps) {
  const { form, onSubmit, isPending, isLoadingAddress, handleSearchAddress } =
    useUpdateOrgDataForm({ organization });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da organização</CardTitle>
            <CardDescription>
              Essas são as informações básicas da sua organização.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Organização</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da organização" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Razão Social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fantasyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Fantasia</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Fantasia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00.000.000/0001-00"
                      {...field}
                      defaultValue={
                        field.value && field.value.length === 14
                          ? parseToCnpj(field.value)
                          : field.value
                      }
                      onChange={(resp) => {
                        const value = resp.currentTarget.value;
                        const formatted = parseToNumber(value);
                        field.onChange({
                          target: { value: formatted.toString() },
                        });
                      }}
                      onBlur={(resp) => {
                        const value = resp.currentTarget.value;
                        if (value.length === 14) {
                          const formatted = parseToCnpj(value);
                          form.setValue("cnpj", formatted);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <InputPhone
                      placeholder="+55 (00) 00000-0000"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingAddress}
                      placeholder="00000-000"
                      {...field}
                      onChange={async (value) => {
                        const zipcode = value.currentTarget.value;
                        const formatted = parseToNumber(zipcode);
                        form.setValue("zipcode", formatted.toString());
                        if (formatted && formatted.toString().length === 8) {
                          await handleSearchAddress(zipcode);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-zinc-900 flex items-center p-4 justify-end w-full rounded-b-xl">
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Icons.loader className="animate-spin size-4 mr-2" />
              )}
              Salvar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
