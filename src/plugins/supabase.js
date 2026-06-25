import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseAnonKey;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default (ctx, inject) => {
  inject("supabase", supabase);
};
