import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Category = Tables<'categories'>;

export const getCategories = async (userId: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true);

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message);
  }

  return data;
};
