import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import ItemsPageClient from "./page-client";

export default async function CategoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  return (
    <PageContent title="Estoque">
      <PageWrapper>
        <ItemsPageClient slug={slug} />
      </PageWrapper>
    </PageContent>
  );
}
