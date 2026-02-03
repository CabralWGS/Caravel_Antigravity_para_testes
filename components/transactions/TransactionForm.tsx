import React, { useState } from 'react';
import { Card } from '../ui/Card.tsx';
import { ProcessedConfig, Transaction } from '../../types.ts';
import { Loader2, Info, AlertCircle } from 'lucide-react';

// Styling Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-5 py-2 text-sm';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';
const inputBase = 'block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-black';
const selectBase = inputBase;

type TransactionType = 'rendimento' | 'despesa' | 'transferencia';

interface TransactionFormProps {
    config: ProcessedConfig;
    onSubmit: (data: Omit<Transaction, 'id' | 'user_id'>) => Promise<string>;
    showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
    onSuccess: (newId: string) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ config, onSubmit, showToast, onSuccess }) => {
    const today = new Date().toISOString().slice(0, 10);
    const [activeTab, setActiveTab] = useState<TransactionType>('despesa');
    const [data, setData] = useState(today);
    const [valor, setValor] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [contaOrigemId, setContaOrigemId] = useState('');
    const [contaDestinoId, setContaDestinoId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const tabs: { id: TransactionType, label: string }[] = [
        { id: 'despesa', label: 'Despesa' },
        { id: 'rendimento', label: 'Rendimento' },
        { id: 'transferencia', label: 'Transferência' }
    ];

    const resetForm = () => {
        setValor('');
        setCategoriaId('');
        setContaOrigemId('');
        setContaDestinoId('');
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedValue = parseFloat(valor);
        if (!data || !valor || parsedValue <= 0) {
            showToast('Por favor, preenche a Data e o Valor (maior que zero).', 'error');
            return;
        }

        let transactionData: Omit<Transaction, 'id' | 'user_id'>;

        if (activeTab === 'rendimento') {
            if (!categoriaId || !contaDestinoId) {
                showToast('Por favor, seleciona uma Categoria e uma Conta de destino.', 'error');
                return;
            }
            transactionData = { tipo: 'rendimento', data, valor: parsedValue, categoria_id: categoriaId, conta_destino_id: contaDestinoId, conta_origem_id: null };
        } else if (activeTab === 'despesa') {
             if (!categoriaId || !contaOrigemId) {
                showToast('Por favor, seleciona uma Categoria e uma Conta de origem.', 'error');
                return;
            }
            transactionData = { tipo: 'despesa', data, valor: parsedValue, categoria_id: categoriaId, conta_origem_id: contaOrigemId, conta_destino_id: null };
        } else { // transferencia
            if (!contaOrigemId || !contaDestinoId) {
                showToast('Por favor, seleciona uma Conta de origem e uma de destino.', 'error');
                return;
            }
             if (contaOrigemId === contaDestinoId) {
                showToast('A conta de origem e destino não podem ser a mesma.', 'error');
                return;
            }
            transactionData = { tipo: 'transferencia', data, valor: parsedValue, categoria_id: null, conta_origem_id: contaOrigemId, conta_destino_id: contaDestinoId };
        }
        
        setIsLoading(true);
        try {
            const newId = await onSubmit(transactionData);
            resetForm();
            onSuccess(newId);
            const successMessage = activeTab === 'rendimento' ? 'Rendimento registado!' : activeTab === 'despesa' ? 'Despesa registada!' : 'Transferência registada!';
            showToast(successMessage, 'success');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); resetForm(); }}
                        className={`flex-1 group flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black ${
                            activeTab === tab.id
                                ? 'bg-white shadow-sm dark:bg-neutral-700 text-black dark:text-white'
                                : 'text-neutral-500 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-700/60'
                        }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div key={activeTab} className="animate-fade-in-scale">
                    {activeTab === 'transferencia' && (
                         <div className="flex items-start gap-3 p-3 mb-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-sm border border-orange-100 dark:border-orange-800">
                             <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                             <div>
                                <p className="font-bold">Apenas para transferências internas.</p>
                                <p className="mt-1">Se o dinheiro sair para uma conta externa (ex: pagamento ou empréstimo), regista como <span className="font-bold">Despesa</span> para não descalibrares a tua Bússola Financeira.</p>
                             </div>
                         </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Data</label>
                            <input type="date" value={data} onChange={e => setData(e.target.value)} required max={today} className={inputBase}/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Valor</label>
                            <input type="number" value={valor} onChange={e => setValor(e.target.value)} step="0.01" required placeholder="0.00" min="0" className={inputBase}/>
                        </div>

                        {activeTab === 'despesa' && (
                            <>
                                 <div>
                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Da Conta</label>
                                    <select value={contaOrigemId} onChange={e => setContaOrigemId(e.target.value)} required className={selectBase}>
                                        <option value="">Selecione...</option>
                                        {config.activeAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Categoria</label>
                                    <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required className={selectBase}>
                                        <option value="">Selecione...</option>
                                        {config.activeExpenseCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </>
                        )}
                        
                         {activeTab === 'rendimento' && (
                            <>
                                 <div>
                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Para a Conta</label>
                                    <select value={contaDestinoId} onChange={e => setContaDestinoId(e.target.value)} required className={selectBase}>
                                        <option value="">Selecione...</option>
                                        {config.activeAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Categoria</label>
                                    <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required className={selectBase}>
                                        <option value="">Selecione...</option>
                                        {config.activeIncomeCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        {activeTab === 'transferencia' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Da Conta</label>
                                    <select value={contaOrigemId} onChange={e => setContaOrigemId(e.target.value)} required className={selectBase}>
                                        <option value="">Selecione...</option>
                                        {config.activeAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Para a Conta</label>
                                    <select value={contaDestinoId} onChange={e => setContaDestinoId(e.target.value)} required className={selectBase}>
                                        <option value="">Selecione...</option>
                                        {config.activeAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                 </div>
                <div className="pt-2">
                    <button type="submit" disabled={isLoading} className={`${btnBase} ${btnSize} ${btnPrimary} w-full sm:w-auto`}>
                        {isLoading ? (
                            <><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />A guardar...</>
                        ) : ( `Registar ${tabs.find(t=>t.id === activeTab)?.label}` )}
                    </button>
                </div>
            </form>
        </Card>
    );
};