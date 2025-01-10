import type { GetOrganizationResponse } from "@/http/organizations/types";
import { useUpdateOrganizationService } from "@/http/organizations/use-organizations-service";
import { createClient } from "@/lib/supabase/client";
import {
  itemsFileAcceptTypes,
  UPLOAD_ITEMS_MAX_FILE_SIZE_MB,
} from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

type UseChangeOrgLogoProps = {
  organization: GetOrganizationResponse;
};
export default function useChangeOrgLogo({
  organization,
}: UseChangeOrgLogoProps) {
  const router = useRouter();
  const [image, setImage] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newImageMode, setNewImageMode] = useState(
    organization.logo ? false : true
  );

  const {
    mutateAsync: updateLogo,
    isPending: isUpdatingImage,
    isSuccess,
  } = useUpdateOrganizationService({
    slug: organization.slug,
  });

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

  async function uploadImageAndGetUrl(file: File) {
    const supabase = await createClient();

    if (organization.logo) {
      const { error: supabaseError } = await supabase.storage
        .from("organization-logos")
        .update(`${organization.slug}`, file, {
          cacheControl: "0",
          upsert: true,
        });

      if (supabaseError) {
        console.error("Error uploading image", supabaseError);
        toast.warning(
          "Não foi possível fazer upload da imagem, tente novamente."
        );
      }

      const { data } = await supabase.storage
        .from("organization-logos")
        .getPublicUrl(`${organization.slug}`);

      return data.publicUrl;
    }

    const { error } = await supabase.storage
      .from("organization-logos")
      .remove([`${organization.slug}`]);

    if (error) {
      console.error("Error uploading image", error);
      toast.warning("Não foi possível remover a imagem, tente novamente.");
    }

    const { error: supabaseError } = await supabase.storage
      .from("organization-logos")
      .upload(`${organization.slug}`, file);

    if (supabaseError) {
      console.error("Error uploading image", supabaseError);
      toast.warning(
        "Não foi possível fazer upload da imagem, tente novamente."
      );
    }

    const { data } = await supabase.storage
      .from("organization-logos")
      .getPublicUrl(`${organization.slug}`);

    return data.publicUrl;
  }

  async function onSubmit() {
    if (!newImageMode) return;

    setIsUploadingImage(true);
    const imageUrl = await uploadImageAndGetUrl(image[0]);
    setIsUploadingImage(false);

    await updateLogo({
      logo: imageUrl,
    });
  }

  useEffect(() => {
    if (isSuccess) router.refresh();
  }, [isSuccess]);

  return {
    newImageMode,
    setNewImageMode,
    isUpdatingImage,
    isUploadingImage,
    imagePreview,
    getRootProps,
    getInputProps,
    image,
    onSubmit,
  };
}
