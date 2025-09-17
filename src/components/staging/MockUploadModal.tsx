import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Info } from "lucide-react"

interface MockUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MockUploadModal({ open, onOpenChange }: MockUploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Extrato (Mock)
          </DialogTitle>
          <DialogDescription>
            Simulação do processo de upload
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-900">
                Processo Real de Upload
              </div>
              <div className="text-sm text-blue-700">
                Na implementação real:
              </div>
              <ul className="text-xs text-blue-600 space-y-1 ml-4 list-disc">
                <li>Arquivo enviado via webhook para o n8n</li>
                <li>IA processa e categoriza automaticamente</li>
                <li>Linhas aparecem nesta tela para revisão</li>
                <li>Sugestões de contexto e categoria são geradas</li>
                <li>Você confirma ou ajusta antes de aprovar</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Esta é apenas uma simulação para demonstrar o fluxo da interface.
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}