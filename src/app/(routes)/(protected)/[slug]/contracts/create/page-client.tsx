"use client";
import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { CreateContractProvider } from "@/contexts/create-contract-context";
import CreateContractForm from "./components/create-contract-form";

export default function CreateContractPageClient() {
  return (
    <CreateContractProvider>
      <PageContent hasBackButton title="Criar Contrato">
        <div className="flex w-full items-center pt-3 pb-6">
          <PageWrapper className="flex flex-col gap-y-3">
            <CreateContractForm />
          </PageWrapper>
        </div>
      </PageContent>
    </CreateContractProvider>
  );
}
