"use client";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { DubButton } from "@/components/ui/dub-button";
import { InfoTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import slugify from "slugify";
import useCreateOrganizationForm from "./use-create-organization-form";

type CreateOrganizationFormProps = {
  className?: string;
};

export function CreateOrganizationForm({
  className,
}: CreateOrganizationFormProps) {
  const { form, onSubmit, isPending } = useCreateOrganizationForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col space-y-6 text-left", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <p className="block text-sm font-medium text-gray-700">
                  Nome *
                </p>
              </FormLabel>
              <FormControl>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <Input
                    placeholder="Nome da Organização"
                    className="text-gray-900 placeholder-gray-400 sm:text-sm"
                    {...field}
                    onChange={(e) => {
                      form.setValue(
                        "slug",
                        slugify(e.target.value, { lower: true })
                      );
                      form.setValue("name", e.target.value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <p className="block text-sm font-medium text-gray-700">
                  Slug da organização
                </p>
                <InfoTooltip
                  content={`Este é o identificador único da sua organização. Ele será usado para acessar a organização em Alugg.app.`}
                />
              </FormLabel>
              <FormControl>
                <div className="relative mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-5 text-gray-500 sm:text-sm">
                    alugg.vercel.app
                  </span>
                  <Input
                    id="slug"
                    autoComplete="off"
                    type="text"
                    className={`${
                      form.formState.errors.slug
                        ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500"
                    } block w-full rounded-r-md focus:outline-none sm:text-sm rounded-l-none`}
                    placeholder="Slug"
                    {...field}
                    onBlur={() => {
                      fetch(
                        `/api/organizations/${form.getValues("slug")}/exists`
                      ).then(async (res) => {
                        const value = await res.json();
                        if (value.hasOrganization) {
                          form.setError("slug", {
                            message: `O slug "${form.getValues(
                              "slug"
                            )}" já está em uso.`,
                          });
                        } else form.clearErrors("slug");
                      });
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano</FormLabel>
              <FormControl>
                <Input placeholder="Gratuíto - R$0/mês" readOnly {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DubButton
          type="submit"
          disabled={isPending}
          loading={isPending}
          text="Criar Organização"
        />
      </form>
    </Form>
  );
}