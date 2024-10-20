import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";

type EmailInputProps = React.ComponentProps<typeof Input>;

export default function EmailInput({ ...props }: EmailInputProps) {
  return (
    <div className="relative">
      <Input {...props} type="email" className="pl-9" />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <Icons.atSign
          className="size-4"
          strokeWidth={2}
          aria-hidden="true"
          role="presentation"
        />
      </div>
    </div>
  );
}
