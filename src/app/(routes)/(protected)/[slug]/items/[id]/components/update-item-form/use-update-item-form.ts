import type { ItemProps } from "@/http/items/types";
import { useUpdateItemByIdService } from "@/http/items/use-items-service";
import { createClient } from "@/lib/supabase/client";
import {
  currencyToNumber,
  formatToCurrency,
  itemsFileAcceptTypes,
  UPLOAD_ITEMS_MAX_FILE_SIZE_MB,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemStatus } from "@prisma/client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateItemFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  categoryId: z.string({ required_error: "Selecione ao menos uma categoria" }),
  amount: z.coerce
    .number({ required_error: "Quantidade é obrigatória" })
    .positive({ message: "Quantidade deve ser maior que 0" }),
  objectPrice: z.string({ required_error: "Valor do Objeto é obrigatório" }),
  rentPrice: z.string({ required_error: "Valor do Aluguel é obrigatório" }),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  code: z.string().optional(),
  itemInRepair: z.coerce.boolean().default(false),
  itemInactive: z.coerce.boolean().default(false),
});

type UpdateItemFormValues = z.infer<typeof updateItemFormSchema>;

type UseUpdateItemFormProps = {
  item: ItemProps;
  id: string;
  slug: string;
};

export default function useUpdateItemForm({
  item,
  id,
  slug,
}: UseUpdateItemFormProps) {
  const form = useForm<UpdateItemFormValues>({
    resolver: zodResolver(updateItemFormSchema),
    defaultValues: {
      ...item,
      objectPrice: formatToCurrency(item.objectPrice.toString()),
      rentPrice: formatToCurrency(item.rentPrice.toString()),
      itemInRepair: item.status === ItemStatus.IN_REPAIR,
      itemInactive: item.status === ItemStatus.INACTIVE,
    },
  });

  const [image, setImage] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newImageMode, setNewImageMode] = useState(false);

  const { mutateAsync: updateItemMutation, isPending: isUpdatingImage } =
    useUpdateItemByIdService({ id, slug });

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

  async function uploadImageAndGetUrl(file: File, itemName: string) {
    const supabase = createClient();

    if (itemName === item.name) {
      const { error: supabaseError } = await supabase.storage
        .from("inventory-items-images")
        .update(`${slug}/${item.name}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (supabaseError) {
        console.error("Error uploading image", supabaseError);
        toast.warning(
          "Não foi possível fazer upload da imagem, tente novamente."
        );
      }

      const { data } = await supabase.storage
        .from("inventory-items-images")
        .getPublicUrl(`${slug}/${item.name}`);

      return data.publicUrl;
    }

    const { error } = await supabase.storage
      .from("inventory-items-images")
      .remove([`${slug}/${item.name}`]);

    if (error) {
      console.error("Error uploading image", error);
      toast.warning("Não foi possível remover a imagem, tente novamente.");
    }

    const { error: supabaseError } = await supabase.storage
      .from("inventory-items-images")
      .upload(`${slug}/${itemName}`, file);

    if (supabaseError) {
      console.error("Error uploading image", supabaseError);
      toast.warning(
        "Não foi possível fazer upload da imagem, tente novamente."
      );
    }

    const { data } = await supabase.storage
      .from("inventory-items-images")
      .getPublicUrl(`${slug}/${itemName}`);

    return data.publicUrl;
  }

  async function onSubmit(data: UpdateItemFormValues) {
    let imageUrl = item.imageUrl;

    if (newImageMode) {
      setIsUploadingImage(true);
      imageUrl = await uploadImageAndGetUrl(image[0], data.name);
      setIsUploadingImage(false);
    }

    const itemToUpdate = {
      name: data.name,
      categoryId: data.categoryId,
      amount: data.amount,
      objectPrice: currencyToNumber(data.objectPrice),
      rentPrice: currencyToNumber(data.rentPrice),
      size: data.size ?? undefined,
      color: data.color ?? undefined,
      description: data.description ?? undefined,
      code: data.code ?? undefined,
      status: data.itemInRepair ? ItemStatus.IN_REPAIR : item.status,
      imageUrl,
    };

    await updateItemMutation(itemToUpdate);
  }

  return {
    form,
    onSubmit,
    getRootProps,
    getInputProps,
    isUpdatingImage,
    isUploadingImage,
    newImageMode,
    setNewImageMode,
    imagePreview,
    handleRemoveImage,
  };
}
