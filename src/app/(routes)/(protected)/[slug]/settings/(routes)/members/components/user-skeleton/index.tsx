import { Skeleton } from "@/components/ui/skeleton";

export default function UserSkeleton() {
  return (
    <div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
      <div className="flex items-center space-x-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="mt-1 h-3 w-32 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-3 w-24 rounded-full" />
    </div>
  );
}
