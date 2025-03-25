import {
  useGetContractSettingsService,
  useUpdateContractSettingsService,
} from "@/http/contracts/use-contracts-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateContractDaysGapFormSchema = z.object({
  daysBefore: z.coerce.number().min(0),
  daysAfter: z.coerce.number().min(0),
});

type UpdateContractDaysGapValues = z.infer<
  typeof updateContractDaysGapFormSchema
>;

export default function useUpdateContractDaysGap() {
  const { data: contractSettings, isLoading } = useGetContractSettingsService();

  const [hasEmptyFields, setHasEmptyFields] = useState(true);

  const form = useForm<UpdateContractDaysGapValues>({
    resolver: zodResolver(updateContractDaysGapFormSchema),
    defaultValues: {
      daysBefore: 0,
      daysAfter: 0,
    },
  });

  const {
    mutateAsync: updateContractSettings,
    isPending: isUpdatingContractSettings,
  } = useUpdateContractSettingsService();

  const handleIntegerInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      onChange(value);
    }
  };

  useEffect(() => {
    if (contractSettings?.data) {
      form.setValue("daysBefore", contractSettings.data.daysBefore);
      form.setValue("daysAfter", contractSettings.data.daysAfter);
      
      setHasEmptyFields(false);
    }
  }, [contractSettings, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      const daysBefore = values.daysBefore;
      const daysAfter = values.daysAfter;

      setHasEmptyFields(
        daysBefore === undefined || 
        daysBefore === null || 
        String(daysBefore).trim() === "" || 
        daysAfter === undefined || 
        daysAfter === null || 
        String(daysAfter).trim() === ""
      );
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: UpdateContractDaysGapValues) => {
    await updateContractSettings({
      daysBefore: data.daysBefore,
      daysAfter: data.daysAfter,
    });
  };

  return {
    form,
    onSubmit,
    isLoading,
    isUpdatingContractSettings,
    handleIntegerInputChange,
    hasEmptyFields,
  };
}
