import { Icons } from "@/components/icons";

export default function LayoutLoader() {
  return (
    <div className="flex h-[calc(100vh-16px)] items-center justify-center">
      <Icons.loader className="size-6 animate-spin" />
    </div>
  );
}
