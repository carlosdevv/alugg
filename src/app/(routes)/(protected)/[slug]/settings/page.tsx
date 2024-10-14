import SettingsPageClient from "./page-client";

export default async function SettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  return (
    <>
      <SettingsPageClient slug={slug} />
    </>
  );
}
