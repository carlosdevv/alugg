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
        {isLoading || isCategoriesLoading ? (
          <Skeleton />
        ) : item ? (
          <UpdateItemForm
            item={{
              name: item!.name,
              rentPrice: item!.rentPrice,
              amount: item!.amount,
              categoryId: item!.category.id,
              description: item!.description,
              status: item!.status,
              imageUrl: item!.imageUrl,
              itemInRenovation: item!.itemInRenovation,
              color: item!.color,
              size: item!.size,
              code: item?.code,
              objectPrice: item!.objectPrice,
            }}
            categories={categories!}
            id={id}
            slug={slug}
          />
        ) : (
          <div>Item not found.</div>
        )}
      </PageWrapper>
    </PageContent>
  );
}
