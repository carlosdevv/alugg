"use client";

import { Button } from "@/components/ui/button";
import { useGetCategoriesService } from "@/http/category/use-categories-service";
import { useGetItemByIdService } from "@/http/items/use-items-service";
import { useRouter } from "next/navigation";
import UpdateItemForm from "./components/update-item-form";
import UpdateItemPageLoading from "./loading";

interface UpdateItemPageClientProps {
  slug: string;
  id: string;
}

export default function UpdateItemPageClient({
  id,
  slug,
}: UpdateItemPageClientProps) {
  const router = useRouter();
  const { data: item, isLoading } = useGetItemByIdService({ itemId: id, slug });

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesService({ slug });

  return (
    <>
      {(isLoading || isCategoriesLoading) && <UpdateItemPageLoading />}

      {item && !isLoading && !isCategoriesLoading && (
        <UpdateItemForm
          itemProps={item}
          categories={categories}
          id={id}
          slug={slug}
        />
      )}

      {!item && !isLoading && !isCategoriesLoading && (
        <div className="flex items-center space-x-6">
          <span>Item não encontrado.</span>
          <Button onClick={() => router.back()} variant="link">
            Voltar
          </Button>
        </div>
      )}
    </>
  );
}
