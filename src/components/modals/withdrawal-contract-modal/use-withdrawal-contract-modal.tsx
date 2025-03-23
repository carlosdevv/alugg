import { ContractWithdrawalPDF } from "@/components/contract-pdf/withdrawal/contract-withdrawal-pdf";
import {
  useGetContractByIdService,
  useWithdrawalContractService,
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

type UseWithdrawalContractModalProps = {
  contractId: string;
};

export function useWithdrawalContractModal({
  contractId,
}: UseWithdrawalContractModalProps) {
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [withdrawalNotes, setWithdrawalNotes] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
    mutateAsync: handleWithdrawalContract,
    isPending: isWithdrawalPending,
    data: withdrawalData,
    isSuccess: isSuccessWithdrawal,
  } = useWithdrawalContractService();

  const hasPendingPayment =
    contractProps &&
    contractProps.data.payments.some((payment) => !payment.isPaid);

  const totalPaid =
    (contractProps &&
      contractProps.data.payments.reduce(
        (acc, payment) => (payment.isPaid ? acc + payment.value : acc),
        0
      )) ||
    0;

  const pendingAmount =
    ((contractProps && contractProps.data.totalValue) || 0) - totalPaid;

  const onClose = useCallback(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("modal");
    router.replace(`${pathname}?${nextSearchParams}`);
    setOpen(false);
  }, [pathname, router, searchParams]);

  const generateWithdrawalPDF = async () => {
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
          withdrawalNotes,
          code: contractProps.data.code,
        },
      };

      const pdfBlob = await pdf(
        <ContractWithdrawalPDF
          organization={pdfData.organization}
          customer={customerProps}
          items={pdfData.items}
          contractData={pdfData.contractData}
        />
      ).toBlob();

      const supabase = createClient();
      const fileName = `${slug}/${ContractDocumentType.WITHDRAWAL.toLowerCase()}/contrato-${
        contractProps.data.code
      }-${ContractDocumentType.WITHDRAWAL.toLowerCase()}.pdf`;

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

  const processWithdrawal = async () => {
    const pdfUrl = await generateWithdrawalPDF();

    if (!pdfUrl) return null;

    await handleWithdrawalContract({
      pdfUrl,
      contractId,
    });
  };

  const handleWithdrawal = async () => {
    if (hasPendingPayment) {
      setIsConfirmModalOpen(true);
      return;
    }

    await processWithdrawal();
  };

  const handleRedirectToUpdate = () => {
    onClose();
    router.push(`contracts/${contractId}`);
  };

  useEffect(() => {
    if (isSuccessWithdrawal) {
      window.open(withdrawalData.data.pdfUrl, "_blank");
      onClose();
      router.refresh();
    }
  }, [onClose, router, searchParams, isSuccessWithdrawal, withdrawalData]);

  useEffect(() => {
    const isShowModal = searchParams.get("modal") === "withdrawal-modal";

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
    processWithdrawal,
    handleWithdrawal,
    handleRedirectToUpdate,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isWithdrawalPending,
    withdrawalNotes,
    setWithdrawalNotes,
    pendingAmount,
  };
}
