import React from 'react';
import { Transaction } from '../../types.ts';
import { ArrowDown, ArrowUp, Pencil, Trash2, FilterX } from 'lucide-react';
import { getTransactionDescription } from '../../constants.ts';

type TransactionType = 'rendimento' | 'despesa' | 'transferencia';
export type SortableKeys = keyof Pick<Transaction, 'data' | 'categoria_id' | 'valor'>;

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string, type: TransactionType) => void;
    onEdit: (transaction: Transaction) => void;
    currencySymbol: string;
    categoryMap: Map<string, string>;
    accountMap: Map<string, string>;
    deletingId: string | null;
    newlyAddedId: string | null;
    sortConfig: { key: SortableKeys; direction: 'asc' | 'desc' } | null;
    requestSort: (key: SortableKeys) => void;
    emptyStateMessage: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
    transactions, 
    onDelete, 
    onEdit, 
    currencySymbol, 
    categoryMap, 
    accountMap, 
    deletingId, 
    newlyAddedId, 
    sortConfig, 
    requestSort, 
    emptyStateMessage 
}) => {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-full mb-4">
                    <FilterX className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-neutral-900 dark:text-neutral-100 font-medium">Nada para mostrar aqui.</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">{emptyStateMessage}</p>
            </div>
        );
    }

    const SortableHeader: React.FC<{ sortKey: SortableKeys, label: string, className?: string }> = ({ sortKey, label, className }) => {
        const isSorted = sortConfig?.key === sortKey;
        const direction = isSorted ? sortConfig.direction : undefined;
        return (
            <th className={`p-4 font-semibold text-sm text-neutral-500 dark:text-neutral-400 text-left ${className}`}>
                <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 group">
                    <span>{label}</span>
                    {isSorted ? (
                        direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                        <ArrowDown className="h-3 w-3 text-transparent group-hover:text-black dark:group-hover:text-white transition-colors" />
                    )}
                </button>
            </th>
        );
    }
    
    const getTransactionValueClass = (t: Transaction) => {
      switch (t.tipo) {
          case 'rendimento': return 'text-green-600 dark:text-green-500';
          case 'despesa': return 'text-red-600 dark:text-red-500';
          case 'transferencia': return 'text-neutral-500 dark:text-neutral-400';
          default: return '';
      }
    };
    
    return (
        <div>
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                            <SortableHeader sortKey="data" label="Data" />
                            <SortableHeader sortKey="categoria_id" label="Descrição / Detalhes" />
                            <SortableHeader sortKey="valor" label="Valor" className="text-right" />
                            <th className="p-4 font-semibold text-sm text-neutral-500 dark:text-neutral-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} className={`border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 ${deletingId === t.id ? 'opacity-50 pointer-events-none' : 'opacity-100'} ${newlyAddedId === t.id ? 'bg-neutral-100 dark:bg-neutral-800/50' : ''}`}>
                                <td className="p-4 whitespace-nowrap">{t.data}</td>
                                <td className="p-4">{getTransactionDescription(t, accountMap, categoryMap)}</td>
                                <td className={`p-4 text-right font-mono tracking-tight font-semibold ${getTransactionValueClass(t)}`}>{currencySymbol}{t.valor.toFixed(2)}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => onEdit(t)}
                                            className="text-neutral-500 hover:text-blue-600 dark:hover:text-blue-500 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-900"
                                            aria-label={`Editar transação`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(t.id, t.tipo)}
                                            className="text-neutral-500 hover:text-red-600 dark:hover:text-red-500 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-neutral-900"
                                            aria-label={`Eliminar transação`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-neutral-200 dark:divide-neutral-800">
                 {transactions.map(t => (
                    <div key={t.id} className={`p-4 transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${deletingId === t.id ? 'opacity-50 pointer-events-none' : 'opacity-100'} ${newlyAddedId === t.id ? 'bg-neutral-100 dark:bg-neutral-800/50' : ''}`}>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold">{getTransactionDescription(t, accountMap, categoryMap)}</p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t.data}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold font-mono tracking-tight ${getTransactionValueClass(t)}`}>{currencySymbol}{t.valor.toFixed(2)}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="text-neutral-500 hover:text-blue-600 dark:hover:text-blue-500 p-1.5 rounded-full"
                                        aria-label={`Editar transação`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(t.id, t.tipo)}
                                        className="text-neutral-500 hover:text-red-600 dark:hover:text-red-500 p-1.5 rounded-full"
                                        aria-label={`Eliminar transação`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                 ))}
            </div>
        </div>
    );
};