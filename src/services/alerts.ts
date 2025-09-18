import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, addDays, format } from 'date-fns';

export type UpcomingDueItem = {
  id: number;
  type: 'transaction' | 'invoice';
  description: string;
  dueDate: string;
  value: number;
  isOverdue: boolean;
  // These are needed for the "mark as paid" action
  sourceId: number;
  sourceType: 'transaction' | 'invoice';
};

export const getUpcomingDueItems = async (userId: string): Promise<UpcomingDueItem[]> => {
  const today = new Date();
  const sevenDaysFromNow = addDays(today, 7);

  const fromDate = format(startOfDay(today), 'yyyy-MM-dd');
  const toDate = format(endOfDay(sevenDaysFromNow), 'yyyy-MM-dd');

  // 1. Fetch upcoming fixed transactions
  const { data: dueTransactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('id, description, date, value, type')
    .eq('user_id', userId)
    .eq('status', 'Pendente')
    .is('fixed_item_id', true)
    .gte('date', fromDate)
    .lte('date', toDate);

  if (transactionsError) {
    console.error("Error fetching due transactions:", transactionsError);
    throw transactionsError;
  }

  // This part is complex and better suited for a database view or function.
  // For the MVP, we are skipping card invoice alerts as the query is too complex
  // to build efficiently on the client side without proper joins.

  const allItems: UpcomingDueItem[] = [];

  // Process transactions
  dueTransactions.forEach(t => {
    allItems.push({
      id: t.id,
      type: 'transaction',
      description: t.description,
      dueDate: t.date,
      value: t.value,
      isOverdue: new Date(t.date) < startOfDay(today),
      sourceId: t.id,
      sourceType: 'transaction',
    });
  });

  return allItems.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

export const markAsPaid = async (sourceId: number, sourceType: 'transaction' | 'invoice') => {
    if (sourceType === 'transaction') {
        const { data: transaction } = await supabase.from('transactions').select('type').eq('id', sourceId).single();
        const newStatus = transaction?.type === 'Receita' ? 'Recebido' : 'Pago';
        const { error } = await supabase.from('transactions').update({ status: newStatus }).eq('id', sourceId);
        if (error) throw error;
    } else { // sourceType === 'invoice'
        const { error } = await supabase.from('card_invoices').update({ status: 'Paga' }).eq('id', sourceId);
        if (error) throw error;
    }
    return true;
};
