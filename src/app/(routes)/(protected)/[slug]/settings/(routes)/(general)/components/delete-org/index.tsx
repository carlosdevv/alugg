"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { GetOrganizationResponse } from "@/http/organizations/types";
import { cn } from "@/lib/utils";
import useDeleteOrg from "./use-delete-org";

type ChangeOrgSlugFormProps = {
  organization: GetOrganizationResponse;
};

export default function DeleteOrg({ organization }: ChangeOrgSlugFormProps) {
  const { form, onSubmit, isPending, isOwner, showModal, setShowModal } =
    useDeleteOrg({
      organization,
    });

  return (
    <>
      <Card className="border-rose-500 dark:border-rose-800">
        <CardHeader>
          <CardTitle>Deletar organização</CardTitle>
          <CardDescription>
            Você irá deletar a organização e todos os seus dados. Essa ação não
            pode ser desfeita - Prossiga com cautela.
          </CardDescription>
        </CardHeader>
        <CardFooter className="bg-rose-50 dark:bg-zinc-950 flex border-t dark:border-rose-800 border-rose-500 items-center p-4 justify-end w-full rounded-b-xl">
          <Button variant="destructive" onClick={() => setShowModal(true)}>
            Deletar
          </Button>
        </CardFooter>
      </Card>

      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className="flex flex-col items-center justify-center space-y-2 border-b dark:border-gray-800 border-gray-200 px-4 py-4 pt-8 sm:px-16">
          <h3 className="text-lg font-medium">Deletar organização</h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-300">
            Cuidado: Isso irá deletar permanentemente sua organização, domínio,
            e todos os links associados e suas respectivas estatísticas.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 bg-gray-50 dark:bg-neutral-900 px-4 py-8 text-left sm:px-16"
          >
            <FormField
              control={form.control}
              name="organization_slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium">
                    Informe o slug da organização{" "}
                    <span className="font-semibold text-black dark:text-gray-400">
                      {organization.slug}
                    </span>{" "}
                    para continuar:
                  </FormLabel>
                  <FormControl>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        autoComplete="off"
                        pattern={organization.slug}
                        disabled={!isOwner}
                        className={cn(
                          "block w-full rounded-md text-gray-900 dark:border-zinc-700 dark:bg-neutral-900 dark:text-gray-100 placeholder-gray-400 sm:text-sm",
                          {
                            "cursor-not-allowed bg-gray-100": !isOwner,
                          }
                        )}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm">
                    Para verificar, digite{" "}
                    <span className="font-semibold text-black dark:text-gray-400">
                      deletar organização
                    </span>{" "}
                    no campo abaixo
                  </FormLabel>
                  <FormControl>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <Input
                        autoComplete="off"
                        pattern="deletar organização"
                        disabled={!isOwner}
                        className={cn(
                          "block w-full rounded-md dark:border-zinc-700 dark:bg-neutral-900 text-gray-900 placeholder-gray-400 sm:text-sm",
                          {
                            "cursor-not-allowed bg-gray-100": !isOwner,
                          }
                        )}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DubButton
              text="Deletar Organização"
              variant="danger"
              loading={isPending}
              {...(!isOwner && {
                disabledTooltip: "Apenas donos da organização podem deletá-la.",
              })}
            />
          </form>
        </Form>
      </Modal>
    </>
  );
}
