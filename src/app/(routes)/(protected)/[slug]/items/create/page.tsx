import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import CreateItemForm from "./components/create-item-form";

export default function CreateItemPage() {
  return (
    <PageContent hasBackButton title="Criar Item">
      <div className="flex w-full items-center pt-3 pb-6">
        <PageWrapper className="flex flex-col gap-y-3">
          <CreateItemForm />
        </PageWrapper>
      </div>
    </PageContent>
  );
}
