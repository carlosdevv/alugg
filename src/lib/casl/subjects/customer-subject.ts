import { z } from "zod";

export const customerSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("get"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
  ]),
  z.literal("Customer"),
]);

export type CustomerSubject = z.infer<typeof customerSubject>;
