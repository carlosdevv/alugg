import { useCreateCategoryService } from "@/http/category/use-categories-service";
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
import sessionStore from "../../../hooks/session-context";

const createCategoryFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
});

type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;

export default function useCreateCategoryModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const { addCategory } = sessionStore();

  const [showModal, setShowModal] = useState(false);

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategoryFormSchema),
  });

  const {
    mutateAsync: createCategoryService,
    isPending,
    isSuccess,
    reset,
  } = useCreateCategoryService();

  const onClose = useCallback(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("modal");
    router.replace(`${pathname}?${nextSearchParams}`);
    setShowModal(false);
  }, [pathname, router, searchParams]);

  async function onSubmit(data: CreateCategoryFormValues) {
    const props = {
      ...data,
      slug,
    };

    const createdCategory = await createCategoryService(props);
    form.reset();
    addCategory({
      id: createdCategory.id,
      name: createdCategory.name,
      totalItems: 0,
    });
  }

  useEffect(() => {
    const isShowModal = searchParams.get("modal") === "create-category";

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
  }, [isSuccess, reset, onClose]);

  return {
    onClose,
    showModal,
    setShowModal,
    form,
    onSubmit,
    isPending,
  };
}
