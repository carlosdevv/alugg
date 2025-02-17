import { useCreateContractContext } from "@/contexts/create-contract-context";
import { compareDesc } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function useCreateContractForm() {
  const { form, onSubmit, setCurrentStep, currentStep } =
    useCreateContractContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function onDisabledNextButton() {
    const hasErrors = Object.keys(form.formState.errors).length > 0;
    if (hasErrors) return true;

    if (currentStep === 1) {
      const requiredFields: Array<
        "customerId" | "eventDate" | "returnDate" | "withdrawalDate"
      > = ["customerId", "eventDate", "returnDate", "withdrawalDate"];

      const hasCompletedForm = requiredFields.every(
        (field) => !!form.getValues(field)
      );

      const values = form.getValues();

      const eventDate = new Date(values.eventDate);
      const withdrawalDate = new Date(values.withdrawalDate);
      const returnDate = new Date(values.returnDate);

      const invalidWithdrawal = compareDesc(withdrawalDate, eventDate) === -1;
      const invalidReturn = compareDesc(returnDate, eventDate) === 1;

      if (invalidWithdrawal) {
        form.setError("withdrawalDate", {
          type: "onChange",
          message: "Data de retirada deve ser antes da data do evento",
        });
        return true;
      }

      if (invalidReturn) {
        form.setError("returnDate", {
          type: "onChange",
          message: "Data de devolução deve ser depois da data do evento",
        });
        return true;
      }

      return !hasCompletedForm;
    }

    return false;
  }

  useEffect(() => {
    if (!searchParams.get("step")) {
      router.replace(`${pathname}?step=1`);
    }

    if (currentStep === 1) {
      const stepOneFields: Array<
        "customerId" | "eventDate" | "returnDate" | "withdrawalDate"
      > = ["customerId", "eventDate", "returnDate", "withdrawalDate"];

      const emptyFields = stepOneFields.filter(
        (field) => !form.getValues(field)
      );

      if (emptyFields.length > 0) {
        router.replace(`${pathname}?step=1`);
      }
    }
  }, [currentStep, pathname, router, searchParams]);

  return {
    form,
    onSubmit,
    currentStep,
    setCurrentStep,
    onDisabledNextButton,
    searchParams,
  };
}
