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

export type PendingInvitesServiceProps = {
  slug: string;
};

export type PendingInvitesServiceApiProps = {
  invites: {
    id: string;
    role: Role;
    email: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
    } | null;
    organization: {
      name: string;
    };
  }[];
};

export type PendingInvitesServiceResponse = {
  id: string;
  role: Role;
  email: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
  } | null;
  organization: {
    name: string;
  };
};

export type AcceptInviteServiceBody = {
  slug: string;
  inviteId: string;
};

export type RejectInviteServiceBody = {
  slug: string;
  inviteId: string;
};
