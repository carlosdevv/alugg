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
import slugify from "slugify";
import useChangeOrgSlugForm from "./use-change-org-slug-form";

type ChangeOrgSlugFormProps = {
  organization: GetOrganizationResponse;
};

export default function ChangeOrgSlugForm({
  organization,
}: ChangeOrgSlugFormProps) {
  const { form, onSubmit, isPending, checkingSlug } = useChangeOrgSlugForm({
    organization,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Slug da organização</CardTitle>
            <CardDescription>Esse é o slug da sua organização</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="newSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-3">
                      <Input
                        placeholder="Slug da organização"
                        className="max-w-96 dark:border-zinc-700 dark:bg-neutral-900"
                        {...field}
                        onBlur={(e) => {
                          field.onChange(
                            slugify(e.target.value, { lower: true })
                          );
                          field.onBlur();
                        }}
                      />
                      {checkingSlug && (
                        <Icons.loader className="animate-spin size-4" />
                      )}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-zinc-900 flex items-center p-4 justify-between w-full rounded-b-xl space-x-4 mt-auto">
            <p className="text-sm text-muted-foreground pl-2">
              Apenas letras minúsculas, números e hífens são permitidos. Máximo
              de 48 caracteres.
            </p>
            <Button type="submit" disabled={checkingSlug || isPending}>
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
