import { useGetOrganizationsService } from "@/http/organizations/use-organizations-service";

type UseOrganizationSwitcherProps = {
  currentOrg?: string;
};

export default function useOrganizationSwitcher({
  currentOrg,
}: UseOrganizationSwitcherProps) {
  const { data: organizations } = useGetOrganizationsService();

  const currentOrganization =
    organizations && organizations.find((org) => org.slug === currentOrg);

  return { organizations, currentOrganization };
}
