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
import type { GetOrganizationResponse } from "@/http/organizations/types";
import useChangeOrgNameForm from "./use-change-org-name-form";

type ChangeOrgNameFormProps = {
  organization: GetOrganizationResponse;
};

export default function ChangeOrgNameForm({
  organization,
}: ChangeOrgNameFormProps) {
  const { form, onSubmit, isPending } = useChangeOrgNameForm({ organization });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Nome da organização</CardTitle>
            <CardDescription>Esse é o nome da sua organização</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome da organização"
                      className="max-w-96"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="bg-gray-50 flex items-center p-4 justify-between w-full rounded-b-xl">
            <p className="text-sm text-muted-foreground pl-2">
              Máximo de 42 caracteres.
            </p>
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
