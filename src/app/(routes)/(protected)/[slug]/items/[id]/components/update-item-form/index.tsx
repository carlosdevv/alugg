"use client";

import checkIfCodeExistsAction from "@/actions/check-if-code-exists";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GetCategoriesResponse } from "@/http/category/types";
import type { ItemProps } from "@/http/items/types";
import Image from "next/image";
import useUpdateItemForm from "./use-update-item-form";

type UpdateItemFormProps = {
  itemProps: ItemProps;
  categoriesResponse?: GetCategoriesResponse;
  id: string;
  slug: string;
};

export default function UpdateItemForm({
  itemProps: item,
  categoriesResponse,
  id,
  slug,
}: UpdateItemFormProps) {
  const {
    form,
    onSubmit,
    getRootProps,
    getInputProps,
    isUpdatingImage,
    isUploadingImage,
    handleRemoveImage,
    newImageMode,
    setNewImageMode,
    imagePreview,
  } = useUpdateItemForm({ item, id, slug });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes</CardTitle>
                <CardDescription>
                  Informações básicas sobre o item.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do Item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesResponse?.categories.length ? (
                            categoriesResponse?.categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="no-category">
                              Nenhuma categoria disponível
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="Informe a quantidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objectPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Objeto *</FormLabel>
                      <FormControl>
                        <Input placeholder="Informe o valor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rentPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Aluguel *</FormLabel>
                      <FormControl>
                        <Input placeholder="Informe o valor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
                <CardDescription>Informações não obrigatórias.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamanho</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tamanho do Item"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? null : e.target.value
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cor do Item"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição do Item"
                          className="min-h-32"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Item</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Código do Item"
                          {...field}
                          onBlur={async () => {
                            form.clearErrors("code");
                            if (field.value && field.value !== item.code) {
                              const existsCode = await checkIfCodeExistsAction(
                                field.value
                              );

                              if (existsCode) {
                                form.setError("code", {
                                  message: "Código já está em uso, tente outro",
                                });
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="itemInRepair"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Item em Reparo</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value === true ? "true" : "false"}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal">Sim</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">Não</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="itemInactive"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Item Inativo</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value === true ? "true" : "false"}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal">Sim</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">Não</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center w-full">
                  Imagem do Item
                  {newImageMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => setNewImageMode(false)}
                    >
                      Exibir original
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Faça upload da imagem do item.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {item.imageUrl && !newImageMode && (
                  <div className="relative">
                    <Image
                      src={item.imageUrl}
                      alt="Imagem do Item"
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

                {imagePreview && newImageMode && (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Imagem do Item"
                      className="w-full h-52 object-cover rounded-md"
                      width={300}
                      height={200}
                    />
                    <button
                      disabled={isUpdatingImage || isUploadingImage}
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
                    >
                      <Icons.delete className="size-4" />
                    </button>
                  </div>
                )}

                {newImageMode && !imagePreview && (
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
                      Clique ou arraste a imagem aqui
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Formatos aceitos: .jpg, .png, .jpeg
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Tamanho máximo: 10Mb
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Button
          type="submit"
          className="w-min my-8"
          disabled={isUpdatingImage || isUploadingImage}
        >
          {isUpdatingImage || isUploadingImage ? (
            <Icons.loader className="size-4 mr-2 animate-spin" />
          ) : (
            <Icons.update className="size-4 mr-2" />
          )}
          Atualizar Item
        </Button>
      </form>
    </Form>
  );
}
