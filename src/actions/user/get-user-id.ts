import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserId() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error("Session not found");

    const { session: sessionData } = session;

    return sessionData.userId;
  } catch (error) {
    console.error(error);
    return null;
  }
}
