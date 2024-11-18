"use client";

import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import CreateCategoryForm from "./components/create-category-form";

export default function CreateCategoryPage() {
  return (
    <PageContent hasBackButton title="Criar Categoria">
      <div className="flex w-full items-center pt-3 pb-6">
        <PageWrapper className="flex flex-col gap-y-3">
          <CreateCategoryForm />
        </PageWrapper>
      </div>
    </PageContent>
  );
}
