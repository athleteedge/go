import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ukodlvfoiwdfvkrenhft.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_kmXoMqhnlmV2jI0ysTfrdg_QeaQ0wtn'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)