import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { PropsWithChildren } from "react";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <PageContent>
      <div className="relative min-h-[calc(100vh-16px)]">
        <PageWrapper className="pb-10 pt-3">
          <div className="grid gap-5">{children}</div>
        </PageWrapper>
      </div>
    </PageContent>
  );
}
