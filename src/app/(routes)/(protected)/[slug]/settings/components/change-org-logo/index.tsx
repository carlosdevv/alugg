"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FloatingPanelBody,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelRoot,
  FloatingPanelTrigger,
  FloatingPanelCloseButton,
} from "@/components/ui/floating-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GetOrganizationResponse } from "@/http/organizations/types";
import { motion } from "framer-motion";
import Image from "next/image";
import useChangeOrgLogo from "./use-change-org-logo";

type ChangeOrgSlugFormProps = {
  organization: GetOrganizationResponse;
};

export default function ChangeOrgLogo({
  organization,
}: ChangeOrgSlugFormProps) {
  const {
    newImageMode,
    setNewImageMode,
    isUpdatingImage,
    isUploadingImage,
    imagePreview,
    getRootProps,
    getInputProps,
    image,
  } = useChangeOrgLogo({ organization });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center w-full justify-between">
          Imagem do Item
          {newImageMode && (
            <Button
              size="sm"
              type="submit"
              disabled={isUpdatingImage || isUploadingImage}
            >
              {isUpdatingImage ||
                (isUploadingImage && (
                  <Icons.loader className="animate-spin size-4 mr-2" />
                ))}
              Salvar
            </Button>
            // <Button
            //   variant="ghost"
            //   size="sm"
            //   className="ml-auto"
            //   onClick={() => setNewImageMode(false)}
            // >
            //   Exibir original
            // </Button>
          )}
        </CardTitle>
        <CardDescription>Faça upload da imagem do item.</CardDescription>
      </CardHeader>
      <CardContent>
        {organization.logo && !newImageMode && (
          <div className="relative">
            <Image
              src={organization.logo}
              alt="Logo da Organização"
              className="w-full h-52 object-cover rounded-md"
              width={300}
              height={200}
            />
            <button
              disabled={isUpdatingImage || isUploadingImage}
              onClick={() => setNewImageMode(true)}
              className="absolute top-2 right-2 bg-background text-white p-2 rounded-full shadow-md hover:bg-background/50 transition-colors"
            >
              <Icons.update className="size-4" />
            </button>
          </div>
        )}

        {/* {imagePreview && newImageMode && (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Imagem do Item"
              className="w-full h-40 object-cover rounded-md"
              width={1920}
              height={1080}
            />
            <button
              disabled={isUpdatingImage || isUploadingImage}
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
            >
              <Icons.delete className="size-4" />
            </button>
          </div>
        )} */}

        {newImageMode && (
          <div className="w-full h-auto relative">
            {imagePreview && (
              <Tooltip>
                <TooltipTrigger className="absolute right-2 top-2">
                  <FloatingPanelRoot>
                    <FloatingPanelTrigger
                      title="Preview da Logo"
                      className="bg-muted size-8 flex items-center justify-center"
                    >
                      <Icons.externalLink className="size-4" />
                    </FloatingPanelTrigger>
                    <FloatingPanelContent className="w-80">
                      <FloatingPanelBody>
                        <motion.img
                          src={imagePreview}
                          alt="image"
                          className="w-full h-auto rounded-md"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </FloatingPanelBody>
                      <FloatingPanelFooter>
                        <FloatingPanelCloseButton />
                      </FloatingPanelFooter>
                    </FloatingPanelContent>
                  </FloatingPanelRoot>
                </TooltipTrigger>
                <TooltipContent>Visualizar imagem</TooltipContent>
              </Tooltip>
            )}
            <div
              {...getRootProps({
                className:
                  "border p-5 border-dashed cursor-pointer gap-y-2 border-border rounded-lg flex flex-col items-center justify-center w-full",
              })}
            >
              <input
                {...getInputProps()}
                disabled={isUpdatingImage || isUploadingImage}
              />
              <Icons.image className="size-10 text-gray-400" />
              <span className="font-medium mt-2">
                {image[0] ? image[0].name : "Clique ou arraste a imagem aqui"}
              </span>
              {image[0] && (
                <p className="text-xs text-muted-foreground/80">
                  Clique para selecionar outra imagem
                </p>
              )}
              <span className="text-sm text-muted-foreground">
                Formatos aceitos: .jpg, .png, .jpeg
              </span>
              <span className="text-xs text-muted-foreground">
                Tamanho máximo: 10Mb
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
