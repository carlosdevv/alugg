import { getDefaultOrganization } from "@/actions/get-default-organization";
import { auth } from "@/lib/auth";
import { appRoutes } from "@/lib/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect(appRoutes.signIn);

  const user = session.user;

  if (!user) return redirect(appRoutes.signIn);

  const defaultOrganization = await getDefaultOrganization({
    id: user.id,
    defaultOrganization: user.defaultOrganization,
  });

  if (defaultOrganization) {
    return redirect(`/${defaultOrganization}`);
  }

  return <>{children}</>;
}
