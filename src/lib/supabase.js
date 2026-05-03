import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aceviynvsorxjpcvjjya.supabase.co';
const supabaseKey = 'sb_publishable_K9uWxkrx9zQzhvo9b0m1vw_Z1cQ5Us1';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFileToSupabase = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('manga-storage')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('manga-storage')
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
};
