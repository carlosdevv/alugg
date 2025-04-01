import { getDefaultOrganization } from "@/actions/get-default-organization";
import { getUser } from "@/actions/get-user";
import { getUserId } from "@/actions/user/get-user-id";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/auth";
import { appRoutes } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getUserId();

  if (!userId) return redirect(appRoutes.signIn);

  const user = await getUser(userId);

  if (!user) return redirect(appRoutes.signIn);

  const defaultOrganization = await getDefaultOrganization(user);

  if (defaultOrganization) {
    return redirect(`/${defaultOrganization}`);
  }

  return <>{children}</>;
}
