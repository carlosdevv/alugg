import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateContractContext } from "@/contexts/create-contract-context";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { ContractPDF } from "./contract-pdf";

interface ContractPDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContractPDFViewer({ isOpen, onClose }: ContractPDFViewerProps) {
  const {
    form,
    totalValue,
    nextContractCode,
    generateContractPDF,
    organization,
    customer,
    items,
    seller,
  } = useCreateContractContext();
  const [isClient, setIsClient] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Obter os itens do formulário em vez de usar selectedItems
  const formItems = form.watch("items") || [];

  // Mapear os itens do formulário com os dados completos dos itens
  const selectedItemsData = formItems
    .map((formItem) => {
      const itemData = items?.find((item) => item.id === formItem.itemId);
      if (!itemData || !itemData.name) return null; // Garantir que itemData e name existam

      return {
        ...itemData,
        quantity: formItem.quantity,
        isBonus: formItem.isBonus,
        baseValue: formItem.baseValue,
        discount: formItem.discount,
        finalValue: formItem.finalValue,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formValues = form.getValues();

  const handleOpenInNewTab = async () => {
    const blob = await generateContractPDF();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    window.open(url, "_blank");
  };

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
                seller={seller}
                formValues={formValues}
                code={nextContractCode}
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
                    code={nextContractCode}
                  />
                }
                fileName={`contrato-${nextContractCode}.pdf`}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? "Baixando PDF..." : "Baixar PDF"}
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
