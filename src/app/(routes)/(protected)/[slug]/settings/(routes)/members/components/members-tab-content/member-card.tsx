import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import type { Role } from "@prisma/client";
import useMemberCard from "./use-member-card";

type MemberCardProps = {
  slug: string;
  member: {
    id: string;
    name: string;
    email: string;
    role: Role;
    userId: string;
    isOwner: boolean;
  };
};

export default function MemberCard({ slug, member }: MemberCardProps) {
  const { id, name, email, role: currentRole, isOwner } = member;

  const {
    openPopover,
    setOpenPopover,
    updateMemberRole,
    transferOwnership,
    deleteMember,
  } = useMemberCard({
    memberId: id,
    slug,
  });

  return (
    <>
      <div
        key={id}
        className="flex items-center justify-between space-x-3 px-4 py-6 sm:pl-8"
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar className="size-7">
              <AvatarFallback className="bg-black/15">
                <span className="text-xs">{getInitials(name ?? "AA")}</span>
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{name || email}</h3>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          {isOwner ? (
            <p className="flex items-center text-sm capitalize text-gray-500 mr-4">
              <Icons.crown className="size-4 mr-2" />
              Dono
            </p>
          ) : (
            <Select onValueChange={updateMemberRole} defaultValue={currentRole}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Membro</SelectItem>
              </SelectContent>
            </Select>
          )}

          {!isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  type="button"
                  onClick={() => setOpenPopover(!openPopover)}
                  className="h-8 space-x-0 px-1 py-2"
                  variant="outline"
                >
                  <Icons.verticalEllipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="grid w-full gap-1 p-2 sm:w-48">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    className="text-red-500"
                    onClick={async () => await transferOwnership()}
                  >
                    <Icons.transferOwnership className="size-4 mr-2" />
                    Transferir organização
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    className="text-red-500"
                    onClick={async () => await deleteMember()}
                  >
                    <Icons.userMinus className="size-4 mr-2" />
                    Remover membro
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );
}
