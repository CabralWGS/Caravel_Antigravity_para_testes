import React from 'react';
import { ProcessedConfig, Transaction } from '../../types.ts';

// Styling Constants
const inputBase = 'block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-black';
const selectBase = inputBase;

interface TransactionEditFormProps {
    transaction: Transaction;
    config: ProcessedConfig;
    onSave: (transaction: Transaction) => void;
    onCancel: () => void;
    showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export const TransactionEditForm: React.FC<TransactionEditFormProps> = ({ transaction, config, onSave, onCancel, showToast }) => {
    const formId = `edit-form-${transaction.id}`;
    const [data, setData] = React.useState(transaction.data);
    const [categoriaId, setCategoriaId] = React.useState(transaction.categoria_id || '');
    const [valor, setValor] = React.useState(String(transaction.valor));
    const [contaOrigemId, setContaOrigemId] = React.useState(transaction.conta_origem_id || '');
    const [contaDestinoId, setContaDestinoId] = React.useState(transaction.conta_destino_id || '');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedValue = parseFloat(valor);
        if (!data || !valor || parsedValue <= 0) {
            showToast('Por favor, preenche a Data e o Valor (maior que zero).', 'error');
            return;
        }
        
        let updatedTx: Transaction = { ...transaction, data, valor: parsedValue };

        if (transaction.tipo === 'rendimento') {
            if (!categoriaId || !contaDestinoId) { showToast('Seleciona Categoria e Conta.', 'error'); return; }
            updatedTx = { ...updatedTx, categoria_id: categoriaId, conta_destino_id: contaDestinoId, conta_origem_id: null };
        } else if (transaction.tipo === 'despesa') {
            if (!categoriaId || !contaOrigemId) { showToast('Seleciona Categoria e Conta.', 'error'); return; }
            updatedTx = { ...updatedTx, categoria_id: categoriaId, conta_origem_id: contaOrigemId, conta_destino_id: null };
        } else { // transferencia
            if (!contaOrigemId || !contaDestinoId) { showToast('Seleciona ambas as Contas.', 'error'); return; }
            if (contaOrigemId === contaDestinoId) { showToast('As contas devem ser diferentes.', 'error'); return; }
            updatedTx = { ...updatedTx, categoria_id: null, conta_origem_id: contaOrigemId, conta_destino_id: contaDestinoId };
        }
        onSave(updatedTx);
    };

    const categories = transaction.tipo === 'rendimento' ? config.allIncomeCategories : config.allExpenseCategories;
    const today = new Date().toISOString().slice(0, 10);

    return (
        <form id={formId} onSubmit={handleSave} className="space-y-4 p-1">
             <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Data</label>
                    <input type="date" value={data} onChange={e => setData(e.target.value)} required max={today} className={inputBase}/>
                </div>

                {transaction.tipo === 'despesa' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Da Conta</label>
                            <select value={contaOrigemId} onChange={e => setContaOrigemId(e.target.value)} required className={selectBase}>
                                <option value="">Selecione...</option>
                                {config.allAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Categoria</label>
                            <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required className={selectBase}>
                                <option value="">Selecione...</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                    </>
                )}
                {transaction.tipo === 'rendimento' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Para a Conta</label>
                            <select value={contaDestinoId} onChange={e => setContaDestinoId(e.target.value)} required className={selectBase}>
                                <option value="">Selecione...</option>
                                {config.allAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Categoria</label>
                            <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required className={selectBase}>
                                <option value="">Selecione...</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                    </>
                )}
                {transaction.tipo === 'transferencia' && (
                     <>
                        <div>
                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Da Conta</label>
                            <select value={contaOrigemId} onChange={e => setContaOrigemId(e.target.value)} required className={selectBase}>
                                <option value="">Selecione...</option>
                                {config.allAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Para a Conta</label>
                            <select value={contaDestinoId} onChange={e => setContaDestinoId(e.target.value)} required className={selectBase}>
                                <option value="">Selecione...</option>
                                {config.allAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </select>
                        </div>
                    </>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Valor</label>
                    <input type="number" value={valor} onChange={e => setValor(e.target.value)} step="0.01" required placeholder="0.00" min="0" className={inputBase}/>
                </div>
            </div>
        </form>
    );
}
