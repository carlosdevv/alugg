import { cookies } from "next/headers";

export function getCurrentOrg() {
  return cookies().get("org")?.value ?? undefined;
}
