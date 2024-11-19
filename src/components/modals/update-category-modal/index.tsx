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
import { cn } from "@/lib/utils";
import useUpdateCategoryModal from "./use-update-category-modal";

type UpdateCategoryModalProps = {
  className?: string;
};

export default function UpdateCategoryModal({
  className,
}: UpdateCategoryModalProps) {
  const {
    showModal,
    setShowModal,
    onClose,
    form,
    onSubmit,
    isPending,
    isLoading,
  } = useUpdateCategoryModal();

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} onClose={onClose}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 p-4 pt-8 sm:px-16">
        <h3 className="text-lg font-medium">Atualizar Categoria</h3>
        <p className="text-center text-sm text-gray-500">
          Atualize sua nova categoria e organize os items do seu estoque.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "flex flex-col space-y-6 text-left bg-gray-50 px-4 py-8 sm:px-16",
            className
          )}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <p className="block text-sm font-medium text-gray-700">
                    Nome
                  </p>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      isLoading ? "Carregando..." : "Nome da categoria"
                    }
                    className="bg-white"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DubButton
            type="submit"
            disabled={isPending || isLoading}
            loading={isPending}
            text="Atualizar Categoria"
          />
        </form>
      </Form>
    </Modal>
  );
}