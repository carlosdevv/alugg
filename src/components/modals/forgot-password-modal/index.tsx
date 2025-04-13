"use client";

import { Button } from "@/components/ui/button";
import { DubButton } from "@/components/ui/dub-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import useForgotPasswordModal from "./use-forgot-password-modal";

export default function ForgotPasswordModal() {
  const { isOpen, onClose, setIsOpen, isPending, email, setEmail, onSubmit } =
    useForgotPasswordModal();

  return (
    <Modal showModal={isOpen} setShowModal={setIsOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b dark:border-gray-800 border-gray-200 p-4 pt-8 sm:px-16">
        <h3 className="text-lg font-medium">Esqueceu sua senha?</h3>
        <p className="text-sm text-gray-500 text-center">
          Digite o email associado à sua conta e receba um link para redefinir
          sua senha.
        </p>
      </div>

      <div className="flex flex-col space-y-6 text-left p-8 pb-4">
        <div className="flex flex-col space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <DubButton
            type="submit"
            disabled={isPending}
            loading={isPending}
            text="Enviar"
            onClick={onSubmit}
          />
          <Button
            type="button"
            variant="link"
            className="w-min p-0 self-center text-muted-foreground"
            onClick={onClose}
          >
            Voltar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
