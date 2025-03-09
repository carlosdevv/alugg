import { ContractPDFViewer } from "@/components/contract-pdf/contract-pdf-viewer";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/custom/calendar-rac";
import { DateInput } from "@/components/ui/custom/date-rac";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateContractContext } from "@/contexts/create-contract-context";
import { useGetMembersService } from "@/http/members/use-members-service";
import { parseDate } from "@internationalized/date";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Button as AriaButton,
  Popover as AriaPopover,
  DatePicker,
  Dialog,
  Group,
} from "react-aria-components";

export function StepFour() {
  const { slug } = useParams() as { slug: string };
  const { form } = useCreateContractContext();
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  const { data: members, isLoading } = useGetMembersService({ slug });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-x-4">
          <FormField
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-52">
                <FormLabel className="text-xs truncate">Membro</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={isLoading}>
                      <SelectValue
                        placeholder={
                          isLoading ? "Carregando..." : "Selecione um membro"
                        }
                        className="placeholder:text-xs"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!members && !isLoading && (
                      <SelectItem disabled value="">
                        Membros não encontrados
                      </SelectItem>
                    )}
                    {members &&
                      members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractDate"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2 w-52">
                <FormLabel className="text-xs">Data de Pagamento</FormLabel>
                <FormControl>
                  <DatePicker
                    className="space-y-2"
                    onChange={(value) => {
                      if (!value) return;
                      const day = value.day > 9 ? value.day : `0${value.day}`;
                      const month =
                        value.month > 9 ? value.month : `0${value.month}`;
                      const formattedDate = `${day}/${month}/${value.year}`;
                      field.onChange(formattedDate);
                    }}
                    defaultValue={
                      field.value
                        ? parseDate(field.value.split("/").reverse().join("-"))
                        : parseDate(new Date().toISOString().split("T")[0]) // Data atual como padrão
                    }
                  >
                    <div className="flex">
                      <Group className="w-full">
                        <DateInput className="pe-9 text-xs" />
                      </Group>
                      <AriaButton
                        type="button"
                        className="z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70"
                      >
                        <Icons.calendar className="size-4" strokeWidth={2} />
                      </AriaButton>
                    </div>
                    <AriaPopover
                      className="z-50 rounded-lg border border-border bg-background text-popover-foreground shadow-lg shadow-black/5 outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
                      offset={4}
                    >
                      <Dialog className="max-h-[inherit] overflow-auto p-2">
                        <Calendar />
                      </Dialog>
                    </AriaPopover>
                  </DatePicker>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="additionalInformation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informações Adicionais</FormLabel>
              <FormControl>
                <Textarea placeholder="Informações adicionais" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-x-4">
          <Button type="button" onClick={() => setIsPdfOpen(true)}>
            Visualizar Contrato
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <ContractPDFViewer
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
      />
    </div>
  );
}
