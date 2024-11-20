"use client";

import { PageContent } from "../../../../../../components/page-layout";
import { PageWrapper } from "../../../../../../components/page-layout/page-wrapper";
import { Skeleton } from "../../../../../../components/ui/skeleton";
import { useGetCategoriesService } from "../../../../../../http/category/use-categories-service";
import { useGetItemByIdService } from "../../../../../../http/items/use-items-service";
import UpdateItemForm from "./components/update-item-form";

interface UpdateItemPageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default function UpdateItemPage({
  params: { id, slug },
}: UpdateItemPageProps) {
  const { data: item, isLoading } = useGetItemByIdService({ itemId: id, slug });

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesService({ slug });

  return (
    <PageContent title="Editar Item">
      <PageWrapper>
        {isLoading && isCategoriesLoading ? (
          <Skeleton />
        ) : item ? (
          <UpdateItemForm item={item} categories={categories!} />
        ) : (
          <div>Item not found.</div>
        )}
      </PageWrapper>
    </PageContent>
  );
}
