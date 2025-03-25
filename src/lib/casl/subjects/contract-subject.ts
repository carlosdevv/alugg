import { z } from "zod";

export const contractSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("get"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
  ]),
  z.literal("Contract"),
]);

export type ContractSubject = z.infer<typeof contractSubject>;
