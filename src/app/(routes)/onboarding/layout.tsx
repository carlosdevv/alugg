import { getDefaultOrganization } from "@/actions/get-default-organization";
import { getUser } from "@/actions/get-user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, protect } = auth();
  const user = await getUser(userId);

  if (!user) return protect();

  const defaultOrganization = await getDefaultOrganization(user);

  if (defaultOrganization) {
    
    return redirect(`/${defaultOrganization}`);
  }

  return <>{children}</>;
}
