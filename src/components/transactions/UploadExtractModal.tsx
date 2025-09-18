import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addStagingItems, NewStagingItem } from "@/services/staging";

const N8N_WEBHOOK_URL = "https://your-n8n-webhook-url.com/placeholder"; // IMPORTANT: Replace with your actual n8n webhook URL
const MOCK_USER_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef"; // Replace with real user management later

interface UploadExtractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadExtractModal({ open, onOpenChange }: UploadExtractModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // This is a MOCK implementation. In a real scenario, you would
    // make a real HTTP request to your n8n webhook.
    try {
      // const formData = new FormData();
      // formData.append("file", selectedFile);
      // formData.append("userId", MOCK_USER_ID);

      // const response = await fetch(N8N_WEBHOOK_URL, {
      //   method: "POST",
      //   body: formData,
      // });
      // const suggestedItems: NewStagingItem[] = await response.json();

      // MOCK RESPONSE from n8n
      console.log("Simulating upload to n8n webhook...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      const mockSuggestedItems: NewStagingItem[] = [
        { user_id: MOCK_USER_ID, raw_payload: {}, date: '2024-12-15', description: 'Supermercado Extra', value: -250.80, status: 'Pendente', suggested_context: 'Pessoal', suggested_category_id: 1 },
        { user_id: MOCK_USER_ID, raw_payload: {}, date: '2024-12-12', description: 'UBER TRIP', value: -28.50, status: 'Pendente', suggested_context: 'Pessoal', suggested_category_id: 2 },
        { user_id: MOCK_USER_ID, raw_payload: {}, date: '2024-12-10', description: 'ACADEMIA SMARTFIT', value: -89.90, status: 'Pendente', suggested_context: 'Pessoal', suggested_category_id: 4, card_label: 'Cartão Nubank' },
      ];

      await addStagingItems(mockSuggestedItems);

      toast({
        title: "Upload Concluído!",
        description: "Seu extrato foi processado. Revise as transações sugeridas.",
      });

      onOpenChange(false);
      navigate("/staging");

    } catch (error) {
      toast({
        title: "Erro no Upload",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

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
                <div className="text-sm font-medium">Clique para selecionar ou arraste o arquivo aqui</div>
                <div className="text-xs text-muted-foreground mt-1">Suportados: .xlsx, .xls, .pdf (máximo 20MB)</div>
              </Label>
              <Input id="file-upload" type="file" accept=".xlsx,.xls,.pdf" onChange={handleFileSelect} className="hidden" />
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              {selectedFile.name.endsWith('.pdf') ? <FileText className="h-8 w-8 text-red-500" /> : <FileSpreadsheet className="h-8 w-8 text-green-500" />}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{selectedFile.name}</div>
                <div className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Processamento Automático</div>
            <div className="text-xs text-blue-700">Após o upload, a IA irá categorizar as transações. Você poderá revisar e aprovar na área de triagem.</div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>Cancelar</Button>
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</> : 'Fazer Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
