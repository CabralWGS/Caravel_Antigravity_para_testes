
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode, useRef } from 'react';
import { supabase } from '../supabaseClient.ts';
import { DEFAULT_CONFIG, SUPABASE_TABLES } from '../constants.ts';
import { v4 as uuidv4 } from 'uuid';
import { Config, Transaction, PatrimonioEntry, DataContextType, ProcessedConfig } from '../types.ts';
import { useAuth } from './AuthContext.tsx';
import { useUI } from './UIContext.tsx';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isLoadingAuth } = useAuth();
    const { showToast } = useUI();
    
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [patrimonioEntries, setPatrimonioEntries] = useState<PatrimonioEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());

    // Primitives to prevent unnecessary re-renders
    const userId = user?.id;
    const userEmail = user?.email;

    const refreshData = useCallback(async () => {
        let mounted = true;

        if (!userId) {
            setConfig(DEFAULT_CONFIG);
            setTransactions([]);
            setPatrimonioEntries([]);
            setIsLoading(false);
            setError(null);
            return;
        };

        setIsLoading(true);
        setError(null);

        try {
            const startDate = `${activeYear - 1}-12-01`;
            const endDate = `${activeYear}-12-31`;

            // Executar pedidos em paralelo
            // ALTERAÇÃO: Património agora carrega TUDO (order by data), ignorando o ano fiscal.
            const [configRes, transactionsRes, patrimonioRes] = await Promise.all([
                supabase
                    .from(SUPABASE_TABLES.CONFIG)
                    .select('data')
                    .eq('user_id', userId)
                    .single(),
                
                supabase
                    .from(SUPABASE_TABLES.TRANSACTIONS)
                    .select('*')
                    .eq('user_id', userId)
                    .gte('data', startDate)
                    .lte('data', endDate),

                supabase
                    .from(SUPABASE_TABLES.PATRIMONIO)
                    .select('*')
                    .eq('user_id', userId)
                    .order('data', { ascending: true }) 
            ]);

            if (!userId) return; 

            // Processar Config
            if (configRes.error) {
                if (configRes.error.code !== 'PGRST116') {
                    console.error("Config fetch error:", configRes.error);
                }
                supabase
                    .from(SUPABASE_TABLES.CONFIG)
                    .insert({ data: DEFAULT_CONFIG, user_id: userId })
                    .then(({ error }) => {
                        if (error) console.error("Config creation failed:", error);
                    });
                
                setConfig(DEFAULT_CONFIG);
            } else if (configRes.data) {
                setConfig(configRes.data.data as Config);
            }

            // Processar Transações
            if (transactionsRes.error) {
                console.error("Transactions fetch failed:", transactionsRes.error);
                throw new Error("Falha ao carregar transações.");
            }
            
            const migratedTransactions = (transactionsRes.data || []).map((t: any) => {
                if (t.data) {
                    const { mes_ano, ...transactionData } = t;
                    return transactionData as Transaction;
                }
                if (t.mes_ano) {
                    const { mes_ano, ...transactionData } = t;
                    return { ...transactionData, data: `${t.mes_ano}-01` } as Transaction;
                }
                return t as Transaction;
            });
            setTransactions(migratedTransactions);

            // Processar Património
            if (patrimonioRes.error) {
                console.error("Patrimonio fetch failed:", patrimonioRes.error);
                throw new Error("Falha ao carregar património.");
            }
            
            const migratedPatrimonio = (patrimonioRes.data || []).map((p: any) => {
                 if (p.data) {
                    const { mes_ano, ...patrimonioData } = p;
                    return patrimonioData as PatrimonioEntry;
                }
                if (p.mes_ano) {
                        const { mes_ano, ...patrimonioData } = p;
                        return { ...patrimonioData, data: `${p.mes_ano}-01` } as PatrimonioEntry;
                }
                return p as PatrimonioEntry;
            });
            setPatrimonioEntries(migratedPatrimonio);

        } catch (error: any) {
            console.error("Error fetching data:", error);
            const msg = error.message?.includes('Failed to fetch') 
                ? 'Falha de comunicação com o servidor. Verifica a ligação à internet.' 
                : 'Erro ao carregar os dados.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [userId, activeYear]);

    useEffect(() => {
        if (!isLoadingAuth) {
            refreshData();
        }
    }, [isLoadingAuth, refreshData]);

    const updateConfig = useCallback(async (newConfig: Partial<Config>) => {
        if (!userId) {
            showToast('Utilizador não autenticado.', 'error');
            throw new Error('User not authenticated');
        }
        const updatedConfig = { ...config, ...newConfig };
        setConfig(updatedConfig);

        const { error } = await supabase
          .from(SUPABASE_TABLES.CONFIG)
          .update({ data: updatedConfig })
          .eq('user_id', userId);

        if (error) {
          console.error(error);
          showToast('Erro ao guardar configurações.', 'error');
          throw error;
        }
    }, [config, showToast, userId]);

    const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'user_id'>): Promise<string> => {
        if (!userId) {
            showToast('Utilizador não autenticado.', 'error');
            throw new Error('User not authenticated');
        }
        const newId = uuidv4();
        const newTransaction = { ...transaction, id: newId, user_id: userId };
        
        const txYear = parseInt(transaction.data.split('-')[0]);
        if (txYear === activeYear || (txYear === activeYear - 1 && transaction.data.endsWith('-12-31'))) {
             setTransactions(prev => [...prev, newTransaction]);
        }

        const payload = {
            id: newTransaction.id,
            user_id: newTransaction.user_id,
            tipo: newTransaction.tipo,
            data: newTransaction.data,
            categoria_id: newTransaction.categoria_id,
            valor: newTransaction.valor,
            conta_origem_id: newTransaction.conta_origem_id,
            conta_destino_id: newTransaction.conta_destino_id,
            mes_ano: newTransaction.data.slice(0, 7),
        };
        
        const { error } = await supabase.from(SUPABASE_TABLES.TRANSACTIONS).insert(payload);
        if (error) {
          console.error(error);
          showToast('Erro ao adicionar transação. Revertendo...', 'error');
          setTransactions(prev => prev.filter(t => t.id !== newId));
          throw error;
        }
        return newId;
    }, [showToast, userId, activeYear]);

    const deleteTransaction = useCallback(async (id: string) => {
        if (!userId) throw new Error('User not authenticated');
        const originalTransactions = [...transactions];
        
        setTransactions(prev => prev.filter(entry => entry.id !== id));
        
        const { error } = await supabase.from(SUPABASE_TABLES.TRANSACTIONS).delete().eq('id', id).eq('user_id', userId);
        if (error) {
            console.error(error);
            showToast('Erro ao eliminar. Revertendo...', 'error');
            setTransactions(originalTransactions);
            throw error;
        }
    }, [showToast, userId, transactions]);

    const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
        if (!userId) throw new Error('User not authenticated');
        const originalTransactions = [...transactions];
        
        const txYear = parseInt(updatedTransaction.data.split('-')[0]);
        const isVisible = txYear === activeYear || (txYear === activeYear - 1 && updatedTransaction.data.split('-')[1] === '12');

        if (isVisible) {
             setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
        } else {
             setTransactions(prev => prev.filter(t => t.id !== updatedTransaction.id));
        }

        const { id, user_id, ...rest } = updatedTransaction;
        const payload = { ...rest, mes_ano: updatedTransaction.data.slice(0, 7) };

        const { error } = await supabase.from(SUPABASE_TABLES.TRANSACTIONS).update(payload).eq('id', id).eq('user_id', userId);

        if (error) {
            console.error(error);
            showToast('Erro ao atualizar. Revertendo...', 'error');
            setTransactions(originalTransactions);
            throw error;
        }
    }, [showToast, userId, transactions, activeYear]);

    const addPatrimonio = useCallback(async (patrimonio: Omit<PatrimonioEntry, 'id' | 'user_id'>): Promise<string> => {
        if (!userId) {
            showToast('Utilizador não autenticado.', 'error');
            throw new Error('User not authenticated');
        }
        const newId = uuidv4();
        const newPatrimonio = { ...patrimonio, id: newId, user_id: userId };
        
        // ALTERAÇÃO: Atualiza sempre o estado local, pois agora carregamos todo o histórico
        setPatrimonioEntries(prev => [...prev, newPatrimonio]);

        const payload = { ...newPatrimonio, mes_ano: newPatrimonio.data.slice(0, 7) };
        
        const { error } = await supabase.from(SUPABASE_TABLES.PATRIMONIO).insert(payload);
        if (error) {
            console.error(error);
            showToast('Erro ao adicionar património. Revertendo...', 'error');
            setPatrimonioEntries(prev => prev.filter(p => p.id !== newId));
            throw error;
        }
        return newId;
    }, [showToast, userId]); // Remove dependency on activeYear

    const deletePatrimonioEntry = useCallback(async (id: string) => {
        if (!userId) throw new Error('User not authenticated');
        const originalEntries = [...patrimonioEntries];
        
        setPatrimonioEntries(prev => prev.filter(entry => entry.id !== id));

        const { error } = await supabase.from(SUPABASE_TABLES.PATRIMONIO).delete().eq('id', id).eq('user_id', userId);
        if (error) {
            console.error(error);
            showToast('Erro ao eliminar património. Revertendo...', 'error');
            setPatrimonioEntries(originalEntries);
            throw error;
        }
    }, [showToast, userId, patrimonioEntries]);

    const updatePatrimonioEntry = useCallback(async (updatedEntry: PatrimonioEntry) => {
        if (!userId) throw new Error('User not authenticated');
        const originalEntries = [...patrimonioEntries];

        // ALTERAÇÃO: Atualiza sempre o estado local
        setPatrimonioEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));

        const { id, user_id, ...rest } = updatedEntry;
        const payload = { ...rest, mes_ano: updatedEntry.data.slice(0, 7) };

        const { error } = await supabase.from(SUPABASE_TABLES.PATRIMONIO).update(payload).eq('id', id).eq('user_id', userId);

        if (error) {
            console.error(error);
            showToast('Erro ao atualizar património. Revertendo...', 'error');
            setPatrimonioEntries(originalEntries);
            throw error;
        }
    }, [showToast, userId, patrimonioEntries]);

    const exportData = useCallback(() => {
        if (!transactions.length && !patrimonioEntries.length) {
            showToast('Não existem dados para exportar.', 'warning');
            return;
        }

        const dataToExport = {
            metadata: {
                exportDate: new Date().toISOString(),
                appVersion: "1.0.0",
                user: userEmail
            },
            config,
            transactions,
            patrimonioEntries,
        };

        try {
            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `caravel_backup_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Exportação concluída com sucesso!', 'success');
        } catch (e) {
            console.error("Export failed:", e);
            showToast('Erro ao gerar o ficheiro de exportação.', 'error');
        }
    }, [transactions, patrimonioEntries, config, userEmail, showToast]);

    const deleteAllData = useCallback(async () => {
        if (!userId) throw new Error('User not authenticated');
        const [transactionsError, patrimonioError] = await Promise.all([
            supabase.from(SUPABASE_TABLES.TRANSACTIONS).delete().eq('user_id', userId),
            supabase.from(SUPABASE_TABLES.PATRIMONIO).delete().eq('user_id', userId),
        ]);
        if (transactionsError.error || patrimonioError.error) {
            console.error(transactionsError.error || patrimonioError.error);
            showToast('Ocorreu um erro ao apagar os dados.', 'error');
            throw new Error('Failed to delete data');
        }
        setTransactions([]);
        setPatrimonioEntries([]);
        showToast('Todos os dados foram apagados com sucesso.', 'success');
    }, [showToast, userId]);

    const completeOnboarding = useCallback(async () => {
        await updateConfig({ has_completed_onboarding: true });
    }, [updateConfig]);

    const processedConfig = useMemo((): ProcessedConfig => {
        const {
            app_title,
            objetivo_label,
            objetivo_patrimonio,
            simbolo_moeda,
            incomeCategories,
            expenseCategories,
            accounts,
        } = config;

        return {
            app_title,
            objetivo_label,
            objetivo_patrimonio,
            simbolo_moeda,
            activeIncomeCategories: incomeCategories.filter(c => c.isActive),
            activeExpenseCategories: expenseCategories.filter(c => c.isActive),
            activeAccounts: accounts.filter(a => a.isActive),
            allAccounts: accounts,
            allIncomeCategories: incomeCategories,
            allExpenseCategories: expenseCategories,
        };
    }, [config]);
    
    const hasCompletedOnboarding = useMemo(() => {
        if (transactions.length > 0 || patrimonioEntries.length > 0) {
            return true;
        }
        return !!config.has_completed_onboarding;
    }, [config.has_completed_onboarding, transactions.length, patrimonioEntries.length]);

    const value: DataContextType = useMemo(() => ({
        config,
        processedConfig,
        transactions,
        patrimonioEntries,
        isLoading,
        error,
        hasCompletedOnboarding,
        activeYear,
        setActiveYear,
        refreshData,
        updateConfig,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        addPatrimonio,
        deletePatrimonioEntry,
        updatePatrimonioEntry,
        exportData,
        deleteAllData,
        completeOnboarding
    }), [
        config, processedConfig, transactions, patrimonioEntries, isLoading, error,
        hasCompletedOnboarding, activeYear, setActiveYear, refreshData, updateConfig,
        addTransaction, deleteTransaction, updateTransaction, addPatrimonio,
        deletePatrimonioEntry, updatePatrimonioEntry, exportData, deleteAllData,
        completeOnboarding
    ]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
