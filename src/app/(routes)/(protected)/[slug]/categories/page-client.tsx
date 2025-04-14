"use client";
import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetCategoriesService } from "@/http/category/use-categories-service";
import { useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type CategoriesPageClientProps = {
  slug: string;
};

export default function CategoriesPageClient({
  slug,
}: CategoriesPageClientProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoryName, setCategoryName] = useState("");
  const [debouncedCategoryName] = useDebounce(categoryName, 500);

  const { data, isLoading } = useGetCategoriesService(
    {
      slug,
      page,
      limit: pageSize,
      categoryName: debouncedCategoryName || undefined,
    },
    {
      enabled: !!slug,
      queryKey: ["getCategories", slug, page, pageSize, debouncedCategoryName],
      initialData: {
        categories: [],
        total: 0,
        pagination: {
          total: 0,
          pages: 0,
          page: 1,
          limit: 10,
        },
      },
    }
  );

  const formattedData = data?.categories.map((category) => ({
    id: category.id.toString(),
    name: category.name,
    totalItems: category.totalItems,
    itemInactive: false,
  }));

  const handleCategoryNameChange = (name: string) => {
    setCategoryName(name);
    setPage(1);
  };

  const handleResetFilters = () => {
    setCategoryName("");
    setPage(1);
  };

  const paginationData = {
    pageCount: data?.pagination?.pages ?? 0,
    pageSize,
    page,
    onPageChange: (newPage: number) => {
      setPage(newPage);
    },
    onPageSizeChange: (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1);
    },
  };

  return (
    <PageContent title="Categorias">
      <PageWrapper>
        <div className="flex flex-wrap gap-y-4 items-center space-x-6 text-xs mb-4">
          {isLoading ? (
            <Skeleton className="w-20 h-6 rounded-md" />
          ) : (
            <div className="bg-gray-100 dark:bg-zinc-900 rounded-md flex space-x-4 py-1 px-2">
              <span className="font-medium uppercase">Total</span>
              <span className="font-light">{data?.total ?? 0}</span>
            </div>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-96 rounded-md w-full" />
        ) : (
          <DataTable
            columns={columns}
            data={formattedData ?? []}
            pagination={paginationData}
            toolbar={{
              onCategoryNameChange: handleCategoryNameChange,
              categoryName,
              isLoading,
              onResetFilters: handleResetFilters,
            }}
          />
        )}
      </PageWrapper>
    </PageContent>
  );
}
