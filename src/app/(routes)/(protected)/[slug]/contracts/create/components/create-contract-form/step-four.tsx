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
