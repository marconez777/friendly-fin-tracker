import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { createTransaction } from './transactions';
import { format } from 'date-fns';

export type FixedItem = Tables<'fixed_items'>;
export type NewFixedItem = TablesInsert<'fixed_items'>;

export const createFixedItem = async (item: NewFixedItem) => {
  const { data, error } = await supabase
    .from('fixed_items')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('Error creating fixed item:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getFixedItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('fixed_items')
    .select('*, categories(name)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching fixed items:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateFixedItem = async (id: number, updates: TablesUpdate<'fixed_items'>) => {
  const { data, error } = await supabase
    .from('fixed_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating fixed item:', error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteFixedItem = async (id: number) => {
  const { error } = await supabase.from('fixed_items').delete().eq('id', id);

  if (error) {
    console.error('Error deleting fixed item:', error);
    throw new Error(error.message);
  }

  return true;
};

// This function should be called once per month for each user, e.g., on their first app visit of the month.
export const generateMonthlyTransactions = async (userId: string) => {
  const today = new Date();
  const currentMonth = format(today, 'yyyy-MM');
  const lastRunKey = `last_generation_${userId}_${currentMonth}`;

  // Prevent multiple runs in the same month for the same user
  if (localStorage.getItem(lastRunKey)) {
    console.log("Monthly transactions already generated for this month.");
    return;
  }

  const { data: activeItems, error } = await supabase
    .from('fixed_items')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true);

  if (error) {
    console.error("Error fetching active fixed items:", error);
    throw error;
  }

  const generationPromises = activeItems.map(item => {
    const dueDate = new Date(today.getFullYear(), today.getMonth(), item.due_day);
    const newTransaction: TablesInsert<'transactions'> = {
      user_id: userId,
      date: format(dueDate, 'yyyy-MM-dd'),
      description: `Lançamento fixo: ${item.description}`,
      type: item.type,
      context: item.context,
      category_id: item.category_id,
      value: item.value,
      status: 'Pendente',
      fixed_item_id: item.id,
    };
    return createTransaction(newTransaction);
  });

  await Promise.all(generationPromises);

  localStorage.setItem(lastRunKey, 'done');
  console.log(`${generationPromises.length} monthly transactions generated.`);
};
