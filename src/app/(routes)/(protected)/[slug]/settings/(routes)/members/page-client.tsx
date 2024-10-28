"use client";

import MemberCard from "./components/member-card";
import UserSkeleton from "./components/user-skeleton";
import useMembersPage from "./use-members-page";

type MembersPageClientProps = {
  slug: string;
};

export default function MembersPageClient({ slug }: MembersPageClientProps) {
  const { tabs, currentTab, setCurrentTab, members, isLoadingMembers } =
    useMembersPage({ slug });

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
              className="rounded-md px-3 py-1.5 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              {tab}
            </button>
          </div>
        ))}
      </div>
      <div className="grid divide-y divide-gray-200">
        {isLoadingMembers &&
          Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)}

        {members &&
          members.length > 0 &&
          members.map((member) => (
            <MemberCard
              key={member.id}
              slug={slug}
              member={member}
              currentTab={currentTab}
            />
          ))}

        {!members ||
          (members.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10">
              <img
                src="https://assets.dub.co/misc/video-park.svg"
                alt="No invitations sent"
                width={300}
                height={300}
                className="pointer-events-none -my-8"
              />
              <p className="text-sm text-gray-500">Sem convites.</p>
            </div>
          ))}
      </div>
    </>
  );
}
