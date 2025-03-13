"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { StepFour } from "./step-four";
import { StepOne } from "./step-one";
import { StepThree } from "./step-three";
import { StepTwo } from "./step-two";
import useCreateContractForm from "./use-create-contract-form";

const steps = [
  {
    step: 1,
    title: "Informações Básicas",
  },
  {
    step: 2,
    title: "Itens do Contrato",
  },
  {
    step: 3,
    title: "Resumo e Pagamento",
  },
  {
    step: 4,
    title: "Finalizar Contrato",
  },
];

export default function CreateContractForm() {
  const {
    form,
    onSubmit,
    currentStep,
    setCurrentStep,
    handleNextStep,
    isCreatingContract,
  } = useCreateContractForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <Stepper
          defaultValue={currentStep}
          value={currentStep}
          className="items-start gap-4"
        >
          {steps.map(({ step, title }) => (
            <StepperItem key={step} step={step} className="flex-1">
              <StepperTrigger
                type="button"
                className="w-full flex-col items-start gap-2"
              >
                <StepperIndicator asChild className="h-1 w-full bg-border">
                  <span className="sr-only">{step}</span>
                </StepperIndicator>
                <div className="space-y-0.5">
                  <StepperTitle>{title}</StepperTitle>
                </div>
              </StepperTrigger>
            </StepperItem>
          ))}
        </Stepper>
        <div className="flex flex-col py-6">
          {currentStep === 1 && <StepOne />}
          {currentStep === 2 && <StepTwo />}
          {currentStep === 3 && <StepThree />}
          {currentStep === 4 && <StepFour />}
        </div>
        <div className="flex space-x-4">
          {currentStep > 1 && currentStep <= 3 && (
            <Button
              type="button"
              variant="outline"
              className="w-min"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1 || isCreatingContract}
            >
              Voltar
            </Button>
          )}
          {currentStep <= 3 && (
            <Button
              type="button"
              variant="outline"
              className="w-min"
              onClick={handleNextStep}
              disabled={currentStep > steps.length || isCreatingContract}
            >
              Avançar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
