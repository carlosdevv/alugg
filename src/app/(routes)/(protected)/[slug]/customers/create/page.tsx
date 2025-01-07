import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import CreateCustomerForm from "./components/create-customer-form";

export default function CreateCustomerPage() {
  return (
    <PageContent hasBackButton title="Criar Cliente">
      <div className="flex w-full items-center pt-3 pb-6">
        <PageWrapper className="flex flex-col gap-y-3">
          <CreateCustomerForm />
        </PageWrapper>
      </div>
    </PageContent>
  );
}
