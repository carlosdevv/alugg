"use client";

import { Icons, type IconType } from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { appRoutes } from "@/lib/constants";
import { useAuth, useUser } from "@clerk/nextjs";
import { ComponentPropsWithoutRef, ElementType } from "react";

function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return initials;
}

export default function UserDropdown() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <Popover>
      <PopoverTrigger>
        {user ? (
          <Avatar className="size-7">
            <AvatarFallback className="bg-black/15">
              <span className="text-xs">
                {getInitials(user.firstName ?? "AA")}
              </span>
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="size-7">
            <AvatarFallback className="bg-black/15">
              <span className="text-xs">{getInitials("AA")}</span>
            </AvatarFallback>
          </Avatar>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-2 w-min">
        {user ? (
          <div className="p-2">
            <p className="truncate text-sm font-medium text-neutral-900">
              {user.firstName ||
                user.primaryEmailAddress?.emailAddress?.split("@")[0]}
            </p>
            <p className="truncate text-sm text-neutral-500">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        ) : (
          <div className="grid gap-2 px-2 py-3">
            <div className="h-3 w-12 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200" />
          </div>
        )}
        <div className="mb-2 px-2 w-full h-px border-dashed border" />
        <UserOption
          as="button"
          type="button"
          label="Sair"
          icon={Icons.signOut}
          onClick={() => signOut({ redirectUrl: appRoutes.signIn })}
        />
      </PopoverContent>
    </Popover>
  );
}

type UserOptionProps<T extends ElementType> = {
  as?: T;
  label: string;
  icon: IconType;
};

function UserOption<T extends ElementType = "button">({
  as,
  label,
  icon: Icon,
  children,
  ...rest
}: UserOptionProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof UserOptionProps<T>>) {
  const Component = as ?? "button";

  return (
    <Component
      className="flex w-full items-center gap-x-4 rounded-md px-2.5 py-2 text-sm transition-all duration-75 hover:bg-neutral-200/50 active:bg-neutral-200/80"
      {...rest}
    >
      <Icon className="size-4 text-neutral-500" />
      <span className="block truncate text-neutral-600">{label}</span>
      {children}
    </Component>
  );
}
