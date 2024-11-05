import type { Role } from "@prisma/client";
import Image from "next/image";
import UserSkeleton from "../user-skeleton";
import MemberCard from "./member-card";

type MembersTabContentProps = {
  members?: {
    id: string;
    name: string;
    email: string;
    role: Role;
    userId: string;
    isOwner: boolean;
  }[];
  isLoadingMembers: boolean;
  slug: string;
};

export default function MembersTabContent({
  members,
  isLoadingMembers,
  slug,
}: MembersTabContentProps) {
  return (
    <>
      {isLoadingMembers &&
        Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)}

      {members &&
        members.length > 0 &&
        members.map((member) => (
          <MemberCard key={member.id} slug={slug} member={member} />
        ))}

      {!members ||
        (members.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <Image
              src="https://assets.dub.co/misc/video-park.svg"
              alt="No members"
              width={300}
              height={300}
              className="pointer-events-none -my-8"
            />
            <p className="text-sm text-gray-500">Sem membros.</p>
          </div>
        ))}
    </>
  );
}
