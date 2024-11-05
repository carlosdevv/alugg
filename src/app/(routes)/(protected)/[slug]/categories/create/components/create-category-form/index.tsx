"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCreateCategoryForm from "./use-create-category-form";
import { Icons } from "@/components/icons";

export default function CreateCategoryForm() {
  const { form, onSubmit } = useCreateCategoryForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Nome da Categoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-min" type="submit">
          <Icons.circlePlus className="size-4 mr-2" />
          Adicionar
        </Button>
      </form>
    </Form>
  );
}