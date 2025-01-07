import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import { z } from "zod";

import { User } from "./models/user";
import { permissions } from "./permissions";
import { categorySubject } from "./subjects/category-subject";
import { inviteSubject } from "./subjects/invite-subject";
import { itemSubject } from "./subjects/item-subject";
import { organizationSubject } from "./subjects/organization-subject";
import { userSubject } from "./subjects/user-subject";
import { customerSubject } from "./subjects/customer-subject";

export * from "./models/user";
export * from "./roles";

const appAbilitiesSchema = z.union([
  userSubject,
  organizationSubject,
  inviteSubject,
  categorySubject,
  itemSubject,
  customerSubject,

  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== "function") {
    throw new Error(`Permissions for role ${user.role} not found`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename!;
    },
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}
