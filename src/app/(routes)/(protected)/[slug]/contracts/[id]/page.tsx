import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import UpdateContractPageClient from "./page-client";

interface UpdateContractPageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default function UpdateContractPage({
  params: { id, slug },
}: UpdateContractPageProps) {
  return (
    <PageContent title="Editar Contrato" hasBackButton>
      <PageWrapper>
        <UpdateContractPageClient slug={slug} id={id} />
      </PageWrapper>
    </PageContent>
  );
}
