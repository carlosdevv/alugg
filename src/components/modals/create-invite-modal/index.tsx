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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import useCreateInviteModal from "./use-create-invite-modal";

type CreateInviteModalProps = {
  className?: string;
};

export default function CreateInviteModal({
  className,
}: CreateInviteModalProps) {
  const {
    showModal,
    setShowModal,
    onClose,
    form,
    onSubmit,
    roleSelected,
    setRoleSelected,
    isPending,
  } = useCreateInviteModal();

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} onClose={onClose}>
      <div className="flex flex-col items-center justify-center space-y-2 border-b dark:border-gray-800 border-gray-200 p-4 pt-8 sm:px-16">
        <h3 className="text-lg font-medium">Convidar Membros</h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-300">
          Convide membros com diferentes funções e permissões. Os convites serão
          válidos por 14 dias.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "flex flex-col space-y-6 text-left dark:bg-neutral-900 bg-gray-50 px-4 py-8 sm:px-16",
            className
          )}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <p className="block text-sm font-medium">Email</p>
                </FormLabel>
                <FormControl>
                  <div className="mt-2 relative flex rounded-md shadow-sm">
                    <Input
                      placeholder="jonh@acme.com"
                      autoComplete="off"
                      className="w-full z-10 bg-white rounded-l-md rounded-r-none dark:placeholder-gray-100 text-gray-900 sm:text-sm dark:border-zinc-700 dark:bg-neutral-900"
                      {...field}
                    />
                    <Select
                      onValueChange={(value) => setRoleSelected(value as Role)}
                      defaultValue={roleSelected}
                    >
                      <SelectTrigger className="w-1/2 rounded-l-none rounded-r-md border border-l-0 dark:border-zinc-700 dark:bg-neutral-900 bg-white text-gray-600 dark:text-gray-100 sm:text-sm focus:border-gray-300 focus:outline-none focus:ring-0">
                        <SelectValue placeholder="Cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                        <SelectItem value={Role.MEMBER}>Membro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DubButton
            type="submit"
            disabled={isPending}
            loading={isPending}
            text="Enviar Convite"
          />
        </form>
      </Form>
    </Modal>
  );
}
