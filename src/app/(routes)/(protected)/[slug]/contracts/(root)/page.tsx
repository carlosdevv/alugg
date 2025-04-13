import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import ContractsPageClient from "./page-client";

interface ContractsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ContractsPage({ params }: ContractsPageProps) {
  const { slug } = await params;

  return (
    <PageContent title="Contratos">
      <div className="flex w-full items-center pt-3">
        <PageWrapper className="flex flex-col gap-y-3">
          <ContractsPageClient slug={slug} />
        </PageWrapper>
      </div>
    </PageContent>
  );
}
