"use client";
import { Icons } from "@/components/icons";
import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { useGetDashboardStatsService } from "@/http/dashboard/use-dashboard-service";
import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { appRoutes } from "@/lib/constants";
import { Package, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardSkeleton } from "./skeleton";

interface HomePageClientProps {
  slug: string;
}

export default function HomePageClient({ slug }: HomePageClientProps) {
  const router = useRouter();

  const {
    data: organization,
    isError,
    isLoading,
  } = useGetOrganizationService({ slug });

  const { data: stats, isLoading: isLoadingStats } =
    useGetDashboardStatsService(
      { slug },
      {
        queryKey: ["dashboard-stats", slug],
        refetchOnWindowFocus: true,
      }
    );

  if (isLoading || isLoadingStats) return <DashboardSkeleton />;

  if (isError) {
    toast.error("Essa organização não existe.");
    router.push(appRoutes.onboarding);
    return null;
  }

  return (
    <PageContent title={`Bem vindo, ${organization?.name}`}>
      <div className="flex w-full items-center pt-3">
        <PageWrapper className="flex flex-col gap-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card de Contratos */}
            <div className="rounded-lg border bg-card py-3 pt-4 px-4 shadow-sm">
              <div className="flex flex-col gap-1.5 text-muted-foreground">
                <Icons.file className="size-4" />
                <h3 className="text-sm">Contratos finalizados</h3>
              </div>
              <p className="text-2xl my-4">{stats?.finishedContracts || 0}</p>
              <div className="flex flex-col w-full gap-2">
                <div className="h-1 rounded-full bg-border" />
                <p className="text-xs text-muted-foreground">
                  {stats?.totalContracts || 0} contratos no total
                </p>
              </div>
            </div>

            {/* Card de Itens */}
            <div className="rounded-lg border bg-card py-3 pt-4 px-4 shadow-sm">
              <div className="flex flex-col gap-1.5 text-muted-foreground">
                <Package className="size-4" />
                <h3 className="text-sm">Itens no estoque</h3>
              </div>
              <p className="text-2xl my-4">{stats?.stockItems || 0}</p>
              <div className="flex flex-col w-full gap-2">
                <div className="h-1 rounded-full bg-border" />
                <p className="text-xs text-muted-foreground">
                  {stats?.totalItems || 0} itens cadastrados
                </p>
              </div>
            </div>

            {/* Card de Clientes */}
            <div className="rounded-lg border bg-card py-3 pt-4 px-4 shadow-sm">
              <div className="flex flex-col gap-1.5 text-muted-foreground">
                <Users className="size-4" />
                <h3 className="text-sm">Clientes</h3>
              </div>
              <p className="text-2xl my-4">{stats?.clients || 0}</p>
              <div className="flex flex-col w-full gap-2">
                <div className="h-1 rounded-full bg-border" />
                <p className="text-xs text-muted-foreground">
                  Total de clientes cadastrados
                </p>
              </div>
            </div>
          </div>
        </PageWrapper>
      </div>
    </PageContent>
  );
}
