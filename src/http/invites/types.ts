import type { Role } from "@prisma/client";

export type GetInvitesServiceProps = {
  slug: string;
};

export type GetInvitesServiceResponse = {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
  author: {
    id: string;
    name: string;
  } | null;
};

export type GetInvitesServiceApiProps = {
  invites: {
    id: string;
    email: string;
    role: Role;
    createdAt: Date;
    author: {
      id: string;
      name: string;
    } | null;
  }[];
};

export type CreateInviteServiceBody = {
  slug: string;
  email: string;
  role: Role;
};

export type CreateInviteServiceResponse = {
  inviteId: string;
};

export type RevokeInviteServiceBody = {
  slug: string;
  inviteId: string;
};
