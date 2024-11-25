"use client";
import LayoutLoader from "@/components/layout-loader";
import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { appRoutes } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import sessionStore from "../../../../hooks/session-context";
import { useGetCategoriesService } from "../../../../http/category/use-categories-service";

interface HomePageClientProps {
  slug: string;
}

export default function HomePageClient({ slug }: HomePageClientProps) {
  const router = useRouter();

  const { isError, isLoading } = useGetOrganizationService({ slug });

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesService({ slug });

  const { setCategories, slug: currentSlug, setSlug } = sessionStore();

  useEffect(() => {
    setCategories(categories);
    setSlug(slug);
  }, [categories, setCategories, setSlug, slug]);

  if (isLoading && isLoadingCategories) return <LayoutLoader />;

  if (isError) {
    toast.error("Essa organização não existe.");
    router.push(appRoutes.onboarding);
    return null;
  }

  return (
    <PageContent title={`Bem vindo, ${slug}`}>
      <div className="flex w-full items-center pt-3">
        <PageWrapper className="flex flex-col gap-y-3">
          {currentSlug}
        </PageWrapper>
      </div>
    </PageContent>
  );
}
