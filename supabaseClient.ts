
import { createClient } from '@supabase/supabase-js';

// Acede diretamente às variáveis injetadas pelo Vite (via Netlify)
// Casting import.meta to any to avoid TS errors
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Verificação de segurança para desenvolvimento local e debugging
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ ERRO CRÍTICO: Variáveis de ambiente do Supabase em falta.');
    console.error('Verifica se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidos no Netlify ou .env');
}

export const supabase = createClient(
    supabaseUrl || '', 
    supabaseAnonKey || ''
);
