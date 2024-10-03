"use client";
import { useGetOrganizationsService } from "@/http/organizations/use-organizations-service";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data: organizations } = useGetOrganizationsService();

  if (organizations && organizations.length > 0) {
    const orgCookie = getCookie("org");

    if (orgCookie) {
      router.push(`org/${orgCookie}`);
      return;
    }

    router.push(`/org/${organizations[0].slug}`);
  }

  return <>{children}</>;
}
