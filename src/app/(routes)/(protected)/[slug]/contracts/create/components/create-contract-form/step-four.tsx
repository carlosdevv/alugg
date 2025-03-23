import { ContractInvoicePDFViewer } from "@/components/contract-pdf/invoice/contract-invoice-pdf-viewer";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
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
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function StepFour() {
  const { slug } = useParams() as { slug: string };
  const {
    form,
    generateContractPDF,
    isCreatingContract,
    isUploadingPdf,
    setCurrentStep,
  } = useCreateContractContext();
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const { data: members, isLoading } = useGetMembersService({ slug });

  const handleOpenPdfViewer = async () => {
    // Se o PDF ainda não foi gerado, gere-o agora
    if (!pdfBlob) {
      try {
        const blob = await generateContractPDF();
        setPdfBlob(blob);
      } catch (error) {
        console.error("Erro ao gerar o PDF do contrato:", error);
      }
    }

    setIsPdfOpen(true);
  };

  // Gerar o PDF quando o componente for montado
  useEffect(() => {
    async function loadPdf() {
      try {
        const blob = await generateContractPDF();
        setPdfBlob(blob);
      } catch (error) {
        console.error("Erro ao gerar o PDF do contrato:", error);
      }
    }

    loadPdf();
  }, [generateContractPDF]);

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
          <Button
            type="button"
            onClick={handleOpenPdfViewer}
            disabled={
              !form.getValues().memberId || isCreatingContract || isUploadingPdf
            }
          >
            Visualizar Contrato
          </Button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-x-4">
        <Button
          type="button"
          variant="outline"
          className="w-min"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={isCreatingContract || isUploadingPdf}
        >
          Voltar
        </Button>
        <Button
          type="submit"
          variant="outline"
          className="w-min"
          disabled={
            isCreatingContract ||
            isUploadingPdf ||
            !form.getValues().memberId ||
            (Array.isArray(form.getValues().paymentMethod) &&
              form.getValues().paymentMethod.length === 0)
          }
        >
          Finalizar
          {isCreatingContract || isUploadingPdf ? (
            <Icons.loader className="ml-2 size-4 animate-spin" />
          ) : (
            <Icons.check className="ml-2 size-4" />
          )}
        </Button>
      </div>

      {/* PDF Viewer */}
      <ContractInvoicePDFViewer
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
      />
    </div>
  );
}
