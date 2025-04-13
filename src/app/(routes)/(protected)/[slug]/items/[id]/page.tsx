import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import UpdateItemPageClient from "./page-client";

interface UpdateItemPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export default async function UpdateItemPage({ params }: UpdateItemPageProps) {
  const { slug, id } = await params;

  return (
    <PageContent title="Editar Item" hasBackButton>
      <PageWrapper>
        <UpdateItemPageClient slug={slug} id={id} />
      </PageWrapper>
    </PageContent>
  );
}
