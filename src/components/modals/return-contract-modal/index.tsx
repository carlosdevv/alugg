"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatToCurrency, handleCurrencyInputChange } from "@/lib/utils";
import { format } from "date-fns";
import { useReturnContractModal } from "./use-return-contract-modal";

type ReturnContractModalProps = {
  contractId: string;
};

const paymentMethods = [
  {
    id: "PIX",
    name: "Pix",
  },
  {
    id: "CREDIT_CARD",
    name: "Cartão de Crédito",
  },
  {
    id: "DEBIT_CARD",
    name: "Cartão de Débito",
  },
  {
    id: "BANK_TRANSFER",
    name: "Transferência Bancária",
  },
  {
    id: "CASH",
    name: "Dinheiro",
  },
];

export function ReturnContractModal({ contractId }: ReturnContractModalProps) {
  const {
    open,
    setOpen,
    onClose,
    contractProps,
    isGeneratingPdf,
    processReturn,
    handleReturn,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isReturnPending,
    returnNotes,
    setReturnNotes,
    customerProps,
    shouldChargeFine,
    setShouldChargeFine,
    finePaymentMethod,
    setFinePaymentMethod,
    fineValue,
    setFineValue,
    creditParcelAmount,
    setCreditParcelAmount,
  } = useReturnContractModal({ contractId });

  return (
    <>
      <Modal
        showModal={open}
        setShowModal={setOpen}
        onClose={onClose}
        className="max-w-[calc(100vw-10%)] max-h-[calc(100vh-10%)]"
      >
        <div className="flex flex-col border-b dark:border-gray-800 border-gray-200 p-4 pt-8 sm:px-16">
          <h3 className="text-lg font-medium text-center">
            Devolução de contrato
          </h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-300">
            Protocolo de Devolução
          </p>
        </div>

        {contractProps && customerProps && (
          <div className="p-4 sm:px-16 overflow-y-auto h-full max-h-[70vh]">
            {/* Informações do cliente */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">
                Nome do cliente: {customerProps.name}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-1">
                    <span className="text-sm font-bold">Data do Evento: </span>
                    <p className="text-sm">
                      {format(contractProps.data.eventDate, "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="flex gap-x-1">
                    <span className="text-sm font-bold">CPF: </span>
                    <p className="text-sm">{customerProps.document}</p>
                  </div>
                  <div className="flex gap-x-1">
                    <span className="text-sm font-bold">Telefone: </span>
                    <p className="text-sm">{customerProps.phone}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-1">
                    <span className="text-sm font-bold">RG: </span>
                    <p className="text-sm">{customerProps.secondDocument}</p>
                  </div>
                  <div className="flex gap-x-1">
                    <span className="text-sm font-bold">Email: </span>
                    <p className="text-sm">{customerProps.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-1">
                    <span className="text-sm font-bold">Estado: </span>
                    <p className="text-sm">{customerProps.state}</p>
                  </div>
                  <div className="flex gap-x-1">
                    <span className="text-sm font-bold">Bairro: </span>
                    <p className="text-sm">{customerProps.neighborhood}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Datas do contrato */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-x-1">
                <span className="text-sm font-bold">
                  Data marcada para entrega:{" "}
                </span>
                <p className="text-sm">
                  {format(contractProps.data.withdrawalDate, "dd/MM/yyyy")}
                </p>
              </div>
              <div className="flex gap-x-1">
                <span className="text-sm font-bold">Data retirada: </span>
                <p className="text-sm">
                  {format(contractProps.data.withdrawalDate, "dd/MM/yyyy")}
                </p>
              </div>
              <div className="flex gap-x-1">
                <span className="text-sm font-bold">
                  Data marcada de devolução:
                </span>
                <p className="text-sm">
                  {format(contractProps.data.returnDate, "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            {/* Itens do contrato */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Objeto da locação</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {contractProps.data.rentedItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm">{item.item.name}</td>
                        <td className="px-4 py-2 text-sm">{item.item.code}</td>
                        <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm">
                          {formatToCurrency(item.finalValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discriminação dos itens devolvidos */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">
                Discriminação dos itens devolvidos:
              </h4>
              <Textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                className="w-full h-24"
                placeholder="Adicione detalhes sobre a devolução dos itens..."
              />
            </div>

            {/* Opção de multa */}
            <div className="mb-6 flex items-center space-x-2">
              <Checkbox
                id="chargeFine"
                checked={shouldChargeFine}
                onCheckedChange={(checked) =>
                  setShouldChargeFine(checked === true)
                }
              />
              <label
                htmlFor="chargeFine"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cobrar multa
              </label>
            </div>

            {/* Detalhes da multa - visível apenas quando shouldChargeFine é true */}
            {shouldChargeFine && (
              <div className="mb-6 p-4 border rounded-md">
                <h4 className="font-medium mb-4">Detalhes da Multa</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Método de Pagamento */}
                  <div className="flex flex-col">
                    <label className="text-xs mb-2">Método de Pagamento</label>
                    <Select
                      value={finePaymentMethod}
                      onValueChange={setFinePaymentMethod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Valor */}
                  <div className="flex flex-col">
                    <label className="text-xs mb-2">Valor</label>
                    <div className="relative w-full">
                      <Input
                        className="peer ps-9"
                        placeholder="0,00"
                        value={fineValue.toFixed(2).replace(".", ",")}
                        onChange={(e) => {
                          handleCurrencyInputChange(e, (value) => {
                            setFineValue(value);
                          });
                        }}
                      />
                      <div className="text-muted-foreground/80 text-xs pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        R$
                      </div>
                    </div>
                  </div>

                  {/* Parcelas (apenas para cartão de crédito) */}
                  {finePaymentMethod === "CREDIT_CARD" && (
                    <div className="flex flex-col">
                      <label className="text-xs mb-2">Parcelas</label>
                      <Input
                        type="number"
                        min={1}
                        max={99}
                        value={creditParcelAmount}
                        onChange={(e) =>
                          setCreditParcelAmount(
                            Math.min(Math.max(1, Number(e.target.value)), 99)
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-800 border-gray-200">
          <Button
            onClick={handleReturn}
            disabled={
              isReturnPending ||
              isGeneratingPdf ||
              (shouldChargeFine && fineValue <= 0)
            }
          >
            {isReturnPending || isGeneratingPdf
              ? "Processando..."
              : "Realizar devolução"}
            {(isReturnPending || isGeneratingPdf) && (
              <Icons.loader className="size-4 ml-2 animate-spin" />
            )}
          </Button>
        </div>
      </Modal>

      {/* Modal de confirmação se necessário */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
              aria-hidden="true"
            >
              <Icons.circleAlert className="opacity-80 size-4" />
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">
                Confirmação de devolução
              </DialogTitle>
              <DialogDescription className="sm:text-center">
                Tem certeza que deseja registrar a devolução deste contrato?
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={isReturnPending || isGeneratingPdf}
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              disabled={
                isReturnPending ||
                isGeneratingPdf ||
                (shouldChargeFine && fineValue <= 0)
              }
              type="button"
              className="flex-1"
              onClick={() => {
                setIsConfirmModalOpen(false);
                processReturn();
              }}
            >
              Confirmar devolução
              {(isReturnPending || isGeneratingPdf) && (
                <Icons.loader className="size-4 ml-2 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
