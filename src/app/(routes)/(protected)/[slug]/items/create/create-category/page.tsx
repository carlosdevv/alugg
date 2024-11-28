"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { appRoutes } from "@/lib/constants";
import Link from "next/link";
import CreateCategoryForm from "./components/create-category-form";

export default function CreateCategoryPage() {
  return (
    <>
      <div className="flex items-center space-x-4 mt-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={appRoutes.categories.create}>
            <Icons.chevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-semibold text-2xl">Criar Categoria</h1>
      </div>
      <Separator className="mt-2 mb-6" />
      <CreateCategoryForm />
    </>
  );
}
