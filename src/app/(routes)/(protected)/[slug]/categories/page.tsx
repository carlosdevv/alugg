import CategoriesPageClient from "./page-client";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CategoriesPageClient slug={slug} />;
}
