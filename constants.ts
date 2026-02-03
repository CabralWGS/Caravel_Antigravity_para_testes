import { Config, Transaction } from './types.ts';

export const DEFAULT_CONFIG: Config = {
  app_title: "Caravel",
  user_name: "",
  objetivo_label: "A Tua Expedição",
  objetivo_patrimonio: "100000",
  simbolo_moeda: "€",
  has_completed_onboarding: false,
  incomeCategories: [
    { id: 'inc-001', name: 'Salário', isActive: true },
    { id: 'inc-002', name: 'Freelance', isActive: true },
    { id: 'inc-003', name: 'Investimentos', isActive: true },
    { id: 'inc-004', name: 'Outros', isActive: true },
  ],
  expenseCategories: [
    { id: 'exp-001', name: 'Alimentação', isActive: true },
    { id: 'exp-002', name: 'Transporte', isActive: true },
    { id: 'exp-003', name: 'Casa', isActive: true },
    { id: 'exp-004', name: 'Saúde', isActive: true },
    { id: 'exp-005', name: 'Lazer', isActive: true },
    { id: 'exp-006', name: 'Educação', isActive: true },
    { id: 'exp-007', name: 'Compras', isActive: true },
    { id: 'exp-008', name: 'Outros', isActive: true },
  ],
  // TAREFA 2: Reduzir contas iniciais para respeitar o limite do plano Free (máx 2)
  accounts: [
    { id: 'acc-001', name: 'Conta Principal', isActive: true },
    { id: 'acc-002', name: 'Conta Poupança', isActive: true },
  ]
};

export const CATEGORY_COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
    '#f97316', '#eab308', '#22c55e', '#ef4444',
    '#6366f1', '#d946ef', '#0ea5e9', '#f59e0b'
];

export const getCategoryColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

export const SUPABASE_TABLES = {
  CONFIG: 'config',
  TRANSACTIONS: 'transactions',
  PATRIMONIO: 'patrimonio_entries',
  PROFILES: 'profiles', // Nova tabela adicionada
};

export const handleAuthError = (errorMessage: string): string => {
    console.error('Supabase Auth Error:', errorMessage);
    const msg = errorMessage.toLowerCase();
    
    if (msg.includes('invalid login credentials')) {
        return 'Credenciais inválidas. Verifica o email, a password e se o Caps Lock está ativo.';
    }
     if (msg.includes('incorrect password')) {
        return 'A password fornecida está incorreta.';
    }
    if (msg.includes('user already registered')) {
        return 'Este email já está registado. Tenta entrar.';
    }
    if (msg.includes('email not confirmed')) {
        return 'Conta não confirmada. Por favor, verifica o teu email.';
    }
    if (msg.includes('password should be at least 6 characters')) {
        return 'A password deve ter pelo menos 6 caracteres.';
    }
    if (msg.includes('password is too weak') || msg.includes('password must contain')) {
        return 'A password é demasiado fraca. Verifica os requisitos.';
    }
    if (msg.includes('email rate limit exceeded')) {
        return 'Demasiadas tentativas. Tenta mais tarde.';
    }
    if (msg.includes('user not found')) {
        return 'Ocorreu um erro, utilizador não encontrado.';
    }
    
    return 'Ocorreu um erro inesperado. Por favor, tenta novamente.';
};


export const getTransactionDescription = (
  t: Transaction,
  accountMap: Map<string, string>,
  categoryMap: Map<string, string>
): string => {
  if (t.tipo === 'transferencia') {
    const from = t.conta_origem_id ? accountMap.get(t.conta_origem_id) : '?';
    const to = t.conta_destino_id ? accountMap.get(t.conta_destino_id) : '?';
    return `Transferência: ${from} → ${to}`;
  }

  const category = t.categoria_id ? categoryMap.get(t.categoria_id) || 'Desconhecido' : 'Desconhecido';

  let accountName: string | null = null;
  if (t.tipo === 'rendimento' && t.conta_destino_id) {
    accountName = accountMap.get(t.conta_destino_id) || null;
  } else if (t.tipo === 'despesa' && t.conta_origem_id) {
    accountName = accountMap.get(t.conta_origem_id) || null;
  }

  return accountName ? `${category} (${accountName})` : category;
};