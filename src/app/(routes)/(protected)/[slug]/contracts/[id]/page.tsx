import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import UpdateCustomerPageClient from "./page-client";

interface UpdateCustomerPageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default function UpdateCustomerPage({
  params: { id, slug },
}: UpdateCustomerPageProps) {
  return (
    <PageContent title="Editar Cliente" hasBackButton>
      <PageWrapper>
        <UpdateCustomerPageClient slug={slug} id={id} />
      </PageWrapper>
    </PageContent>
  );
}
