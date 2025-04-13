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
import { formatToCurrency } from "@/lib/utils";
import Image from "next/image";
import useCreateItemForm from "./use-create-item-form";

export default function CreateItemForm() {
  const {
    form,
    onSubmit,
    categories,
    isLoadingCategories,
    setModal,
    getRootProps,
    getInputProps,
    imagePreview,
    handleRemoveImage,
    isCreatingItem,
    isUploadingImage,
  } = useCreateItemForm();

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
                      <div className="flex items-center space-x-4">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingCategories}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                isLoadingCategories 
                                  ? "Carregando categorias..." 
                                  : "Selecione uma categoria"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingCategories ? (
                              <SelectItem disabled value="loading">
                                Carregando categorias...
                              </SelectItem>
                            ) : categories?.length ? (
                              categories.map((category) => (
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

                        <Button
                          size="sm"
                          type="button"
                          onClick={() => setModal("create-category")}
                        >
                          <Icons.circlePlus className="size-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
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
                        <Input
                          placeholder="Informe o valor"
                          {...field}
                          onChange={(e) => {
                            const formattedValue = formatToCurrency(
                              e.currentTarget.value
                            );
                            field.onChange({
                              target: { value: formattedValue },
                            });
                          }}
                        />
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
                        <Input
                          placeholder="Informe o valor"
                          {...field}
                          onChange={(e) => {
                            const formattedValue = formatToCurrency(
                              e.currentTarget.value
                            );
                            field.onChange({
                              target: { value: formattedValue },
                            });
                          }}
                        />
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
                        <Input placeholder="Tamanho do Item" {...field} />
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
                        <Input placeholder="Cor do Item" {...field} />
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
                            if (field.value) {
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
                <CardTitle>Imagem do Item</CardTitle>
                <CardDescription>
                  Faça upload da imagem do item.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Imagem do Item"
                      className="w-full h-52 object-cover rounded-md"
                      width={300}
                      height={200}
                    />
                    <button
                      disabled={isCreatingItem || isUploadingImage}
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
                    >
                      <Icons.delete className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps({
                      className:
                        "border p-5 border-dashed cursor-pointer gap-y-2 border-border rounded-lg flex flex-col items-center justify-center w-full",
                    })}
                  >
                    <input
                      {...getInputProps()}
                      disabled={isCreatingItem || isUploadingImage}
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
          className="w-min mt-8"
          disabled={isCreatingItem || isUploadingImage}
        >
          {isCreatingItem || isUploadingImage ? (
            <Icons.loader className="animate-spin size-4 mr-2" />
          ) : (
            <Icons.circlePlus className="size-4 mr-2" />
          )}
          Criar Item
        </Button>
      </form>
    </Form>
  );
}
