import { useCreateContractContext } from "@/contexts/create-contract-context";
import { formatToCurrency } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useCreateContractForm() {
  const { form, onSubmit, setCurrentStep, currentStep, totalValue } =
    useCreateContractContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const validatePaymentValues = () => {
    if (currentStep === 3) {
      const paymentMethods = form.getValues("paymentMethod") || [];
      const totalPaymentValue = paymentMethods.reduce(
        (sum, method) => sum + (method.value || 0),
        0
      );

      // Verifica se há métodos de pagamento
      if (paymentMethods.length === 0) {
        toast.error("Adicione pelo menos um método de pagamento.");
        return false;
      }

      // Verifica se todos os métodos têm um tipo selecionado
      const hasEmptyMethod = paymentMethods.some((method) => !method.method);
      if (hasEmptyMethod) {
        toast.error("Selecione um tipo para todos os métodos de pagamento.");
        return false;
      }

      // Verifica se a soma dos valores é igual ao total
      if (Math.abs(totalPaymentValue - totalValue) > 0.01) {
        toast.error(
          `A soma dos valores de pagamento (${formatToCurrency(
            totalPaymentValue.toString()
          )}) deve ser igual ao valor total (${formatToCurrency(
            totalValue.toString()
          )}).`
        );
        return false;
      }

      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      if (!validatePaymentValues()) {
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (!searchParams.get("step")) {
      router.replace(`${pathname}?step=1`);
    }
  }, [currentStep, pathname, router, searchParams]);

  return {
    form,
    onSubmit,
    currentStep,
    setCurrentStep,
    searchParams,
    handleNextStep,
    validatePaymentValues,
    totalValue,
  };
}
