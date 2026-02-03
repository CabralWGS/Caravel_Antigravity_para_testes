
export interface AuthError {
  message: string;
  status?: number;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: { [key: string]: any };
  app_metadata?: { [key: string]: any };
  aud?: string;
  created_at?: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY' | 'INITIAL_SESSION' | 'MFA_CHALLENGE_VERIFIED';

export type SignInWithPasswordCredentials = 
  | {
      email: string;
      password: string;
      options?: any;
    }
  | {
      phone: string;
      password: string;
      options?: any;
    };

export interface SignUpWithPasswordCredentials {
  email: string;
  password: string;
  options?: any;
}

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export interface Account {
  id: string; // uuid
  name: string;
  isActive: boolean;
}

export interface Category {
  id: string; // uuid
  name: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  tipo: 'rendimento' | 'despesa' | 'transferencia';
  data: string; // YYYY-MM-DD
  categoria_id: string | null; // The ID of the category, null for transfers
  valor: number;
  conta_origem_id?: string | null;
  conta_destino_id?: string | null;
}

export interface PatrimonioEntry {
  id: string;
  user_id: string;
  tipo: 'patrimonio';
  data: string; // YYYY-MM-DD (sempre o dia 01)
  total_patrimonio: number;
  account_values: { [accountId: string]: number };
}

export interface Config {
  app_title: string;
  user_name?: string;
  objetivo_label: string;
  objetivo_patrimonio: string;
  simbolo_moeda: string;
  incomeCategories: Category[];
  expenseCategories: Category[];
  accounts: Account[];
  has_completed_onboarding?: boolean;
}

export interface ProcessedConfig extends Omit<Config, 'incomeCategories' | 'expenseCategories' | 'accounts' | 'user_id' | 'has_completed_onboarding'> {
    activeIncomeCategories: Category[];
    activeExpenseCategories: Category[];
    activeAccounts: Account[];
    allAccounts: Account[];
    allIncomeCategories: Category[];
    allExpenseCategories: Category[];
}

// TAREFA 3: Definição de Tipos para Subscrição
export type SubscriptionStatus = 'free' | 'premium';

export interface UIContextType {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toast: ToastData | null;
    showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
    dismissToast: () => void;
}

export interface AuthContextType {
    session: Session | null;
    user: User | null;
    authEvent: AuthChangeEvent | null;
    isRecoveryMode: boolean;
    isLoadingAuth: boolean;
    subscriptionStatus: SubscriptionStatus; // Adicionado ao contexto
    signIn: (credentials: SignInWithPasswordCredentials) => Promise<{ error: AuthError | null }>;
    signUp: (credentials: SignUpWithPasswordCredentials) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
    resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
    confirmPasswordReset: (newPassword: string) => Promise<{ error: AuthError | null }>;
    updateUserEmail: (newEmail: string, passwordForVerification: string) => Promise<{ error: AuthError | null }>;
    updateUserPassword: (currentPassword: string, newPassword: string) => Promise<{ error: AuthError | null }>;
}

export interface DataContextType {
    config: Config;
    processedConfig: ProcessedConfig;
    transactions: Transaction[];
    patrimonioEntries: PatrimonioEntry[];
    isLoading: boolean;
    error: string | null;
    hasCompletedOnboarding: boolean;
    activeYear: number;
    setActiveYear: (year: number) => void;
    
    refreshData: () => Promise<void>;
    updateConfig: (newConfig: Partial<Config>) => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id'>) => Promise<string>;
    deleteTransaction: (id: string) => Promise<void>;
    updateTransaction: (updatedTransaction: Transaction) => Promise<void>;
    addPatrimonio: (patrimonio: Omit<PatrimonioEntry, 'id' | 'user_id'>) => Promise<string>;
    deletePatrimonioEntry: (id: string) => Promise<void>;
    updatePatrimonioEntry: (updatedEntry: PatrimonioEntry) => Promise<void>;
    exportData: () => void;
    deleteAllData: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

export interface AppContextType extends UIContextType, AuthContextType, DataContextType {}