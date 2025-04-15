"use client";

import { Button } from "@/components/ui/button";
import { DubButton } from "@/components/ui/dub-button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { appRoutes } from "@/lib/constants";
import { AlertCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GlobalErrorPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [errorReport, setErrorReport] = useState("");

  const handleSubmitReport = () => {
    console.log("Relatório de erro enviado:", errorReport);
    setErrorReport("");
    setOpen(false);
    alert("Obrigado por relatar este erro!");
  };

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
          <div className="flex flex-col items-center text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h1 className="text-3xl font-bold mb-2">
              Ocorreu um erro inesperado
            </h1>
            <p className="text-muted-foreground mb-6">
              Lamentamos pelo inconveniente. Nossa equipe foi notificada, mas
              você também pode relatar este problema para nos ajudar a
              resolvê-lo mais rapidamente.
            </p>
            <div className="flex gap-4">
              <DubButton
                title="Voltar para a página inicial"
                onClick={() => router.push(appRoutes.onboarding)}
              />
            </div>
          </div>

          {/* Botão flutuante para reportar erro */}
          <Button
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>

          {/* Modal para reportar erro */}
          <Modal isOpen={open} setShowModal={setOpen} className="sm:max-w-md">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Reportar erro</h1>
              <p className="text-sm text-muted-foreground">
                Por favor, descreva o que estava fazendo quando o erro ocorreu.
                Isso nos ajudará a identificar e corrigir o problema mais
                rapidamente.
              </p>
            </div>

            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Descreva o que estava tentando fazer quando o erro ocorreu..."
                value={errorReport}
                onChange={(e) => setErrorReport(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleSubmitReport}>
                Enviar relatório
              </Button>
            </div>
          </Modal>
        </div>
      </body>
    </html>
  );
}
