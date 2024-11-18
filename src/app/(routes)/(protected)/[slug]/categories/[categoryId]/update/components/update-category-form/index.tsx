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
import useUpdateCategoryForm from "./use-update-category-form";
import { Icons } from "@/components/icons";

type UpdateCategoryFormProps = {
  categoryName: string;
};

export default function UpdateCategoryForm( { categoryName }: UpdateCategoryFormProps) {
  const { form, onSubmit } = useUpdateCategoryForm();

  form.setValue("name", categoryName);

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
          Editar
        </Button>
      </form>
    </Form>
  );
}