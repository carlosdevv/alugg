export type GetOrganizationsApiProps = {
  organizations: {
    id: string;
    name: string;
    slug: string;
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
