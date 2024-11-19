import CategoriesPageClient from "./page-client";

export default async function CategoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  return (
    <>
      <CategoriesPageClient slug={slug} />
    </>
  );
}
