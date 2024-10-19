"use client";
import LayoutLoader from "@/components/layout-loader";
import { MainNav } from "@/components/main-nav";
import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { appRoutes } from "@/lib/constants";
import { useParams, useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const {
    data: organization,
    isError,
    isLoading,
  } = useGetOrganizationService(
    { slug },
    {
      enabled: !!slug,
      queryKey: ["getOrganization", slug],
    }
  );

  if (isLoading) return <LayoutLoader />;

  if (!organization || isError || !slug)
    return router.push(appRoutes.onboarding);

  return (
    <>
      <main className="min-h-screen w-full bg-white">
        <MainNav>
          {children}
          {sheet}
        </MainNav>
      </main>
    </>
  );
}
