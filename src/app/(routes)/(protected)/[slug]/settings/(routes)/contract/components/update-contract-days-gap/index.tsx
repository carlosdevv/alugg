import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import useUpdateContractDaysGap from "./use-update-contract-days-gap";

export default function UpdateContractDaysGap() {
  const {
    form,
    onSubmit,
    isLoading,
    isUpdatingContractSettings,
    handleIntegerInputChange,
    hasEmptyFields,
  } = useUpdateContractDaysGap();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Configurações do contrato</CardTitle>
            <CardDescription>
              Configure o período de dias em que os itens do contrato
              permanecerão indisponíveis antes e após a reserva.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col w-full gap-y-4">
            <div className="flex w-1/2 items-center justify-between gap-x-4">
              <FormField
                control={form.control}
                name="daysBefore"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dias antes da reserva</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        value={field.value}
                        onChange={(e) =>
                          handleIntegerInputChange(e, field.onChange)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="daysAfter"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dias após a reserva</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        value={field.value}
                        onChange={(e) =>
                          handleIntegerInputChange(e, field.onChange)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-zinc-900 flex items-center p-4 justify-end w-full rounded-b-xl">
            <Button
              type="submit"
              disabled={
                isLoading || isUpdatingContractSettings || hasEmptyFields
              }
            >
              {isUpdatingContractSettings ? (
                <>
                  <Icons.loader className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
