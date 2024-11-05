import type { GetInvitesServiceResponse } from "@/http/invites/types";
import Image from "next/image";
import UserSkeleton from "../user-skeleton";
import InviteCard from "./invite-card";

type InvitesTabContentProps = {
  invites?: GetInvitesServiceResponse[];
  isLoadingInvites: boolean;
  slug: string;
};

export default function InvitesTabContent({
  invites,
  isLoadingInvites,
  slug,
}: InvitesTabContentProps) {
  console.log(invites?.length)
  return (
    <>
      {isLoadingInvites &&
        Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)}

      {invites &&
        invites.length > 0 &&
        invites.map((invite) => (
          <InviteCard key={invite.id} slug={slug} invite={invite} />
        ))}

      {invites?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <Image
            src="https://assets.dub.co/misc/video-park.svg"
            alt="No invitations sent"
            width={300}
            height={300}
            className="pointer-events-none -my-8"
          />
          <p className="text-sm text-gray-500">Sem convites.</p>
        </div>
      )}
    </>
  );
}
