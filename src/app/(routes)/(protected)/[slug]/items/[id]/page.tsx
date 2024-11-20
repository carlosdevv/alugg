"use client";

import { PageContent } from "../../../../../../components/page-layout";
import { PageWrapper } from "../../../../../../components/page-layout/page-wrapper";
import { Skeleton } from "../../../../../../components/ui/skeleton";
import { useGetItemByIdService } from "../../../../../../http/items/use-items-service";
import { Item } from "../components/columns";
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
  const { data, isLoading } = useGetItemByIdService({ itemId: id, slug });

  return (
    <PageContent title={id}>
      <PageWrapper>
        {isLoading ? (
          <Skeleton />
        ) : data ? (
          <UpdateItemForm props={data as Item} />
        ) : (
          <div>Item not found.</div>
        )}
      </PageWrapper>
    </PageContent>
  );
}
