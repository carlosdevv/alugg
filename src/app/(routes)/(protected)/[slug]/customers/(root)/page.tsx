import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import CustomersPageClient from "./page-client";

interface CustomersPageProps {
  params: {
    slug: string;
  };
}

export default function CustomersPage({ params }: CustomersPageProps) {
  return (
    <PageContent title="Clientes">
      <div className="flex w-full items-center pt-3">
        <PageWrapper className="flex flex-col gap-y-3">
          <CustomersPageClient slug={params.slug} />
        </PageWrapper>
      </div>
    </PageContent>
  );
}
