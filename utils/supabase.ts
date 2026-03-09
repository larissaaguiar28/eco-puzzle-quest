import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rmdjbtjumvyjdksultud.supabase.co"
const supabaseKey = "sb_publishable_BmLvVJSf6Pc_iia4FwtgFg_6fYwloOe"

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase