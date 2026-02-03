import React, { useMemo } from 'react';
import { Card } from '../ui/Card.tsx';
import { ActionModal } from '../ui/ActionModal.tsx';
import { ProcessedConfig, PatrimonioEntry, Account } from '../../types.ts';
import { Trash2, Pencil, ArrowDown, ArrowUp, Loader2, Plus, ArrowLeft, ChevronDown, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.tsx';

// Styling Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-5 py-2 text-sm';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';
const btnSecondary = 'bg-transparent text-black dark:text-white border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-black dark:focus-visible:ring-white';
const inputBase = 'block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-black';

type SortableKeys = 'data' | 'total_patrimonio' | 'variation' | string; // string for account ids

const getInitialFormState = (accounts: Account[]) => accounts.reduce((acc, account) => ({ ...acc, [account.id]: '' }), {});

type PatrimonioState = {
    mesAno: string;
    formState: Record<string, string>;
    isLoading: boolean;
    itemToDelete: string | null;
    editingEntry: PatrimonioEntry | null;
    deletingId: string | null;
    newlyAddedId: string | null;
    sortConfig: { key: SortableKeys; direction: 'asc' | 'desc' };
    mobileView: 'list' | 'form';
};

type PatrimonioAction =
    | { type: 'SET_MES_ANO'; payload: string }
    | { type: 'SET_FORM_STATE'; payload: Record<string, string> }
    | { type: 'UPDATE_FORM_FIELD'; payload: { id: string; value: string } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'REQUEST_DELETE'; payload: string | null }
    | { type: 'START_EDIT'; payload: { entry: PatrimonioEntry; accounts: Account[] } }
    | { type: 'CANCEL_EDIT'; payload: { resetMonth: boolean, today: string; accounts: Account[] } }
    | { type: 'SET_DELETING_ID'; payload: string | null }
    | { type: 'SET_NEWLY_ADDED_ID'; payload: string | null }
    | { type: 'REQUEST_SORT'; payload: SortableKeys }
    | { type: 'RESET_FORM'; payload: { accounts: Account[] } }
    | { type: 'SET_MOBILE_VIEW'; payload: 'list' | 'form' };

const patrimonioReducer = (state: PatrimonioState, action: PatrimonioAction): PatrimonioState => {
    switch (action.type) {
        case 'SET_MES_ANO':
            return { ...state, mesAno: action.payload };
        case 'SET_FORM_STATE':
            return { ...state, formState: action.payload };
        case 'UPDATE_FORM_FIELD':
            return {
                ...state,
                formState: { ...state.formState, [action.payload.id]: action.payload.value },
            };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'REQUEST_DELETE':
            return { ...state, itemToDelete: action.payload };
        case 'START_EDIT': {
            const { entry, accounts } = action.payload;
            const newFormState = { ...getInitialFormState(accounts) };
            accounts.forEach(account => {
                newFormState[account.id] = String(entry.account_values[account.id] || '');
            });
            return { ...state, editingEntry: entry, mesAno: entry.data ? entry.data.slice(0, 7) : '', formState: newFormState };
        }
        case 'CANCEL_EDIT': {
            const { resetMonth, today, accounts } = action.payload;
            return {
                ...state,
                editingEntry: null,
                mesAno: resetMonth ? today : state.mesAno,
                formState: getInitialFormState(accounts),
            };
        }
        case 'SET_DELETING_ID':
            return { ...state, deletingId: action.payload };
        case 'SET_NEWLY_ADDED_ID':
            return { ...state, newlyAddedId: action.payload };
        case 'REQUEST_SORT': {
            let direction: 'asc' | 'desc' = 'asc';
            if (state.sortConfig && state.sortConfig.key === action.payload && state.sortConfig.direction === 'asc') {
                direction = 'desc';
            }
            return { ...state, sortConfig: { key: action.payload, direction } };
        }
        case 'RESET_FORM':
            return { ...state, formState: getInitialFormState(action.payload.accounts) };
        case 'SET_MOBILE_VIEW':
            return { ...state, mobileView: action.payload };
        default:
            return state;
    }
};

const PatrimonioComposition: React.FC<{
    entry: PatrimonioEntry & { variation: number | null };
    accountMap: Map<string, string>;
    currencySymbol: string;
}> = ({ entry, accountMap, currencySymbol }) => {
    const validAccounts = (Object.entries(entry.account_values) as [string, number][])
        .filter(([, value]) => value > 0)
        .sort(([, aValue], [, bValue]) => bValue - aValue);

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Composição do Património</h4>
            {validAccounts.length > 0 ? validAccounts.map(([accountId, value]) => {
                const percentage = entry.total_patrimonio > 0 ? (value / entry.total_patrimonio) * 100 : 0;
                const accountName = accountMap.get(accountId) || 'Conta Desconhecida';
                return (
                    <div key={`${entry.id}-${accountId}`}>
                        <div className="flex justify-between items-baseline text-sm">
                            <span className="font-medium text-neutral-600 dark:text-neutral-300 truncate pr-4">{accountName}</span>
                            <span className="font-mono tracking-tight whitespace-nowrap">{currencySymbol}{value.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono w-8 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                    </div>
                )
            }) : <p className="text-sm text-neutral-500 dark:text-neutral-400">Nenhuma conta com valor registado para este mês.</p>}
        </div>
    );
};

// Moved SortableHeader outside to avoid redefining on every render
const SortableHeader: React.FC<{
    sortKey: SortableKeys;
    label: string;
    className?: string;
    sortConfig: { key: SortableKeys; direction: 'asc' | 'desc' };
    requestSort: (key: SortableKeys) => void;
}> = ({ sortKey, label, className, sortConfig, requestSort }) => {
    const isSorted = sortConfig.key === sortKey;
    const direction = isSorted ? sortConfig.direction : undefined;
    const isRightAligned = className?.includes('text-right');

    return (
        <th className={`p-4 font-semibold text-sm text-neutral-500 dark:text-neutral-400 text-left whitespace-nowrap ${className}`}>
            <button onClick={() => requestSort(sortKey)} className={`w-full flex items-center gap-1 group ${isRightAligned ? 'justify-end' : ''}`}>
                <span>{label}</span>
                {isSorted ? (
                    direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                ) : (
                    <ArrowDown className="h-3 w-3 text-transparent group-hover:text-black dark:group-hover:text-white transition-colors" />
                )}
            </button>
        </th>
    );
};

const PatrimonioTableRow: React.FC<{
    entry: PatrimonioEntry & { variation: number | null };
    isExpanded: boolean;
    toggleExpand: () => void;
    config: ProcessedConfig;
    accountsToDisplay: Account[];
    accountMap: Map<string, string>;
    deletingId: string | null;
    newlyAddedId: string | null;
    handleEditClick: (entry: PatrimonioEntry) => void;
    handleDeleteRequest: (id: string) => void;
}> = ({ entry, isExpanded, toggleExpand, config, accountsToDisplay, accountMap, deletingId, newlyAddedId, handleEditClick, handleDeleteRequest }) => {
    const contentRef = React.useRef<HTMLDivElement>(null);

    return (
        <React.Fragment>
            <tr className={`group border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 ${deletingId === entry.id ? 'opacity-50 pointer-events-none' : 'opacity-100'} ${newlyAddedId === entry.id ? 'bg-neutral-100 dark:bg-neutral-800/50' : ''} ${isExpanded ? 'bg-neutral-50 dark:bg-neutral-800/30' : ''}`}>
                <td className="p-4 whitespace-nowrap">
                    <button onClick={toggleExpand} className="flex items-center gap-2 text-left w-full group">
                        <span>{entry.data.slice(0, 7)}</span>
                        <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-300 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </td>
                <td className="p-4 text-right font-mono tracking-tight font-semibold">{config.simbolo_moeda}{entry.total_patrimonio.toFixed(2)}</td>
                <td className="p-4 text-right">
                    {entry.variation !== null ? (
                        <span className={`font-mono tracking-tight font-semibold text-sm ${entry.variation >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                            {entry.variation >= 0 ? '+' : ''}{config.simbolo_moeda}{entry.variation.toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-neutral-500 dark:text-neutral-400">—</span>
                    )}
                </td>
                {accountsToDisplay.map(acc => (
                    <td key={`${entry.id}-${acc.id}`} className="p-4 text-right font-mono tracking-tight text-neutral-500 dark:text-neutral-400">{config.simbolo_moeda}{(entry.account_values[acc.id] || 0).toFixed(2)}</td>
                ))}
                <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={() => handleEditClick(entry)}
                            className="text-neutral-500 hover:text-blue-600 dark:hover:text-blue-500 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-900"
                            aria-label={`Editar registo de ${entry.data.slice(0, 7)}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteRequest(entry.id)}
                            className="text-neutral-500 hover:text-red-600 dark:hover:text-red-500 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-neutral-900"
                            aria-label={`Eliminar registo de ${entry.data.slice(0, 7)}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <tr className={`border-b border-neutral-200 dark:border-neutral-800 ${deletingId === entry.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <td colSpan={4 + accountsToDisplay.length} className="p-0">
                        <div ref={contentRef} className="collapsible-content" style={{ maxHeight: contentRef.current?.scrollHeight }}>
                            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/30">
                                <PatrimonioComposition entry={entry} accountMap={accountMap} currencySymbol={config.simbolo_moeda} />
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

const PatrimonioMobileCard: React.FC<{
    entry: PatrimonioEntry & { variation: number | null };
    isExpanded: boolean;
    toggleExpand: () => void;
    config: ProcessedConfig;
    accountMap: Map<string, string>;
    deletingId: string | null;
    newlyAddedId: string | null;
    handleEditClick: (entry: PatrimonioEntry) => void;
    handleDeleteRequest: (id: string) => void;
}> = ({ entry, isExpanded, toggleExpand, config, accountMap, deletingId, newlyAddedId, handleEditClick, handleDeleteRequest }) => {
    const contentRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className={`
            mx-2 my-2 rounded-2xl border transition-all duration-300 overflow-hidden
            ${isExpanded
                ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-md scale-[1.01]'
                : 'bg-white dark:bg-black border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700'
            }
            ${deletingId === entry.id ? 'opacity-50 pointer-events-none' : 'opacity-100'} 
            ${newlyAddedId === entry.id ? 'ring-2 ring-emerald-500' : ''}
        `}>
            <div className="p-4" onClick={toggleExpand}>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 font-mono">
                        {new Date(entry.data).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                    </span>
                    {entry.variation !== null && (
                        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${entry.variation >= 0
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}>
                            {entry.variation >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                            {config.simbolo_moeda}{Math.abs(entry.variation).toFixed(0)}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {config.simbolo_moeda}{entry.total_patrimonio.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Total Acumulado</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <div
                ref={contentRef}
                className="collapsible-content transition-all duration-300 ease-in-out"
                style={{ maxHeight: isExpanded ? contentRef.current?.scrollHeight : 0, opacity: isExpanded ? 1 : 0 }}
            >
                <div className="px-4 pb-4 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                    <PatrimonioComposition entry={entry} accountMap={accountMap} currencySymbol={config.simbolo_moeda} />

                    <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleEditClick(entry); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <Pencil className="w-4 h-4" /> Editar
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteRequest(entry.id); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const PatrimonioPage: React.FC = () => {
    const {
        processedConfig: config,
        patrimonioEntries,
        addPatrimonio,
        deletePatrimonioEntry,
        updatePatrimonioEntry,
        showToast
    } = useAppContext();

    const today = new Date().toISOString().slice(0, 7);

    const initialState: PatrimonioState = {
        mesAno: today,
        formState: getInitialFormState(config.activeAccounts),
        isLoading: false,
        itemToDelete: null,
        editingEntry: null,
        deletingId: null,
        newlyAddedId: null,
        sortConfig: { key: 'data', direction: 'desc' },
        mobileView: 'list',
    };

    const [state, dispatch] = React.useReducer(patrimonioReducer, initialState);
    const { mesAno, formState, isLoading, itemToDelete, editingEntry, deletingId, newlyAddedId, sortConfig, mobileView } = state;
    const [isFormHighlighted, setIsFormHighlighted] = React.useState(false);
    const [expandedEntryId, setExpandedEntryId] = React.useState<string | null>(null);

    const accountMap = useMemo(() => {
        const map = new Map<string, string>();
        config.allAccounts.forEach(a => map.set(a.id, a.name));
        return map;
    }, [config.allAccounts]);


    React.useEffect(() => {
        const mesSelecionado = mesAno;
        if (!mesSelecionado) return;

        const entryForSelectedMonth = patrimonioEntries.find(r => r && r.data && r.data.startsWith(mesSelecionado));

        if (entryForSelectedMonth) {
            if (editingEntry?.id !== entryForSelectedMonth.id) {
                dispatch({ type: 'START_EDIT', payload: { entry: entryForSelectedMonth, accounts: config.allAccounts } });
            }
            return;
        }

        if (editingEntry) {
            dispatch({ type: 'CANCEL_EDIT', payload: { resetMonth: false, today, accounts: config.activeAccounts } });
        }

        const [ano, mes] = mesSelecionado.split('-').map(Number);
        const dataMesAnterior = new Date(ano, mes - 2, 1);
        const mesAnteriorStr = `${dataMesAnterior.getFullYear()}-${String(dataMesAnterior.getMonth() + 1).padStart(2, '0')}`;

        const registoAnterior = patrimonioEntries.find(r => r && r.data && r.data.startsWith(mesAnteriorStr));

        if (registoAnterior && registoAnterior.account_values) {
            const newFormState = { ...getInitialFormState(config.activeAccounts) };
            config.activeAccounts.forEach(account => {
                newFormState[account.id] = String(registoAnterior.account_values[account.id] || '');
            });
            dispatch({ type: 'SET_FORM_STATE', payload: newFormState });
        } else {
            dispatch({ type: 'RESET_FORM', payload: { accounts: config.activeAccounts } });
        }
    }, [mesAno, patrimonioEntries, config.allAccounts, config.activeAccounts, showToast, editingEntry, today]);

    const handleEditClick = (entry: PatrimonioEntry) => {
        dispatch({ type: 'START_EDIT', payload: { entry, accounts: config.allAccounts } });
        dispatch({ type: 'SET_MOBILE_VIEW', payload: 'form' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsFormHighlighted(true);
        setTimeout(() => setIsFormHighlighted(false), 1500);
    };

    const handleCancelEdit = () => {
        dispatch({ type: 'CANCEL_EDIT', payload: { resetMonth: true, today, accounts: config.activeAccounts } });
        dispatch({ type: 'SET_MOBILE_VIEW', payload: 'list' });
    }

    const handleClearForm = () => {
        dispatch({ type: 'RESET_FORM', payload: { accounts: config.activeAccounts } });
        showToast('Formulário limpo.', 'warning');
    }

    const handleInputChange = (id: string, value: string) => {
        dispatch({ type: 'UPDATE_FORM_FIELD', payload: { id, value } });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });

        let account_values: { [accountId: string]: number } = {};

        try {
            const accountsInForm = editingEntry
                ? config.allAccounts.filter(a => a.isActive || (editingEntry.account_values[a.id] || 0) > 0)
                : config.activeAccounts;

            for (const account of accountsInForm) {
                if (formState[account.id] && parseFloat(formState[account.id]) < 0) {
                    showToast(`O valor da conta "${account.name}" não pode ser negativo.`, 'error');
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }
            }

            if (editingEntry) {
                account_values = { ...editingEntry.account_values };
                accountsInForm.forEach(account => {
                    const formValue = formState[account.id];
                    const value = parseFloat(formValue);
                    account_values[account.id] = isNaN(value) ? 0 : value;
                });
            } else {
                account_values = config.allAccounts.reduce((acc, account) => {
                    const value = parseFloat(formState[account.id]);
                    acc[account.id] = account.isActive && !isNaN(value) ? value : 0;
                    return acc;
                }, {} as Record<string, number>);
            }

            const totalPatrimonio = Object.values(account_values).reduce((sum, v) => sum + (v || 0), 0);
            const dataParaGuardar = `${mesAno}-01`;

            if (editingEntry) {
                await updatePatrimonioEntry({
                    ...editingEntry,
                    data: dataParaGuardar,
                    total_patrimonio: totalPatrimonio,
                    account_values
                });
                showToast('Património atualizado com sucesso!', 'success');
            } else {
                const newEntry: Omit<PatrimonioEntry, 'id' | 'user_id'> = {
                    tipo: 'patrimonio',
                    data: dataParaGuardar,
                    total_patrimonio: totalPatrimonio,
                    account_values,
                };
                const newId = await addPatrimonio(newEntry);
                dispatch({ type: 'SET_NEWLY_ADDED_ID', payload: newId });
                setTimeout(() => dispatch({ type: 'SET_NEWLY_ADDED_ID', payload: null }), 1200);
                showToast('Património registado com sucesso!', 'success');
            }

            handleCancelEdit(); // Also sets view to list
        } catch (error) {
            console.error(error);
            // Error toast shown in context
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleDeleteRequest = (id: string) => {
        dispatch({ type: 'REQUEST_DELETE', payload: id });
    }

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            dispatch({ type: 'SET_DELETING_ID', payload: itemToDelete });
            const idToDelete = itemToDelete;
            dispatch({ type: 'REQUEST_DELETE', payload: null });
            try {
                await deletePatrimonioEntry(idToDelete);
                showToast('Registo de património eliminado com sucesso!', 'success');
            } catch (e) {
                // Error handled in context
                console.error(e);
            } finally {
                dispatch({ type: 'SET_DELETING_ID', payload: null });
            }
        }
    };

    const requestSort = (key: SortableKeys) => {
        dispatch({ type: 'REQUEST_SORT', payload: key });
    };

    const sortedEntriesWithVariation = useMemo(() => {
        const sortedByDate = [...patrimonioEntries]
            .filter(e => e && e.data)
            .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        const withVariation = sortedByDate.map((entry, index) => {
            if (index === 0) {
                return { ...entry, variation: null };
            }
            const previousEntry = sortedByDate[index - 1];
            const variation = entry.total_patrimonio - previousEntry.total_patrimonio;
            return { ...entry, variation };
        });

        if (sortConfig) {
            return withVariation.sort((a, b) => {
                let aValue: string | number | null = null;
                let bValue: string | number | null = null;

                if (sortConfig.key === 'data' || sortConfig.key === 'total_patrimonio') {
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                } else if (sortConfig.key === 'variation') {
                    aValue = a.variation;
                    bValue = b.variation;
                } else { // Account ID
                    aValue = a.account_values[sortConfig.key] || 0;
                    bValue = b.account_values[sortConfig.key] || 0;
                }

                if (aValue === null) return 1;
                if (bValue === null) return -1;

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return withVariation.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    }, [patrimonioEntries, sortConfig]);

    const isEditingHistoricalData = useMemo(() => {
        if (!editingEntry) return false;
        const sortedByDate = [...patrimonioEntries].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        const latest = sortedByDate[0];
        return latest && editingEntry.id !== latest.id && new Date(editingEntry.data) < new Date(latest.data);
    }, [editingEntry, patrimonioEntries]);

    const usedArchivedAccountIds = React.useMemo(() => {
        const idSet = new Set<string>();
        for (const entry of sortedEntriesWithVariation) {
            if (entry.account_values) {
                for (const accountId in entry.account_values) {
                    if (entry.account_values[accountId] > 0) {
                        idSet.add(accountId);
                    }
                }
            }
        }
        return idSet;
    }, [sortedEntriesWithVariation]);

    const accountsToDisplay = React.useMemo(() => {
        return config.allAccounts.filter(acc => {
            return acc.isActive || usedArchivedAccountIds.has(acc.id);
        });
    }, [config.allAccounts, usedArchivedAccountIds]);


    const formComponent = (
        <Card className={isFormHighlighted ? 'animate-highlight-breathe' : ''}>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center gap-4 mb-6">
                <button onClick={handleCancelEdit} className="p-2 -m-2 text-neutral-500 dark:text-neutral-400" aria-label="Voltar à lista">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-lg font-bold">{editingEntry && editingEntry.data ? `A Editar: ${editingEntry.data.slice(0, 7)}` : 'Atualizar Património Mensal'}</h1>
            </div>
            {/* Desktop Header */}
            <h2 className="text-lg font-bold hidden md:block mb-6">{editingEntry && editingEntry.data ? `A Editar: ${editingEntry.data.slice(0, 7)}` : 'Atualizar Património Mensal'}</h2>

            {isEditingHistoricalData && (
                <div className="flex items-start gap-3 p-3 mb-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm border border-yellow-100 dark:border-yellow-800">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p>Atenção: Estás a alterar um registo do passado. Isto irá recalcular o "Crescimento Passivo" na Bússola do mês seguinte.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="patrimonio-mes" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Mês/Ano</label>
                    <input type="month" id="patrimonio-mes" value={mesAno} onChange={e => dispatch({ type: 'SET_MES_ANO', payload: e.target.value })} required max={today} className={`${inputBase} w-full md:w-1/3`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(editingEntry ? config.allAccounts.filter(a => a.isActive || (editingEntry.account_values[a.id] || 0) > 0) : config.activeAccounts).map(account => (
                        <div key={account.id}>
                            <label htmlFor={account.id} className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">{account.name}</label>
                            <input
                                type="number"
                                id={account.id}
                                value={formState[account.id] || ''}
                                onChange={e => handleInputChange(account.id, e.target.value)}
                                step="0.01"
                                required
                                placeholder="0.00"
                                min="0"
                                className={inputBase}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button type="submit" disabled={isLoading} className={`${btnBase} ${btnSize} ${btnPrimary} w-full sm:w-auto`}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />A guardar...
                            </>
                        ) : (editingEntry ? 'Guardar Alterações' : 'Registar Património')}
                    </button>
                    {editingEntry && (
                        <button type="button" onClick={handleCancelEdit} className={`${btnBase} ${btnSize} ${btnSecondary} w-full sm:w-auto`}>
                            Cancelar Edição
                        </button>
                    )}
                    <button type="button" onClick={handleClearForm} className={`${btnBase} ${btnSize} ${btnSecondary} w-full sm:w-auto ml-auto`}>
                        Limpar
                    </button>
                </div>
            </form>
        </Card>
    );

    const listComponent = (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Histórico de Património</h2>
                <button onClick={() => dispatch({ type: 'SET_MOBILE_VIEW', payload: 'form' })} className={`${btnBase} px-4 py-2 text-sm ${btnPrimary} md:hidden`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Atualizar
                </button>
            </div>
            {sortedEntriesWithVariation.length > 0 ? (
                <>
                    {/* Desktop Table */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <SortableHeader
                                        sortKey="data"
                                        label="Data"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                    />
                                    <SortableHeader
                                        sortKey="total_patrimonio"
                                        label="Total"
                                        className="text-right"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                    />
                                    <SortableHeader
                                        sortKey="variation"
                                        label="Variação Mensal"
                                        className="text-right"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                    />
                                    {accountsToDisplay.map(acc => (
                                        <SortableHeader
                                            key={acc.id}
                                            sortKey={acc.id}
                                            label={acc.name}
                                            className="text-right"
                                            sortConfig={sortConfig}
                                            requestSort={requestSort}
                                        />
                                    ))}
                                    <th className="p-4 font-semibold text-sm text-neutral-500 dark:text-neutral-400 text-right">
                                        <span className="sr-only">Ações</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedEntriesWithVariation.map(entry => (
                                    <PatrimonioTableRow
                                        key={entry.id}
                                        entry={entry}
                                        isExpanded={expandedEntryId === entry.id}
                                        toggleExpand={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                                        config={config}
                                        accountsToDisplay={accountsToDisplay}
                                        accountMap={accountMap}
                                        deletingId={deletingId}
                                        newlyAddedId={newlyAddedId}
                                        handleEditClick={handleEditClick}
                                        handleDeleteRequest={handleDeleteRequest}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-neutral-200 dark:divide-neutral-800">
                        {sortedEntriesWithVariation.map(entry => (
                            <PatrimonioMobileCard
                                key={entry.id}
                                entry={entry}
                                isExpanded={expandedEntryId === entry.id}
                                toggleExpand={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                                config={config}
                                accountMap={accountMap}
                                deletingId={deletingId}
                                newlyAddedId={newlyAddedId}
                                handleEditClick={handleEditClick}
                                handleDeleteRequest={handleDeleteRequest}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
                    <p>Ainda não tens nenhum registo de património.</p>
                    <p className="text-sm">Começa por adicionar o teu primeiro registo no formulário acima.</p>
                </div>
            )}
        </Card>
    );


    return (
        <div className="animate-fade-in-scale relative">
            {/* Desktop view */}
            <div className="hidden md:block space-y-8">
                {formComponent}
                {listComponent}
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
                {mobileView === 'form' ? (
                    <div key="form-view" className="animate-fade-in-scale">
                        {formComponent}
                    </div>
                ) : (
                    <div key="list-view" className="animate-fade-in-scale pb-20">
                        {listComponent}

                        {/* Mobile FAB for Add */}
                        <button
                            onClick={() => dispatch({ type: 'SET_MOBILE_VIEW', payload: 'form' })}
                            className="fixed bottom-20 right-4 z-10 p-4 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-xl hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
                            aria-label="Adicionar Património"
                        >
                            <Plus className="h-6 w-6" />
                        </button>
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
                <p>Tens a certeza que queres eliminar este registo de património? Esta ação é irreversível.</p>
            </ActionModal>
        </div>
    );
};

export default PatrimonioPage;