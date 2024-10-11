import type { Role } from "@/lib/casl/roles";

export type GetOrganizationsApiProps = {
  organizations: {
    id: string;
    name: string;
    slug: string;
    role: Role;
    plan: "free" | "pro";
    ownerId: string;
  }[];
};

export type GetOrganizationsResponse =
  GetOrganizationsApiProps["organizations"];

export type CreateOrganizationServiceBody = {
  name: string;
  plan: "free" | "pro";
};

export type CreateOrganizationServiceResponse = {
  organizationId: string;
  slug: string;
};

export type GetMembershipProps = {
  org: string;
};

export type GetMembershipResponse = {
  membership: {
    id: string;
    role: Role;
    organizationId: string;
    userId: string;
  };
};
