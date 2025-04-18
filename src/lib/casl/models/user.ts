import { z } from "zod";

import { roleSchema } from "../roles";

export const userSchema = z.object({
  id: z.string(),
  __typename: z.literal("User").default("User").optional(),
  role: roleSchema,
});

export type User = z.infer<typeof userSchema>;
