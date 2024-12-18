"use client";

import { DubButton } from "@/components/ui/dub-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { InfoTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import slugify from "slugify";
import useCreateOrganizationModal from "./use-create-organization-modal";

type CreateOrganizationModalProps = {
  className?: string;
};

export default function CreateOrganizationModal({
  className,
}: CreateOrganizationModalProps) {
  const { form, onSubmit, isPending, setShowModal, showModal, onClose } =
    useCreateOrganizationModal();

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} onClose={onClose}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b dark:border-gray-800 border-gray-200 p-4 pt-8 sm:px-16">
        <h3 className="text-lg font-medium">Criar nova organização</h3>
      </div>

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
                  <p className="text-sm font-medium">Nome *</p>
                </FormLabel>
                <FormControl>
                  <div className="mt-2 flex rounded-md shadow-sm">
                    <Input
                      placeholder="Nome da Organização"
                      className="text-gray-900 bg-white dark:placeholder-gray-200 placeholder-gray-400 dark:border-zinc-700 dark:bg-neutral-900 sm:text-sm"
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
                  <p className="text-sm">Slug da organização</p>
                  <InfoTooltip
                    content={`Este é o identificador único da sua organização. Ele será usado para acessar a organização em Alugg.app.`}
                  />
                </FormLabel>
                <FormControl>
                  <div className="relative mt-2 flex rounded-md shadow-sm">
                    <span className="inline-flex bg-gray-100 dark:border-zinc-700 dark:bg-neutral-900 dark:text-gray-100 items-center rounded-l-md border border-r-0 border-gray-300 px-5 text-gray-700 sm:text-sm">
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
                      } block w-full rounded-r-md focus:outline-none sm:text-sm rounded-l-none bg-white dark:placeholder-gray-200 dark:border-zinc-700 dark:bg-neutral-900`}
                      placeholder="Slug"
                      {...field}
                      onBlur={() => {
                        if (!form.getValues("slug")) return;

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
                  <Input
                    placeholder="Gratuíto - R$0/mês"
                    className="bg-white dark:placeholder-gray-200 dark:border-zinc-700 dark:bg-neutral-900"
                    readOnly
                    {...field}
                  />
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
    </Modal>
  );
}
