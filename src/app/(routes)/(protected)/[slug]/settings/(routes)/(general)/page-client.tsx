"use client";

import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { useRouter } from "next/navigation";
import ChangeOrgLogo from "./components/change-org-logo";
import ChangeOrgSlugForm from "./components/change-org-slug-form";
import DeleteOrg from "./components/delete-org";
import { ToggleAppTheme } from "./components/toggle-app-theme";
import UpdateOrgDataForm from "./components/update-org-data-form";

type SettingsPageClientProps = {
  slug: string;
};

export default function SettingsPageClient({ slug }: SettingsPageClientProps) {
  const router = useRouter();
  const { data: organization, isLoading } = useGetOrganizationService(
    { slug },
    {
      enabled: !!slug,
      queryKey: ["getOrganization", slug],
      initialData: undefined,
    }
  );
  if (isLoading) return <div />;

  if (!organization) {
    router.back();
    return;
  }

  return (
    <>
      <UpdateOrgDataForm organization={organization} />
      <div className="grid grid-cols-1 md:grid-cols-[0.75fr_1fr] gap-6 h-full">
        <ChangeOrgLogo organization={organization} />
        <ChangeOrgSlugForm organization={organization} />
      </div>
      <ToggleAppTheme />
      <DeleteOrg organization={organization} />
    </>
  );
}
