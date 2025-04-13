import { useGetCategoriesService } from "@/http/category/use-categories-service";
import { useCreateItemService } from "@/http/items/use-items-service";
import { createClient } from "@/lib/supabase/client";
import {
    currencyToNumber,
    itemsFileAcceptTypes,
    UPLOAD_ITEMS_MAX_FILE_SIZE_MB,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemStatus } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createItemFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  categoryId: z.string({ required_error: "Selecione ao menos uma categoria" }),
  amount: z.coerce
    .number({
      required_error: "Quantidade é obrigatória",
      invalid_type_error: "Quantidade deve ser um número",
    })
    .positive({ message: "Quantidade deve ser maior que 0" }),
  objectPrice: z.string({ required_error: "Valor do Objeto é obrigatório" }),
  rentPrice: z.string({ required_error: "Valor do Aluguel é obrigatório" }),
  size: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  itemInRepair: z.coerce.boolean().default(false),
  itemInactive: z.coerce.boolean().default(false),
});

type CreateItemFormValues = z.infer<typeof createItemFormSchema>;

export default function useCreateItemForm() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const form = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemFormSchema),
  });

  const [, setModal] = useQueryState("modal");
  const [image, setImage] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: itemsFileAcceptTypes,
    onDrop(acceptedFiles) {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > UPLOAD_ITEMS_MAX_FILE_SIZE_MB * 1024 * 1024) {
          toast.error("O arquivo deve ter no máximo 10MB.");
          return;
        }
        setImage([file]);
        setImagePreview(URL.createObjectURL(file));
      }
    },
    onError: (err) => {
      console.error("Error uploading file", err);
      toast.error("Não foi possível fazer upload da imagem");
    },
  });

  function handleRemoveImage() {
    setImage([]);
    setImagePreview(null);
  }

  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesService(
    { slug },
    { 
      enabled: !!slug,
      queryKey: ["getCategories", slug],
      initialData: [], // Fornece um valor inicial para evitar undefined
      staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    }
  );

  const { mutateAsync: createItemService, isPending: isCreatingItem } =
    useCreateItemService(
      { slug },
      {
        onSuccess: () => {
          form.reset();
          router.push(`/${slug}/items`);
        },
      }
    );

  async function uploadImageAndGetUrl(file: File, itemName: string) {
    const supabase = await createClient();

    const { error: supabaseError } = await supabase.storage
      .from("inventory-items-images")
      .upload(`${slug}/${itemName}`, file);

    if (supabaseError) {
      console.error("Error uploading image", supabaseError);
      toast.warning(
        "Não foi possível fazer upload da imagem, tente novamente ao editar o item."
      );
    }

    const { data } = await supabase.storage
      .from("inventory-items-images")
      .getPublicUrl(`${slug}/${itemName}`);

    return data.publicUrl;
  }

  async function onSubmit(data: CreateItemFormValues) {
    if (currencyToNumber(data.objectPrice) === 0) {
      toast.error("Valor do objeto deve ser diferente de 0");
      form.setError("objectPrice", {
        message: "Valor do objeto deve ser diferente de 0",
      });
      return;
    }

    if (currencyToNumber(data.rentPrice) === 0) {
      toast.error("Valor do aluguel deve ser diferente de 0");
      form.setError("rentPrice", {
        message: "Valor do aluguel deve ser diferente de 0",
      });
      return;
    }

    let imageUrl;
    if (image.length > 0) {
      setIsUploadingImage(true);
      imageUrl = await uploadImageAndGetUrl(image[0], data.name);
      setIsUploadingImage(false);
    }

    const status = data.itemInRepair
      ? ItemStatus.IN_REPAIR
      : data.itemInactive
      ? ItemStatus.INACTIVE
      : ItemStatus.ACTIVE;

    await createItemService({
      description: data.description,
      imageUrl: imageUrl,
      status,
      amount: data.amount,
      rentPrice: currencyToNumber(data.rentPrice),
      objectPrice: currencyToNumber(data.objectPrice),
      categoryId: data.categoryId,
      name: data.name,
      code: data.code,
      size: data.size,
      color: data.color,
    });
  }

  return {
    form,
    onSubmit,
    categories,
    isLoadingCategories,
    setModal,
    getRootProps,
    getInputProps,
    handleRemoveImage,
    imagePreview,
    isCreatingItem,
    isUploadingImage,
  };
}
