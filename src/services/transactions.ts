import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Transaction = Tables<'transactions'> & { categories: { name: string } | null };
export type NewTransaction = TablesInsert<'transactions'>;

export type GetTransactionsOptions = {
  page?: number;
  pageSize?: number;
  filters?: {
    period?: { from: string; to: string };
    category_id?: number;
    context?: 'Pessoal' | 'Empresa';
    status?: 'Pendente' | 'Pago' | 'Recebido';
  };
};

export const createTransaction = async (transaction: NewTransaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getTransactions = async (options: GetTransactionsOptions = {}) => {
  const { page = 1, pageSize = 10, filters = {} } = options;
  let query = supabase.from('transactions').select('*, categories(name)', { count: 'exact' });

  if (filters.period) {
    query = query.gte('date', filters.period.from).lte('date', filters.period.to);
  }
  if (filters.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if (filters.context) {
    query = query.eq('context', filters.context);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error, count } = await query
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw new Error(error.message);
  }

  return { data, count };
};

export const updateTransaction = async (id: number, updates: TablesUpdate<'transactions'>) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction:', error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteTransaction = async (id: number) => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw new Error(error.message);
  }

  return true;
};

export type MonthlyBalance = {
  recebido: number;
  aReceber: number;
  aPagar: number;
  saldo: number;
};

export const getMonthlyBalance = async (
  userId: string,
  month: { from: string; to: string },
  context?: 'Pessoal' | 'Empresa'
): Promise<MonthlyBalance> => {

  let queryRecebido = supabase
    .from('transactions')
    .select('value')
    .eq('user_id', userId)
    .eq('type', 'Receita')
    .eq('status', 'Recebido')
    .gte('date', month.from)
    .lte('date', month.to);

  let queryAReceber = supabase
    .from('transactions')
    .select('value')
    .eq('user_id', userId)
    .eq('type', 'Receita')
    .eq('status', 'Pendente')
    .gte('date', month.from)
    .lte('date', month.to);

  let queryAPagar = supabase
    .from('transactions')
    .select('value')
    .eq('user_id', userId)
    .eq('type', 'Despesa')
    .eq('status', 'Pendente')
    .gte('date', month.from)
    .lte('date', month.to);

  if (context) {
    queryRecebido = queryRecebido.eq('context', context);
    queryAReceber = queryAReceber.eq('context', context);
    queryAPagar = queryAPagar.eq('context', context);
  }

  const [
    { data: recebidoData, error: recebidoError },
    { data: aReceberData, error: aReceberError },
    { data: aPagarData, error: aPagarError }
  ] = await Promise.all([
    queryRecebido,
    queryAReceber,
    queryAPagar
  ]);

  if (recebidoError || aReceberError || aPagarError) {
    console.error("Error fetching monthly balance:", { recebidoError, aReceberError, aPagarError });
    throw new Error("Could not fetch monthly balance data.");
  }

  const recebido = recebidoData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const aReceber = aReceberData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const aPagar = aPagarData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const saldo = recebido - aPagar;

  return { recebido, aReceber, aPagar, saldo };
};
