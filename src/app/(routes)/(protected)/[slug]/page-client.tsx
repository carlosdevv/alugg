"use client";
import LayoutLoader from "@/components/layout-loader";
import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { appRoutes } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import sessionStore from "../../../../hooks/session-context";

interface HomePageClientProps {
  slug: string;
}

export default function HomePageClient({ slug }: HomePageClientProps) {
  const router = useRouter();

  const { setSlug } = sessionStore();

  const {
    data: organization,
    isError,
    isLoading,
    isSuccess,
  } = useGetOrganizationService({ slug });

  if (isLoading) return <LayoutLoader />;

  if (isError) {
    toast.error("Essa organização não existe.");
    router.push(appRoutes.onboarding);
    return null;
  }

  if (isSuccess) {
    setSlug(slug);
  }

  return (
    <PageContent title={`Bem vindo, ${slug}`}>
      <div className="flex w-full items-center pt-3">
        <PageWrapper className="flex flex-col gap-y-3">
          {organization?.name}
        </PageWrapper>
      </div>
    </PageContent>
  );
}
