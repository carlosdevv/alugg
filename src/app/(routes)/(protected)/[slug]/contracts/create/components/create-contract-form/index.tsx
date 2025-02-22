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
import { StepOne } from "../step-one";
import { StepTwo } from "../step-two";
import useCreateContractForm from "./use-create-contract-form";

const steps = [
  {
    step: 1,
    title: "Informações básicas",
  },
  {
    step: 2,
    title: "Itens do contrato",
  },
  {
    step: 3,
    title: "Step Three",
  },
];

export default function CreateContractForm() {
  const { form, onSubmit, currentStep, setCurrentStep } =
    useCreateContractForm();

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
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="w-min"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
          >
            Voltar
          </Button>
          <Button
            variant="outline"
            className="w-min"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep > steps.length}
          >
            Avançar
          </Button>
        </div>
      </form>
    </Form>
  );
}
