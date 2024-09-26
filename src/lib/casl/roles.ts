import z from "zod";

export const roleSchema = z.literal("ADMIN");

export type Role = z.infer<typeof roleSchema>;
