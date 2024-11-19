import {
  useGetCategoryService,
  useUpdateCategoryService,
} from "@/http/category/use-categories-service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateCategoryFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
});

type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>;

export default function useUpdateCategoryModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const categoryId = searchParams.get("id");

  const [showModal, setShowModal] = useState(false);

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategoryFormSchema),
  });

  const {
    mutateAsync: updateCategoryService,
    isPending,
    isSuccess,
    reset,
  } = useUpdateCategoryService();

  const { data: categoryProps, isLoading } = useGetCategoryService(
    { categoryId: categoryId!, slug },
    {
      enabled: !!categoryId,
      queryKey: ["getCategory", categoryId],
    }
  );

  const onClose = useCallback(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("modal");
    nextSearchParams.delete("id");
    router.replace(`${pathname}?${nextSearchParams}`);
    form.clearErrors();
    setShowModal(false);
  }, [form, pathname, router, searchParams]);

  async function onSubmit(data: UpdateCategoryFormValues) {
    if (data.name === categoryProps?.name) {
      onClose();
      return;
    }

    const props = {
      ...data,
      slug,
      categoryId: searchParams.get("id") as string,
    };

    await updateCategoryService(props);
    form.reset();
  }

  useEffect(() => {
    const isShowModal =
      searchParams.get("modal") === "update-category" && searchParams.get("id");

    if (isShowModal) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      reset();
    }
  }, [isSuccess, onClose, reset]);

  useEffect(() => {
    if (categoryProps) {
      form.setValue("name", categoryProps.name);
    }
  }, [categoryProps, form]);

  return {
    onClose,
    showModal,
    setShowModal,
    form,
    onSubmit,
    isPending,
    isLoading,
  };
}
