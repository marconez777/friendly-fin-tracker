import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, FileText } from "lucide-react"

interface UploadExtractModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadExtractModal({ open, onOpenChange }: UploadExtractModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    // Mock upload - just close modal
    console.log("Uploading file:", selectedFile?.name)
    onOpenChange(false)
    setSelectedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload de Extrato</DialogTitle>
          <DialogDescription>
            Faça upload do seu extrato bancário em formato Excel (.xlsx) ou PDF
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-sm font-medium">
                  Clique para selecionar ou arraste o arquivo aqui
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Suportados: .xlsx, .xls, .pdf (máximo 20MB)
                </div>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              {selectedFile.name.endsWith('.pdf') ? (
                <FileText className="h-8 w-8 text-red-500" />
              ) : (
                <FileSpreadsheet className="h-8 w-8 text-green-500" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">
              Processamento Automático
            </div>
            <div className="text-xs text-blue-700">
              Após o upload, a IA irá categorizar automaticamente as transações. 
              Você poderá revisar e aprovar na área de triagem.
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile}>
              Fazer Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}