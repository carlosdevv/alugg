"use client";

import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { useRouter } from "next/navigation";
import ChangeOrgNameForm from "./components/change-org-name-form";
import ChangeOrgSlugForm from "./components/change-org-slug-form";

type SettingsPageClientProps = {
  slug: string;
};

export default function SettingsPageClient({ slug }: SettingsPageClientProps) {
  const router = useRouter();
  const { data: organization, isLoading } = useGetOrganizationService({ slug });

  if (isLoading) return <div />;

  if (!organization) {
    router.back();
    return;
  }

  return (
    <>
      <ChangeOrgNameForm organization={organization} />
      <ChangeOrgSlugForm organization={organization} />
    </>
  );
}
