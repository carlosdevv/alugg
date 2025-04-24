"use client";

import * as React from "react";

import { DubButton } from "@/components/ui/dub-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  useGetSubscriptionService,
  useUpgradeSubscriptionService,
} from "@/http/billing/use-billing-service";
import { useRouter } from "next/navigation";
import { OrganizationSwitcher } from "../organization-switcher";
import { PendingInvites } from "../pending-invites";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useEffect } from "react";
type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  const {
    data: response,
    mutateAsync: upgradeSubscription,
    isPending,
  } = useUpgradeSubscriptionService();
  const { data: subscription } = useGetSubscriptionService();

  useEffect(() => {
    if (response && response.data.url) {
      window.location.href = response.data.url;
    }
  }, [response]);

  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader className="w-full grid grid-cols-[1fr_2rem] items-center">
        <OrganizationSwitcher />
        <PendingInvites />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4">
        {subscription?.data?.plan !== "pro" && (
          <DubButton
            text="Assine Plano Pro 🎉"
            loading={isPending}
            disabled={isPending}
            onClick={async () => {
              await upgradeSubscription({
                plan: "pro",
              });
            }}
          />
        )}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
