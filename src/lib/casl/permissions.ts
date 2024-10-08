import { AbilityBuilder } from "@casl/ability";

import type { AppAbility } from "./ability";
import { User } from "./models/user";
import { Role } from "./roles";

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can("manage", "all");
  },
};
