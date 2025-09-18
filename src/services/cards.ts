import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { createTransaction } from './transactions';
import { startOfMonth, addMonths, format } from 'date-fns';

export type Card = Tables<'cards'>;
export type NewCard = TablesInsert<'cards'>;
export type CardInvoice = Tables<'card_invoices'>;
export type CardInvoiceItem = Tables<'card_invoice_items'>;

// --- Cards CRUD ---
export const createCard = async (card: NewCard) => {
  const { data, error } = await supabase.from('cards').insert(card).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const getCards = async (userId: string) => {
  const { data, error } = await supabase.from('cards').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
};

export const updateCard = async (id: number, updates: TablesUpdate<'cards'>) => {
  const { data, error } = await supabase.from('cards').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteCard = async (id: number) => {
  const { error } = await supabase.from('cards').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
};

export const getCardByLabel = async (userId: string, label: string) => {
    const { data, error } = await supabase.from('cards').select('id').eq('user_id', userId).eq('label', label).single();
    if (error) {
        // It's okay if no card is found, just return null.
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
    }
    return data;
}

// --- Invoices ---
export const getInvoicesForCard = async (cardId: number) => {
    const { data, error } = await supabase.from('card_invoices').select('*').eq('card_id', cardId).order('month', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export const getInvoiceDetails = async (invoiceId: number) => {
    const { data, error } = await supabase
        .from('card_invoices')
        .select(`
            *,
            cards (label, due_day),
            card_invoice_items (
                *,
                transactions (*)
            )
        `)
        .eq('id', invoiceId)
        .single();
    if (error) throw new Error(error.message);
    return data;
}

// --- Business Logic ---

/**
 * Finds or creates an invoice for a given card and date.
 * The logic determines the correct invoice month based on the transaction date and card's closing day.
 */
export const findOrCreateInvoiceForTransaction = async (card_id: number, transaction_date: Date): Promise<CardInvoice> => {
    const card = await supabase.from('cards').select('closing_day').eq('id', card_id).single();
    if (card.error || !card.data) throw new Error("Card not found");

    let invoiceMonthDate = startOfMonth(transaction_date);
    if (transaction_date.getDate() > card.data.closing_day) {
        invoiceMonthDate = addMonths(invoiceMonthDate, 1);
    }
    const invoiceMonth = format(invoiceMonthDate, 'yyyy-MM');

    // Check if an invoice for this month already exists
    const { data: existingInvoice, error: existingError } = await supabase
        .from('card_invoices')
        .select('*')
        .eq('card_id', card_id)
        .eq('month', invoiceMonth)
        .single();

    if (existingError && existingError.code !== 'PGRST116') { // 'PGRST116' is "No rows found"
        throw new Error(existingError.message);
    }

    if (existingInvoice) {
        return existingInvoice;
    }

    // Create a new invoice if it doesn't exist
    const { data: newInvoice, error: newError } = await supabase
        .from('card_invoices')
        .insert({ card_id, month: invoiceMonth, status: 'Aberta' })
        .select()
        .single();

    if (newError || !newInvoice) throw new Error(newError?.message || "Could not create new invoice");

    return newInvoice;
}

/**
 * Creates a transaction and links it to a card invoice.
 * This is used when approving a staging item that is a card transaction.
 */
export const addTransactionToCardInvoice = async (transaction: TablesInsert<'transactions'>, card_id: number) => {
    // 1. Create the official transaction
    const newTransaction = await createTransaction(transaction);
    if (!newTransaction) throw new Error("Failed to create transaction");

    // 2. Find or create the correct invoice for this transaction's date
    const invoice = await findOrCreateInvoiceForTransaction(card_id, new Date(newTransaction.date));

    // 3. Create the invoice item linking the transaction to the invoice
    const { data: invoiceItem, error } = await supabase
        .from('card_invoice_items')
        .insert({
            card_invoice_id: invoice.id,
            transaction_id: newTransaction.id,
            installment_number: 1,
            installment_total: 1
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    return { newTransaction, invoice, invoiceItem };
}

export const updateInvoiceStatus = async (invoiceId: number, status: 'Aberta' | 'Fechada' | 'Paga') => {
    const { data, error } = await supabase
        .from('card_invoices')
        .update({ status })
        .eq('id', invoiceId)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data;
};

export const createInstallmentPurchase = async (
    userId: string,
    cardId: number,
    purchase: {
        date: Date;
        description: string;
        totalValue: number;
        installments: number;
        categoryId: number;
        context: 'Pessoal' | 'Empresa';
    }
) => {
    // This is a complex operation and requires careful implementation.
    // For now, this is a placeholder.
    console.log("Creating installment purchase:", { userId, cardId, purchase });
    // TODO:
    // 1. Create a "parent" transaction or a new entity to represent the installment plan.
    // 2. Loop from 1 to `purchase.installments`.
    // 3. For each installment, create a transaction record.
    // 4. For each transaction, find or create the correct future invoice.
    // 5. Create a `card_invoice_item` linking the transaction and the invoice.
    //    - Set `installment_of` to the parent plan ID.
    //    - Set `installment_number` and `installment_total`.
    // This should probably be a single database function (e.g., using plpgsql) for atomicity.

    alert("Função de parcelamento ainda não implementada.");
    return Promise.resolve();
};
