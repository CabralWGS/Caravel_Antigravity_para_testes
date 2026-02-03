import React from 'react';
import { Card } from '../ui/Card.tsx';
import { ActionModal } from '../ui/ActionModal.tsx';
import { Transaction, Account, Category } from '../../types.ts';
import { ArrowLeft, Plus, ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.tsx';
import { TransactionForm } from '../transactions/TransactionForm.tsx';
// TransactionList was removed/inlined
// import { TransactionList, SortableKeys } from '../transactions/TransactionList.tsx'; 
import { TransactionEditForm } from '../transactions/TransactionEditForm.tsx';

// Helper function
const getTransactionDescription = (transaction: Transaction, accountMap: Map<string, string>, categoryMap: Map<string, string>) => {
    // Transaction type does not have a description field, so we rely on category or type logic
    if (transaction.tipo === 'transferencia') return `Transferência para ${accountMap.get(transaction.conta_destino_id || '') || 'Conta'}`;
    const categoryName = categoryMap.get(transaction.categoria_id || '');
    if (categoryName) return categoryName;
    return transaction.tipo === 'rendimento' ? 'Rendimento' : 'Despesa';
};

export type SortableKeys = 'data' | 'valor' | 'categoria_id';

// Styling Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';
const selectBase = 'block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-black';

type TransactionType = 'rendimento' | 'despesa' | 'transferencia';
type FilterType = TransactionType | 'todos';

type TransactionsState = {
    filterMes: string;
    filterCategoria: string;
    filterTipo: FilterType;
    filterConta: string;
    itemToDelete: { id: string; type: TransactionType } | null;
    editingTransaction: Transaction | null;
    sortConfig: { key: SortableKeys; direction: 'asc' | 'desc' };
    deletingId: string | null;
    newlyAddedId: string | null;
    mobileView: 'list' | 'form';
};

type TransactionsAction =
    | { type: 'SET_FILTER'; payload: { filter: 'mes' | 'categoria' | 'tipo' | 'conta'; value: string } }
    | { type: 'REQUEST_DELETE'; payload: { id: string; type: TransactionType } | null }
    | { type: 'START_EDIT'; payload: Transaction | null }
    | { type: 'REQUEST_SORT'; payload: SortableKeys }
    | { type: 'SET_DELETING_ID'; payload: string | null }
    | { type: 'SET_NEWLY_ADDED_ID'; payload: string | null }
    | { type: 'SET_MOBILE_VIEW'; payload: 'list' | 'form' };

const transactionsReducer = (state: TransactionsState, action: TransactionsAction): TransactionsState => {
    switch (action.type) {
        case 'SET_FILTER': {
            const { filter, value } = action.payload;
            switch (filter) {
                case 'tipo':
                    // Reset category filter if switching to transfers
                    return { ...state, filterTipo: value as FilterType, filterCategoria: value === 'transferencia' ? '' : state.filterCategoria };
                case 'conta':
                    return { ...state, filterConta: value };
                case 'mes':
                    return { ...state, filterMes: value };
                case 'categoria':
                    return { ...state, filterCategoria: value };
                default:
                    return state;
            }
        }
        case 'REQUEST_DELETE':
            return { ...state, itemToDelete: action.payload };
        case 'START_EDIT':
            return { ...state, editingTransaction: action.payload };
        case 'REQUEST_SORT': {
            let direction: 'asc' | 'desc' = 'asc';
            if (state.sortConfig && state.sortConfig.key === action.payload && state.sortConfig.direction === 'asc') {
                direction = 'desc';
            }
            return { ...state, sortConfig: { key: action.payload, direction } };
        }
        case 'SET_DELETING_ID':
            return { ...state, deletingId: action.payload };
        case 'SET_NEWLY_ADDED_ID':
            return { ...state, newlyAddedId: action.payload };
        case 'SET_MOBILE_VIEW':
            return { ...state, mobileView: action.payload };
        default:
            return state;
    }
};

const getInitialState = (): TransactionsState => {
    return {
        filterMes: '',
        filterCategoria: '',
        filterTipo: 'todos',
        filterConta: '',
        itemToDelete: null,
        editingTransaction: null,
        sortConfig: { key: 'data' as SortableKeys, direction: 'desc' as const },
        deletingId: null,
        newlyAddedId: null,
        mobileView: 'list',
    };
};

const TransactionsPage: React.FC = () => {
    const {
        processedConfig: config,
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        showToast
    } = useAppContext();

    const [state, dispatch] = React.useReducer(transactionsReducer, getInitialState());
    const { filterMes, filterCategoria, itemToDelete, editingTransaction, sortConfig, deletingId, newlyAddedId, filterTipo, filterConta, mobileView } = state;

    const categoryMap = React.useMemo(() => {
        const map = new Map<string, string>();
        config.allIncomeCategories.forEach(c => map.set(c.id, c.name));
        config.allExpenseCategories.forEach(c => map.set(c.id, c.name));
        return map;
    }, [config.allIncomeCategories, config.allExpenseCategories]);

    const accountMap = React.useMemo(() => {
        const map = new Map<string, string>();
        config.allAccounts.forEach(a => map.set(a.id, a.name));
        return map;
    }, [config.allAccounts]);

    const handleAddTransactionSuccess = (newId: string) => {
        dispatch({ type: 'SET_NEWLY_ADDED_ID', payload: newId });
        setTimeout(() => dispatch({ type: 'SET_NEWLY_ADDED_ID', payload: null }), 1200);
        dispatch({ type: 'SET_MOBILE_VIEW', payload: 'list' });
    };

    const handleDeleteRequest = (id: string, type: TransactionType) => {
        dispatch({ type: 'REQUEST_DELETE', payload: { id, type } });
    }

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            dispatch({ type: 'SET_DELETING_ID', payload: itemToDelete.id });
            const originalItem = { ...itemToDelete };
            dispatch({ type: 'REQUEST_DELETE', payload: null });

            try {
                await deleteTransaction(originalItem.id);
                showToast(`Transação eliminada com sucesso!`, 'success');
            } catch (error) {
                console.error(error);
            } finally {
                dispatch({ type: 'SET_DELETING_ID', payload: null });
            }
        }
    };

    const handleUpdateTransaction = async (updatedTx: Transaction) => {
        await updateTransaction(updatedTx);
        showToast('Transação atualizada com sucesso!', 'success');
        dispatch({ type: 'START_EDIT', payload: null });
    };

    const filteredTransactions = React.useMemo(() => {
        let filtered = [...transactions];

        if (filterTipo !== 'todos') {
            filtered = filtered.filter(t => t.tipo === filterTipo);
        }
        if (filterMes) {
            filtered = filtered.filter(t => t.data && t.data.startsWith(filterMes));
        }
        if (filterConta) {
            filtered = filtered.filter(t => t.conta_origem_id === filterConta || t.conta_destino_id === filterConta);
        }
        if (filterCategoria && filterTipo !== 'transferencia') {
            filtered = filtered.filter(t => t.categoria_id === filterCategoria);
        }

        if (sortConfig) {
            return filtered.sort((a, b) => {
                let aValue: string | number | null = a[sortConfig.key];
                let bValue: string | number | null = b[sortConfig.key];

                if (sortConfig.key === 'categoria_id') {
                    aValue = a.categoria_id ? categoryMap.get(a.categoria_id) || '' : (a.tipo === 'transferencia' ? 'Transferência' : '');
                    bValue = b.categoria_id ? categoryMap.get(b.categoria_id) || '' : (b.tipo === 'transferencia' ? 'Transferência' : '');
                }

                if (aValue === null) return 1;
                if (bValue === null) return -1;

                const comparison = aValue < bValue ? -1 : (aValue > bValue ? 1 : 0);
                const result = sortConfig.direction === 'asc' ? comparison : -comparison;

                // Secondary sort by date descending for stability
                if (result === 0) {
                    return new Date(b.data).getTime() - new Date(a.data).getTime();
                }
                return result;
            });
        }

        // Default sort by date descending
        return filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    }, [transactions, filterTipo, filterMes, filterConta, filterCategoria, sortConfig, categoryMap]);

    const mesesComDados = React.useMemo(() => [...new Set(transactions.filter(t => t && t.data).map(t => t.data.slice(0, 7)))].sort().reverse(), [transactions]);
    const categoriasComDados = React.useMemo(() => [...new Set(transactions.filter(t => t.tipo !== 'transferencia').map(t => t.categoria_id).filter(Boolean as any as (x: string | null) => x is string))], [transactions]);

    const setFilter = (filter: 'mes' | 'categoria' | 'tipo' | 'conta', value: string) => {
        dispatch({ type: 'SET_FILTER', payload: { filter, value } });
    };

    const requestSort = (key: SortableKeys) => {
        dispatch({ type: 'REQUEST_SORT', payload: key });
    };

    const getModalTitle = () => {
        if (!editingTransaction) return '';
        switch (editingTransaction.tipo) {
            case 'rendimento': return 'Editar Rendimento';
            case 'despesa': return 'Editar Despesa';
            case 'transferencia': return 'Editar Transferência';
        }
    };

    const formComponent = (
        <div>
            <div className="md:hidden flex items-center gap-4 mb-4">
                <button onClick={() => dispatch({ type: 'SET_MOBILE_VIEW', payload: 'list' })} className="p-2 -m-2 text-neutral-500 dark:text-neutral-400">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-lg font-bold">Registar Transação</h1>
            </div>
            <TransactionForm
                config={config}
                onSubmit={addTransaction}
                showToast={showToast}
                onSuccess={handleAddTransactionSuccess}
            />
        </div>
    );

    const listComponent = (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Histórico de Transações</h2>
                <button onClick={() => dispatch({ type: 'SET_MOBILE_VIEW', payload: 'form' })} className={`${btnBase} px-4 py-2 text-sm ${btnPrimary} md:hidden`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Registar
                </button>
            </div>

            <div className="mb-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Filtrar por Tipo</label>
                    <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        {(['todos', 'despesa', 'rendimento', 'transferencia'] as const).map(type => {
                            const labels = { todos: 'Todos', despesa: 'Despesas', rendimento: 'Rendimentos', transferencia: 'Transferências' };
                            return (
                                <button
                                    key={type}
                                    onClick={() => setFilter('tipo', type)}
                                    className={`flex-1 group flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black ${filterTipo === type
                                        ? 'bg-white shadow-sm dark:bg-neutral-700 text-black dark:text-white'
                                        : 'text-neutral-500 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-700/60'
                                        }`}
                                >
                                    <span className="truncate">{labels[type]}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="filter-mes" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Mês/Ano</label>
                        <select id="filter-mes" value={filterMes} onChange={e => setFilter('mes', e.target.value)} className={selectBase}>
                            <option value="">Todos os Meses</option>
                            {mesesComDados.map(mes => <option key={mes} value={mes}>{mes}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filter-conta" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Conta</label>
                        <select id="filter-conta" value={filterConta} onChange={e => setFilter('conta', e.target.value)} className={selectBase}>
                            <option value="">Todas as Contas</option>
                            {config.allAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filter-categoria" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Categoria</label>
                        <select id="filter-categoria" value={filterCategoria} onChange={e => setFilter('categoria', e.target.value)} className={selectBase} disabled={filterTipo === 'transferencia'}>
                            <option value="">Todas as Categorias</option>
                            {categoriasComDados.map(catId => <option key={catId} value={catId}>{categoryMap.get(catId) || catId}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    onClick={() => requestSort('data')}
                                >
                                    <div className="flex items-center gap-1">
                                        Data
                                        {state.sortConfig && state.sortConfig.key === 'data' && (
                                            state.sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Descrição
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Conta
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    onClick={() => requestSort('valor')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Valor
                                        {state.sortConfig && state.sortConfig.key === 'valor' && (
                                            state.sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                                        {transaction.data}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                                {getTransactionDescription(transaction, accountMap, categoryMap)}
                                            </span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-500">
                                                {categoryMap.get(transaction.categoria_id) || 'Sem categoria'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                                        {accountMap.get(transaction.conta_origem_id)}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-medium ${transaction.tipo === 'rendimento'
                                        ? 'text-green-600 dark:text-green-500'
                                        : transaction.tipo === 'despesa'
                                            ? 'text-neutral-900 dark:text-white'
                                            : 'text-blue-600 dark:text-blue-500'
                                        }`}>
                                        {transaction.tipo === 'rendimento' ? '+' : transaction.tipo === 'despesa' ? '-' : ''}
                                        {config.simbolo_moeda}{Number(transaction.valor).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => dispatch({ type: 'START_EDIT', payload: transaction })}
                                                className="text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRequest(transaction.id, transaction.tipo)}
                                                className="text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List View */}
                <div className="md:hidden divide-y divide-neutral-100 dark:divide-neutral-800">
                    {filteredTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="p-4 active:bg-neutral-50 dark:active:bg-neutral-800/50 transition-colors"
                            onClick={() => dispatch({ type: 'START_EDIT', payload: transaction })}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1">
                                        {getTransactionDescription(transaction, accountMap, categoryMap)}
                                    </span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {transaction.data} • {categoryMap.get(transaction.categoria_id) || 'Sem categoria'}
                                    </span>
                                </div>
                                <span className={`font-mono font-bold text-sm ${transaction.tipo === 'rendimento'
                                    ? 'text-green-600 dark:text-green-500'
                                    : transaction.tipo === 'despesa'
                                        ? 'text-neutral-900 dark:text-white'
                                        : 'text-blue-600 dark:text-blue-500'
                                    }`}>
                                    {transaction.tipo === 'rendimento' ? '+' : transaction.tipo === 'despesa' ? '-' : ''}
                                    {config.simbolo_moeda}{Number(transaction.valor).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
                                <span>{accountMap.get(transaction.conta_origem_id)}</span>
                                {/* Mobile Actions: Delete only, Edit is via tap */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteRequest(transaction.id, transaction.tipo);
                                    }}
                                    className="p-1.5 -mr-1.5 text-neutral-400 bg-transparent active:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTransactions.length === 0 && (
                    <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                        <p>Nenhuma transação encontrada.</p>
                    </div>
                )}
            </div>
        </Card>
    );

    return (
        <div className="space-y-8 animate-fade-in-scale">
            {/* Desktop View */}
            <div className="hidden md:block">
                <TransactionForm
                    config={config}
                    onSubmit={addTransaction}
                    showToast={showToast}
                    onSuccess={handleAddTransactionSuccess}
                />
            </div>
            <div className="hidden md:block">
                {listComponent}
            </div>

            {/* Mobile View with Transition */}
            <div className="md:hidden">
                {mobileView === 'form' ? (
                    <div key="form-view" className="animate-fade-in-scale">
                        {formComponent}
                    </div>
                ) : (
                    <div key="list-view" className="animate-fade-in-scale">
                        {listComponent}
                    </div>
                )}
            </div>

            <ActionModal
                isOpen={!!itemToDelete}
                onClose={() => dispatch({ type: 'REQUEST_DELETE', payload: null })}
                title="Confirmar Eliminação"
                actions={[
                    { text: 'Cancelar', onClick: () => dispatch({ type: 'REQUEST_DELETE', payload: null }), intent: 'secondary' },
                    { text: 'Sim, Eliminar', onClick: handleDeleteConfirm, intent: 'danger' }
                ]}
            >
                <p>Tens a certeza que queres eliminar esta transação? Esta ação é irreversível.</p>
            </ActionModal>

            {editingTransaction && (
                <ActionModal
                    isOpen={!!editingTransaction}
                    onClose={() => dispatch({ type: 'START_EDIT', payload: null })}
                    title={getModalTitle()}
                    actions={[
                        { text: 'Cancelar', onClick: () => dispatch({ type: 'START_EDIT', payload: null }), intent: 'secondary' },
                        { text: 'Guardar Alterações', onClick: () => { }, intent: 'primary', type: 'submit', form: `edit-form-${editingTransaction.id}` }
                    ]}
                    className="w-full max-w-full sm:max-w-md h-full sm:h-auto rounded-none sm:rounded-2xl"
                    contentClassName="max-h-full"
                >
                    <TransactionEditForm
                        transaction={editingTransaction}
                        config={config}
                        onSave={handleUpdateTransaction}
                        onCancel={() => dispatch({ type: 'START_EDIT', payload: null })}
                        showToast={showToast}
                    />
                </ActionModal>
            )}
        </div>
    );
};

export default TransactionsPage;
