import { Icons } from "@/components/icons";

export default function LayoutLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Icons.loader className="size-6 animate-spin" />
    </div>
  );
}
