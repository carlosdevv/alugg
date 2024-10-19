import HomePageClient from "./page-client";

interface HomePageProps {
  params: {
    slug: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  return (
    <>
      <HomePageClient slug={params.slug} />
    </>
  );
}
