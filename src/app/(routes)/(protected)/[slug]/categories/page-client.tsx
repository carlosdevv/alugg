"use client";
import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesService } from "@/http/category/use-categories-service";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type CategoriesPageClientProps = {
  slug: string;
};

export default function CategoriesPageClient({
  slug,
}: CategoriesPageClientProps) {
  const { data: categories, isLoading } = useGetCategoriesService({ slug });

  const data =
    categories?.map((category) => ({
      id: category.id.toString(),
      name: category.name,
      totalItems: category.totalItems,
      itemInactive: false,
    })) ?? [];

  return (
    <PageContent title="Categorias">
      <PageWrapper>
        <div className="flex flex-wrap gap-y-4 items-center space-x-6 text-xs mb-4">
          {isLoading ? (
            <Skeleton className="w-20 h-6 rounded-md" />
          ) : (
            <div className="bg-gray-100 dark:bg-zinc-900 rounded-md flex space-x-4 py-1 px-2">
              <span className="font-medium uppercase">Total</span>
              <span className="font-light">
                {categories == null ? 0 : categories.length}
              </span>
            </div>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-96 rounded-md w-full" />
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </PageWrapper>
    </PageContent>
  );
}
