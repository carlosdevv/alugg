import { useCreateContractContext } from "@/contexts/create-contract-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function useCreateContractForm() {
  const { form, onSubmit, setCurrentStep, currentStep } =
    useCreateContractContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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
  };
}
