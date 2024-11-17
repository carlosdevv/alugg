import type { GetOrganizationResponse } from "@/http/organizations/types";
import {
  useFetchExistentSlugService,
  useUpdateOrganizationService,
} from "@/http/organizations/use-organizations-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";

const changeOrgSlugFormSchema = z.object({
  newSlug: z.string({ required_error: "Slug é obrigatório" }).max(48, {
    message: "Máximo de 48 caracteres",
  }),
});

type ChangeOrgSlugValues = z.infer<typeof changeOrgSlugFormSchema>;

type UseChangeOrgSlugFormProps = {
  organization: GetOrganizationResponse;
};

export default function useChangeOrgSlugForm({
  organization,
}: UseChangeOrgSlugFormProps) {
  const form = useForm<ChangeOrgSlugValues>({
    resolver: zodResolver(changeOrgSlugFormSchema),
    defaultValues: {
      newSlug: organization.slug,
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const [debouncedSlug, setDebouncedSlug] = useState(organization.slug);
  const slug = slugify(form.watch("newSlug"), { lower: true });

  // Debounce logic to delay the API call by 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSlug(slug);
    }, 500);

    // Cleanup the timeout if slug changes before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [slug]);

  const { mutateAsync: updateOrganization, isPending } =
    useUpdateOrganizationService({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["getOrganizations"],
        });
        toast.success("Organização atualizada com sucesso!");

        if (data.slug !== organization.slug) {
          router.push(`/${data.slug}/settings`);
        }
      },
    });

  const { data: validSlug, isLoading: checkingSlug } =
    useFetchExistentSlugService(
      { slug: debouncedSlug },
      {
        enabled: organization.slug !== debouncedSlug && debouncedSlug !== "",
        queryKey: ["fetchExistentSlug", debouncedSlug],
      }
    );

  async function onSubmit(data: ChangeOrgSlugValues) {
    if (validSlug && !validSlug.hasOrganization) {
      await updateOrganization({
        slug: organization.slug,
        newSlug: data.newSlug,
      });
    }
  }

  useEffect(() => {
    if (validSlug && !validSlug.hasOrganization) {
      form.clearErrors("newSlug");
    }

    if (validSlug && validSlug.hasOrganization) {
      form.setError("newSlug", {
        type: "onBlur",
        message: "Slug já está em uso",
      });
    }
  }, [form, validSlug]);

  return { form, onSubmit, isPending, checkingSlug };
}
