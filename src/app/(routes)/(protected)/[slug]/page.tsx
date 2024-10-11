interface HomePageProps {
  params: {
    slug: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const parsedSlug = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Bem vindo, {parsedSlug}</h1>
    </div>
  );
}
