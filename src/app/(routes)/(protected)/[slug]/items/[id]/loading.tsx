import { Skeleton } from "@/components/ui/skeleton";

export default function UpdateItemPageLoading() {
  return (
    <>
      <div className="grid gap-4 grid-cols-[1fr_250px]">
        <Skeleton className="w-full h-80" />
        <Skeleton className="size-60" />
      </div>
    </>
  );
}
