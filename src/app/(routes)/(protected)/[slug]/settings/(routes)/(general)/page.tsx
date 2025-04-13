import SettingsPageClient from "./page-client";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <SettingsPageClient slug={slug} />;
}
