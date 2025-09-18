import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { createTransaction } from './transactions';

export type StagingItem = Tables<'staging_items'>;
export type NewStagingItem = TablesInsert<'staging_items'>;

export const getStagingItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('staging_items')
    .select('*, categories(name)')
    .eq('user_id', userId)
    .eq('status', 'Pendente');

  if (error) {
    console.error('Error fetching staging items:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateStagingItem = async (id: number, updates: TablesUpdate<'staging_items'>) => {
  const { data, error } = await supabase
    .from('staging_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating staging item:', error);
    throw new Error(error.message);
  }

  return data;
};

// This function is called after n8n processes the file and returns suggestions.
// For the purpose of this task, we assume this function receives the data from n8n.
export const addStagingItems = async (items: NewStagingItem[]) => {
    const { data, error } = await supabase
        .from('staging_items')
        .insert(items)
        .select();

    if (error) {
        console.error('Error adding staging items:', error);
        throw new Error(error.message);
    }

    return data;
}

type ApprovedItem = {
    id: number;
    decided_context: 'Pessoal' | 'Empresa';
    decided_category_id: number;
};

import { getCardByLabel, addTransactionToCardInvoice } from './cards';

export const approveStagingItems = async (userId: string, itemsToApprove: ApprovedItem[]) => {
  // Update the status of all items first
  const updatePromises = itemsToApprove.map(item =>
    updateStagingItem(item.id, {
      decided_context: item.decided_context,
      decided_category_id: item.decided_category_id,
      status: 'Aprovado',
    })
  );
  await Promise.all(updatePromises);

  // Fetch the full staging items after updating them
  const { data: fullStagingItems, error } = await supabase
    .from('staging_items')
    .select('*')
    .in('id', itemsToApprove.map(i => i.id));

  if (error) {
    console.error("Could not fetch updated staging items for transaction creation.");
    throw error;
  }

  const transactionPromises = fullStagingItems.map(async item => {
    const transactionData = {
      user_id: userId,
      date: item.date,
      description: item.description,
      value: item.value,
      context: item.decided_context as 'Pessoal' | 'Empresa',
      category_id: item.decided_category_id as number,
      type: item.value >= 0 ? 'Receita' : 'Despesa',
      status: 'Pendente' as const,
    };

    if (item.card_label) {
      const card = await getCardByLabel(userId, item.card_label);
      if (card) {
        // This is a card transaction, handle it with the card service
        return addTransactionToCardInvoice(transactionData, card.id);
      } else {
        // Card label exists but card not found, create a regular transaction for now
        console.warn(`Card with label "${item.card_label}" not found. Creating a regular transaction.`);
        return createTransaction(transactionData);
      }
    } else {
      // Regular transaction
      return createTransaction(transactionData);
    }
  });

  const results = await Promise.all(transactionPromises);

  return results;
};


export const ignoreStagingItems = async (itemIds: number[]) => {
    const { data, error } = await supabase
        .from('staging_items')
        .update({ status: 'Ignorado' })
        .in('id', itemIds)
        .select();

    if (error) {
        console.error('Error ignoring staging items:', error);
        throw new Error(error.message);
    }

    return data;
};
