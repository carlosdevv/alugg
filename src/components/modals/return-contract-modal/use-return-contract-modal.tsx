import { ContractReturnPDF } from "@/components/contract-pdf/return/contract-return-pdf";
import {
  useGetContractByIdService,
  useReturnContractService,
} from "@/http/contracts/use-contracts-service";
import { useGetCustomerByIdService } from "@/http/customers/use-customers-service";
import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { createClient } from "@/lib/supabase/client";
import { ContractDocumentType } from "@prisma/client";
import { pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type UseReturnContractModalProps = {
  contractId: string;
};

export function useReturnContractModal({
  contractId,
}: UseReturnContractModalProps) {
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [returnNotes, setReturnNotes] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [shouldChargeFine, setShouldChargeFine] = useState(false);
  const [finePaymentMethod, setFinePaymentMethod] = useState("PIX");
  const [fineValue, setFineValue] = useState(0);
  const [creditParcelAmount, setCreditParcelAmount] = useState(1);

  const { data: organizationProps } = useGetOrganizationService(
    { slug },
    {
      queryKey: ["getOrganization", slug],
      enabled: open,
    }
  );

  const { data: contractProps, isLoading } = useGetContractByIdService(
    { contractId, slug },
    {
      queryKey: ["getContractById", slug, contractId],
      enabled: open,
    }
  );

  const { data: customerProps } = useGetCustomerByIdService(
    { customerId: contractProps ? contractProps.data.customer.id : "", slug },
    {
      queryKey: ["getCustomerById", contractProps?.data.customer.id],
      enabled: open && !!contractProps,
    }
  );

  const {
    mutateAsync: handleReturnContract,
    isPending: isReturnPending,
    data: returnData,
    isSuccess: isSuccessReturn,
  } = useReturnContractService();

  const onClose = useCallback(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("modal");
    router.replace(`${pathname}?${nextSearchParams}`);
    setOpen(false);
  }, [pathname, router, searchParams]);

  const generateReturnPDF = async () => {
    if (!contractProps) {
      toast.error("Dados do contrato não disponíveis");
      return null;
    }

    setIsGeneratingPdf(true);
    try {
      const pdfData = {
        organization: organizationProps,
        customer: contractProps.data.customer,
        items: contractProps.data.rentedItems.map((item) => ({
          ...item.item,
          quantity: item.quantity,
          value: item.finalValue,
          code: item.item.code,
        })),
        contractData: {
          eventDate: format(
            new Date(contractProps.data.eventDate),
            "dd/MM/yyyy"
          ),
          withdrawalDate: format(
            new Date(contractProps.data.withdrawalDate),
            "dd/MM/yyyy"
          ),
          returnDate: format(
            new Date(contractProps.data.returnDate),
            "dd/MM/yyyy"
          ),
          returnNotes,
          code: contractProps.data.code,
          returnedAt: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
          shouldChargeFine,
          fineDetails: shouldChargeFine
            ? {
                method: finePaymentMethod,
                value: fineValue,
                creditParcelAmount,
              }
            : undefined,
        },
      };

      const pdfBlob = await pdf(
        <ContractReturnPDF
          organization={pdfData.organization}
          customer={customerProps}
          items={pdfData.items}
          contractData={pdfData.contractData}
        />
      ).toBlob();

      const supabase = createClient();
      const fileName = `${slug}/${ContractDocumentType.RETURN.toLowerCase()}/contrato-${
        contractProps.data.code
      }-devolução.pdf`;

      const { error: uploadError } = await supabase.storage
        .from("organization-contracts")
        .upload(fileName, pdfBlob, {
          upsert: true,
        });

      if (uploadError) {
        console.error("Erro ao fazer upload do PDF:", uploadError);
        toast.error("Erro ao fazer upload do PDF. Tente novamente.");
        return null;
      }

      const { data } = await supabase.storage
        .from("organization-contracts")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
      return null;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const processReturn = async () => {
    const pdfUrl = await generateReturnPDF();

    if (!pdfUrl) return null;

    await handleReturnContract({
      pdfUrl,
      contractId,
    });
  };

  const handleReturn = async () => {
    if (shouldChargeFine && fineValue <= 0) {
      toast.error("O valor da multa deve ser maior que zero.");
      return;
    }

    await processReturn();
  };

  useEffect(() => {
    if (isSuccessReturn) {
      window.open(returnData.data.pdfUrl, "_blank");
      onClose();
      router.refresh();
    }
  }, [onClose, router, searchParams, isSuccessReturn, returnData]);

  useEffect(() => {
    const isShowModal = searchParams.get("modal") === "return-modal";

    if (isShowModal) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchParams]);

  return {
    open,
    setOpen,
    onClose,
    contractProps,
    customerProps,
    isLoading,
    isGeneratingPdf,
    processReturn,
    handleReturn,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isReturnPending,
    returnNotes,
    setReturnNotes,
    shouldChargeFine,
    setShouldChargeFine,
    finePaymentMethod,
    setFinePaymentMethod,
    fineValue,
    setFineValue,
    creditParcelAmount,
    setCreditParcelAmount,
  };
}
