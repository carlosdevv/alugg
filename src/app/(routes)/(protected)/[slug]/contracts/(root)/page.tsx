import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import ContractsPageClient from "./page-client";

interface ContractsPageProps {
  params: {
    slug: string;
  };
}

export default function ContractsPage({ params }: ContractsPageProps) {
  return (
    <PageContent title="Contratos">
      <div className="flex w-full items-center pt-3">
        <PageWrapper className="flex flex-col gap-y-3">
          <ContractsPageClient slug={params.slug} />
        </PageWrapper>
      </div>
    </PageContent>
  );
}
