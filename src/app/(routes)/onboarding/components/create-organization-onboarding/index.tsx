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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appRoutes } from "@/lib/constants";
import Link from "next/link";
import slugify from "slugify";
import useCreateOrganizationOnboarding from "./use-create-organization-onboarding";

export default function CreateOrganizationOnboarding() {
  const { form, onSubmit, isPending } = useCreateOrganizationOnboarding();

  return (
    <section className="min-h-screen w-full px-4 py-6 md:py-10">
      <div className="slide-in relative mx-auto max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="transition-opacity duration-300 rounded-md border shadow-sm overflow-hidden">
              <div className="border-b flex flex-col px-4 py-4 md:px-6">
                <h4 className="font-medium">Criar nova organização</h4>
                <p className="text-sm text-muted-foreground">
                  A organização representa sua empresa no Alugg
                </p>
              </div>

              <div className="flex flex-col gap-y-4 md:gap-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="px-4 pt-4 md:px-6 md:grid md:grid-cols-[8rem_1fr] w-full justify-between">
                      <FormLabel className="text-sm break-all text-muted-foreground block mb-2 md:mb-0">
                        Nome
                      </FormLabel>
                      <div>
                        <FormControl>
                          <Input
                            placeholder="Nome da organização"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              form.setValue("name", e.target.value);
                              form.setValue(
                                "slug",
                                slugify(e.target.value, { lower: true })
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription className="mt-1.5 ml-0 md:ml-2 text-xs md:text-sm">
                          Insira o nome da sua empresa
                        </FormDescription>
                      </div>
                      <FormMessage className="mt-1 md:col-start-2 md:col-end-3" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="px-4 md:px-6 md:grid md:grid-cols-[8rem_1fr] w-full justify-between">
                      <FormLabel className="text-sm break-all text-muted-foreground block mb-2 md:mb-0">
                        Slug
                      </FormLabel>
                      <div>
                        <FormControl>
                          <div className="flex items-center gap-x-3">
                            <Input
                              placeholder="Slug da organização"
                              className="w-full md:max-w-96"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                form.setValue(
                                  "slug",
                                  slugify(e.target.value, { lower: true })
                                );
                                field.onBlur();
                              }}
                              onBlur={() => {
                                fetch(
                                  `/api/organizations/${form.getValues(
                                    "slug"
                                  )}/exists`
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
                      </div>
                      <FormMessage className="mt-1 md:col-start-2 md:col-end-3" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem className="px-4 pb-4 md:px-6 md:grid md:grid-cols-[8rem_1fr] w-full justify-between">
                      <FormLabel className="text-sm break-all text-muted-foreground block mb-2 md:mb-0">
                        Planos
                      </FormLabel>
                      <div className="flex items-center gap-x-4">
                        <FormControl>
                          <Select
                            defaultValue="free"
                            onValueChange={field.onChange}
                            value={field.value || "free"}
                          >
                            <SelectTrigger className="w-full text-left">
                              <SelectValue>
                                {field.value === "free"
                                  ? "Plano Gratuito"
                                  : "Plano Pro"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free" className="py-2">
                                <div>
                                  <div>Plano Gratuito</div>
                                  <p className="text-muted-foreground mt-1 text-xs font-normal">
                                    Explore todas as funcionalidades sem
                                    compromisso.
                                  </p>
                                </div>
                              </SelectItem>
                              <SelectItem value="pro" className="py-2">
                                <div>
                                  <div>Plano Pro</div>
                                  <p className="text-muted-foreground mt-1 text-xs font-normal">
                                    Tudo o que você precisa, sem limites.
                                  </p>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="flex">
                          <Button type="button" asChild className="w-fit">
                            <Link href={appRoutes.plans}>
                              Visualizar planos
                            </Link>
                          </Button>
                        </div>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="border-t">
                  <div className="flex h-14 items-center px-4 md:px-6">
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
