import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { createTransaction } from "@/services/transactions";
import { getCategories, Category } from "@/services/categories";
import { NewTransaction } from "@/services/transactions";

interface NewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string; // Assuming we get the user ID as a prop
  onTransactionAdded?: () => void;
}

const formSchema = z.object({
  date: z.string().min(1, "A data é obrigatória."),
  description: z.string().min(1, "A descrição é obrigatória."),
  value: z.coerce.number().min(0.01, "O valor deve ser maior que zero."),
  type: z.enum(["Receita", "Despesa"], { required_error: "O tipo é obrigatório." }),
  context: z.enum(["Pessoal", "Empresa"], { required_error: "O contexto é obrigatório." }),
  category_id: z.coerce.number({ required_error: "A categoria é obrigatória." }),
  status: z.enum(["Pendente", "Pago", "Recebido"], { required_error: "O status é obrigatório." }),
});

export function NewTransactionModal({ open, onOpenChange, userId, onTransactionAdded }: NewTransactionModalProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      value: 0,
      type: "Despesa",
      context: "Pessoal",
      status: "Pendente",
    },
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    if (userId) {
      getCategories(userId).then(setCategories).catch(err => {
        toast({
          title: "Erro ao buscar categorias",
          description: err.message,
          variant: "destructive",
        });
      });
    }
  }, [userId, toast]);

  useEffect(() => {
    // Reset status based on type
    if (selectedType === 'Receita') {
      form.setValue('status', 'Pendente');
    } else {
      form.setValue('status', 'Pendente');
    }
  }, [selectedType, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newTransaction: NewTransaction = {
        ...values,
        user_id: userId,
      };
      await createTransaction(newTransaction);
      toast({
        title: "Sucesso!",
        description: "Transação salva.",
      });
      onTransactionAdded?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter(c => c.type === selectedType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova receita ou despesa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Despesa">Despesa</SelectItem>
                      <SelectItem value="Receita">Receita</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva a transação..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.map(cat => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contexto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o contexto" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pessoal">Pessoal</SelectItem>
                        <SelectItem value="Empresa">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedType === 'Receita' ? (
                        <>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Recebido">Recebido</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Pago">Pago</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Transação'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
