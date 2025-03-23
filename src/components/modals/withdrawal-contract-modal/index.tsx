"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatToCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useWithdrawalContractModal } from "./use-withdrawal-contract-modal";

type WithdrawalContractModalProps = {
  contractId: string;
};

export function WithdrawalContractModal({
  contractId,
}: WithdrawalContractModalProps) {
  const {
    open,
    setOpen,
    onClose,
    contractProps,
    isGeneratingPdf,
    processWithdrawal,
    handleWithdrawal,
    handleRedirectToUpdate,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isWithdrawalPending,
    withdrawalNotes,
    setWithdrawalNotes,
    customerProps,
    pendingAmount,
  } = useWithdrawalContractModal({ contractId });

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
            Retirada de contrato
          </h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-300">
            Protocolo de Entrega
          </p>
        </div>

        {contractProps && customerProps && (
          <div className="p-4 sm:px-16 overflow-y-auto max-h-[70vh]">
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
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-x-1">
                <span className="text-sm font-bold">Data retirada: </span>
                <p className="text-sm">
                  {format(contractProps.data.withdrawalDate, "dd/MM/yyyy")}
                </p>
              </div>
              <div className="flex gap-x-1">
                <span className="text-sm font-bold">Data de devolução: </span>
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
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Valor da locação
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ass.:
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {contractProps.data.rentedItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm">{item.item.name}</td>
                        <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm">{item.item.code}</td>
                        <td className="px-4 py-2 text-sm">
                          {formatToCurrency(item.finalValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discriminação dos itens retirados */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">
                Discriminação dos itens retirado:
              </h4>
              <Textarea
                value={withdrawalNotes}
                onChange={(e) => setWithdrawalNotes(e.target.value)}
                className="w-full h-24"
                placeholder="Adicione detalhes sobre a retirada dos itens..."
              />
            </div>

            {/* Cláusulas */}
            <div className="mb-6 text-xs">
              <p className="mb-2">
                DECLARO QUE OS ITENS SUPRA-CITADOS ESTÃO EM PERFEITO ESTADO E ME
                COMPROMETO A
              </p>
              <p className="mb-2">
                DEVOLVÊ-LOS CONFORME LOCAÇÃO, DECLARO ESTAR CIENTE QUE EVENTUAIS
                DANOS CAUSADOS NA
              </p>
              <p className="mb-2">
                PEÇA LOCADA ESTARÁ SUJEITO AO PAGAMENTO TOTAL OU PARCIAL DO BEM.
                DANOS ESTES SENDO SUJEIRA EXCESSIVA NA PEÇA, RASGADOS,
                QUEIMADURAS EM QUALQUER PARTE DO ITEM MANCHAS (DE ÓLEO, GRAXA,
                VINHO, TINTA DE PLUMAS, COLA, ETC). REFERENTE AO PAGAMENTO
                PARCIAL O VALOR SERÁ DEFINIDO DE ACORDO COM O DANO AO ITEM.
              </p>
              <p className="mb-2">
                NO CASO DE DETERIORAÇÃO QUE DE POSSÍVEL REPARAÇÃO, O LOCATÁRIO
                ARCARÁ COM AS DESPESAS PARA ESSE FIM. QUANDO NÃO HOUVER
                CONDIÇÕES DE REPARAÇÃO DO DANO CAUSADO, A CLIENTE PAGARÁ O VALOR
                DO PRODUTO CONFORME O CONTRATO DE LOCAÇÃO, INDEPENDENTEMENTE DO
                PAGAMENTO DA MULTA PREVISTA NAS CLÁUSULAS DESTE CONTRATO.
              </p>
            </div>

            {/* Valor a receber */}
            <div className="mb-6">
              <h4
                className={cn(
                  "font-medium mb-2",
                  pendingAmount > 0 && "text-red-500"
                )}
              >
                Falta receber: {formatToCurrency(pendingAmount)}
              </h4>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-800 border-gray-200">
          {pendingAmount > 0 && (
            <Button
              variant="outline"
              onClick={handleRedirectToUpdate}
              disabled={isWithdrawalPending || isGeneratingPdf}
            >
              Inserir/Alterar Pagamento
            </Button>
          )}
          <Button
            onClick={handleWithdrawal}
            disabled={isWithdrawalPending || isGeneratingPdf}
          >
            {isWithdrawalPending || isGeneratingPdf
              ? "Processando..."
              : "Realizar retirada"}
            {(isWithdrawalPending || isGeneratingPdf) && (
              <Icons.loader className="size-4 ml-2 animate-spin" />
            )}
          </Button>
        </div>
      </Modal>

      {/* Modal de confirmação para pagamentos pendentes */}
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
                Confirmação de retirada
              </DialogTitle>
              <DialogDescription className="sm:text-center">
                Existe um débito em haver nesta locação. Tem certeza que deseja
                realizar a retirada?
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={isWithdrawalPending || isGeneratingPdf}
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              disabled={isWithdrawalPending || isGeneratingPdf}
              type="button"
              className="flex-1"
              onClick={() => {
                setIsConfirmModalOpen(false);
                processWithdrawal();
              }}
            >
              Realizar retirada
              {(isWithdrawalPending || isGeneratingPdf) && (
                <Icons.loader className="size-4 ml-2 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
