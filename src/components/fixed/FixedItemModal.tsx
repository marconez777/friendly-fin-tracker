import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { getCategories, Category } from "@/services/categories";
import type { FixedItem, NewFixedItem } from "@/services/fixedItems";

interface FixedItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: FixedItem | null;
  onSave: (data: NewFixedItem | FixedItem) => void;
  userId: string;
}

const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória."),
  type: z.enum(["Receita", "Despesa"]),
  context: z.enum(["Pessoal", "Empresa"]),
  category_id: z.coerce.number(),
  value: z.coerce.number().min(0.01, "O valor deve ser maior que zero."),
  due_day: z.coerce.number().min(1).max(31),
  active: z.boolean(),
});

export function FixedItemModal({ open, onOpenChange, item, onSave, userId }: FixedItemModalProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    if (userId) {
      getCategories(userId)
        .then(setCategories)
        .catch(err => toast({ title: "Erro ao buscar categorias", description: err.message, variant: "destructive" }));
    }
  }, [userId, toast]);

  useEffect(() => {
    if (item) {
      form.reset({
        description: item.description,
        type: item.type,
        context: item.context,
        category_id: item.category_id,
        value: item.value,
        due_day: item.due_day,
        active: item.active,
      });
    } else {
      form.reset({
        description: "",
        type: "Despesa",
        context: "Pessoal",
        value: 0,
        due_day: 1,
        active: true,
      });
    }
  }, [item, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (item) {
      onSave({ ...item, ...values });
    } else {
      onSave({ ...values, user_id: userId });
    }
    onOpenChange(false);
  };

  const filteredCategories = categories.filter(c => c.type === selectedType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? 'Editar Item Fixo' : 'Novo Item Fixo'}</DialogTitle>
          <DialogDescription>
            {item ? 'Edite a despesa/receita fixa.' : 'Adicione uma nova despesa ou receita fixa.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl><Input placeholder="Ex: Aluguel, Salário..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Receita">Receita</SelectItem>
                      <SelectItem value="Despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}/>
              <FormField control={form.control} name="context" render={({ field }) => (
                <FormItem>
                  <FormLabel>Contexto</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Pessoal">Pessoal</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}/>
            </div>

            <FormField control={form.control} name="category_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                  <SelectContent>
                    {filteredCategories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}/>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="value" render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="due_day" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia Venc.</FormLabel>
                  <FormControl><Input type="number" min="1" max="31" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>

            <FormField control={form.control} name="active" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Ativo</FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}/>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
