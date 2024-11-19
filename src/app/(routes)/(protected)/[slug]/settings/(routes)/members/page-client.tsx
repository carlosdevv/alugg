"use client";

import InvitesTabContent from "./components/invite-tab-content";
import MembersTabContent from "./components/members-tab-content";
import useMembersPage from "./use-members-page";

type MembersPageClientProps = {
  slug: string;
};

export default function MembersPageClient({ slug }: MembersPageClientProps) {
  const {
    tabs,
    currentTab,
    setCurrentTab,
    members,
    isLoadingMembers,
    invites,
    isLoadingInvites,
  } = useMembersPage({ slug });

  return (
    <>
      <div className="flex space-x-3 border-b border-gray-200 px-3 sm:px-7">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`${
              tab === currentTab ? "border-black" : "border-transparent"
            } border-b py-1`}
          >
            <button
              onClick={() => setCurrentTab(tab)}
              className="rounded-md px-3 py-1.5 text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-zinc-800 active:bg-gray-200 dark:active:bg-zinc-800"
            >
              {tab}
            </button>
          </div>
        ))}
      </div>
      <div className="grid divide-y divide-gray-200 dark:divide-border">
        {currentTab === "Membros" && (
          <MembersTabContent
            members={members}
            isLoadingMembers={isLoadingMembers}
            slug={slug}
          />
        )}
        {currentTab === "Convites" && (
          <InvitesTabContent
            invites={invites}
            isLoadingInvites={isLoadingInvites}
            slug={slug}
          />
        )}
      </div>
    </>
  );
}
