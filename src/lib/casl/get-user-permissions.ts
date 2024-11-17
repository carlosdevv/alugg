import { defineAbilityFor, userSchema } from "./ability";
import type { Role } from "./roles";

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  });

  const ability = defineAbilityFor(authUser);
  return ability;
}
