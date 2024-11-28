import ItemsPageCLlent from "./page-client";

export default async function CategoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  return (
    <>
      <ItemsPageCLlent slug={slug} />
    </>
  );
}
