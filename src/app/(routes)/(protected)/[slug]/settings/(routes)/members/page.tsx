import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InviteButton from "./components/invite-button";
import MembersPageClient from "./page-client";

export default async function MembersPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex w-full justify-between">
          <div className="flex flex-col space-y-4">
            <h1>Membros</h1>
            <p className="text-sm text-muted-foreground font-normal">
              Membros com acesso á sua organização.
            </p>
          </div>
          <InviteButton />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MembersPageClient slug={slug} />
      </CardContent>
    </Card>
  );
}
