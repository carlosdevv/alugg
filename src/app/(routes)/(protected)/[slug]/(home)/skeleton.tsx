import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card py-3 pt-4 px-4 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-4 rounded-md" />
        <Skeleton className="h-4 w-28 mt-1" />
      </div>
      <Skeleton className="h-8 w-16 my-4" />
      <div className="flex flex-col w-full gap-2">
        <div className="h-1 rounded-full bg-border/40" />
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}
