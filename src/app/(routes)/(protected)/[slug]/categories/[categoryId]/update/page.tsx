"use client";

import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import UpdateCategoryForm from "./components/update-category-form";
import { useGetCategoryService } from "@/http/category/use-categories-service";
import LayoutLoader from "@/components/layout-loader";

export default function UpdateCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const categoryId = params.categoryId;

  const { data: category, isLoading } = useGetCategoryService({
    categoryId,
  });

  if (isLoading) return <LayoutLoader />;

  if (!category) {
    return (
      <PageContent hasBackButton title="Editar Categoria">
        <div className="flex w-full items-center pt-3 pb-6">
          <PageWrapper className="flex flex-col gap-y-3">
            <p>Categoria não encontrada.</p>
          </PageWrapper>
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent hasBackButton title="Editar Categoria">
      <div className="flex w-full items-center pt-3 pb-6">
        <PageWrapper className="flex flex-col gap-y-3">
          <UpdateCategoryForm categoryName={category.name} />
        </PageWrapper>
      </div>
    </PageContent>
  );
}
