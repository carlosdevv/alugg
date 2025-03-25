import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import UpdateItemPageClient from "./page-client";

interface UpdateItemPageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default function UpdateItemPage({
  params: { id, slug },
}: UpdateItemPageProps) {
  return (
    <PageContent title="Editar Item" hasBackButton>
      <PageWrapper>
        <UpdateItemPageClient slug={slug} id={id} />
      </PageWrapper>
    </PageContent>
  );
}
