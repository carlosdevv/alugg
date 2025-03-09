import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateContractContext } from "@/contexts/create-contract-context";
import { useGetCustomerByIdService } from "@/http/customers/use-customers-service";
import { useGetItemsService } from "@/http/items/use-items-service";
import { useGetMemberByIdService } from "@/http/members/use-members-service";
import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ContractPDF } from "./contract-pdf";

interface ContractPDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContractPDFViewer({ isOpen, onClose }: ContractPDFViewerProps) {
  const { slug } = useParams() as { slug: string };
  const { form, selectedItems, totalValue } = useCreateContractContext();
  const [isClient, setIsClient] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { data: organization } = useGetOrganizationService({ slug });
  const { data: customer } = useGetCustomerByIdService({
    slug,
    customerId: form.watch("customerId"),
  });
  const { data: items } = useGetItemsService({ slug });
  const { data: seller } = useGetMemberByIdService({
    slug,
    memberId: form.watch("memberId"),
  });

  // Filtrar os itens selecionados
  const selectedItemsData =
    items
      ?.filter((item) => selectedItems.has(item.id))
      .map((item) => ({
        ...item,
        quantity: selectedItems.get(item.id) || 0,
      })) || [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formValues = form.getValues();

  // Função para gerar o PDF e abrir em nova aba
  const handleOpenInNewTab = async () => {
    const blob = await pdf(
      <ContractPDF
        organization={organization}
        customer={customer}
        items={selectedItemsData}
        totalValue={totalValue}
        seller={seller}
        formValues={formValues}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    window.open(url, "_blank");
  };

  // Limpar URL do objeto ao desmontar o componente
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Visualização do Contrato</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isClient && (
            <PDFViewer width="100%" height="100%" className="border rounded-md">
              <ContractPDF
                organization={organization}
                customer={customer}
                items={selectedItemsData}
                totalValue={totalValue}
                formValues={formValues}
              />
            </PDFViewer>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {isClient && (
            <>
              <Button
                variant="secondary"
                className="ml-auto mr-2"
                onClick={handleOpenInNewTab}
              >
                Abrir em nova aba
                <Icons.externalLink className="ml-2 size-4" />
              </Button>
              <PDFDownloadLink
                document={
                  <ContractPDF
                    organization={organization}
                    customer={customer}
                    items={selectedItemsData}
                    totalValue={totalValue}
                    seller={seller}
                    formValues={formValues}
                  />
                }
                fileName={`contrato-.pdf`}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? "Gerando PDF..." : "Baixar PDF"}
                    <Icons.download className="ml-2 size-4" />
                  </Button>
                )}
              </PDFDownloadLink>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
