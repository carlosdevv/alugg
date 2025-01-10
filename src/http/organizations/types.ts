import type { Role } from "@/lib/casl/roles";

export type GetOrganizationsApiProps = {
  organizations: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    role: Role;
    plan: "free" | "pro";
    ownerId: string;
  }[];
};

export type GetOrganizationsResponse =
  GetOrganizationsApiProps["organizations"];

export type GetOrganizationServiceProps = {
  slug: string;
};

export type GetOrganizationResponse = {
  id: string;
  name: string;
  fantasyName?: string;
  socialName?: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  zipcode?: string;
  address?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  slug: string;
  logo?: string;
  role: Role;
  plan: "free" | "pro";
  ownerId: string;
};

export type GetOrganizationApiProps = {
  organization: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    role: Role;
    plan: "free" | "pro";
    ownerId: string;
  };
};

export type CreateOrganizationServiceBody = {
  name: string;
  slug: string;
  plan: "free" | "pro";
};

export type CreateOrganizationServiceResponse = {
  organizationId: string;
  slug: string;
};

export type UpdateOrganizationServiceBody = {
  newSlug?: string;
  name?: string;
  socialName?: string;
  fantasyName?: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  zipcode?: string;
  address?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  logo?: string;
};

export type UpdateOrganizationServiceResponse = {
  organization: GetOrganizationResponse;
}

export type FetchExistentSlugServiceProps = {
  slug: string;
};

export type FetchExistentSlugServiceResponse = {
  hasOrganization: boolean;
};

export type DeleteOrganizationServiceBody = {
  slug: string;
};
