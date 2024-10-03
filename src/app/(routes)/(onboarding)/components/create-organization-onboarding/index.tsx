"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
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
import useCreateOrganizationOnboarding from "./use-create-organization-onboarding";

export default function CreateOrganizationOnboarding() {
  const { form, onSubmit, isPending } = useCreateOrganizationOnboarding();

  return (
    <section className="h-screen w-screen bg-slate-50">
      <div className="slide-in relative mx-auto py-10 max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="transition-opacity duration-300 rounded-md border shadow-sm overflow-hidden bg-white">
              <div className="border-b flex flex-col px-6 py-4">
                <h4 className="font-medium">Criar nova organização</h4>
                <p className="text-sm text-muted-foreground">
                  A organização representa sua empresa no Allug
                </p>
              </div>

              <div className="flex flex-col gap-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="px-6 pt-4 grid grid-cols-[8rem_1fr] w-full justify-between">
                      <FormLabel className="text-sm break-all text-muted-foreground">
                        Nome
                      </FormLabel>
                      <div>
                        <FormControl>
                          <Input placeholder="Nome da organização" {...field} />
                        </FormControl>
                        <FormDescription className="mt-1.5 ml-2">
                          Insira o nome da sua empresa
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem className="px-6 pb-4 grid grid-cols-[8rem_1fr] w-full justify-between">
                      <FormLabel className="text-sm break-all text-muted-foreground">
                        Plano
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Gratuíto - R$0/mês"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t">
                  <div className="flex h-14 items-center px-6">
                    <div className="flex w-full items-center justify-between">
                      <div className="ml-auto flex items-center space-x-3">
                        <Button size="sm" disabled={isPending}>
                          {isPending && (
                            <Icons.loader className="animate-spin size-4 mr-2" />
                          )}
                          Criar organização
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
