import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import ItemsPageClient from "./page-client";

export default async function ItemsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PageContent title="Estoque">
      <PageWrapper>
        <ItemsPageClient slug={slug} />
      </PageWrapper>
    </PageContent>
  );
}
