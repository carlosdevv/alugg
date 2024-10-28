import { useGetMembersService } from "@/http/members/use-members-service";
import { useState } from "react";

type UseMembersPageProps = {
  slug: string;
};

export default function useMembersPage({ slug }: UseMembersPageProps) {
  const tabs: Array<"Membros" | "Convites"> = ["Membros", "Convites"];

  const [currentTab, setCurrentTab] = useState<"Membros" | "Convites">(
    "Membros"
  );

  const { data: members, isLoading: isLoadingMembers } = useGetMembersService(
    {
      slug,
    },
    {
      queryKey: ["getMembers", slug],
      enabled: currentTab === "Membros",
    }
  );

  return { tabs, currentTab, setCurrentTab, members, isLoadingMembers };
}
