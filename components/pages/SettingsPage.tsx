
import React, { useState } from 'react';
import { Card } from '../ui/Card.tsx';
import { ActionModal } from '../ui/ActionModal.tsx';
import { Config, Account, Category } from '../../types.ts';
import { Settings, User, HelpCircle, Loader2, LogOut, Palette, Download, Map, Scroll, Compass, Anchor, Wind, Waves, Archive, LayoutDashboard, Crown, ExternalLink, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../context/AppContext.tsx';
import { PasswordInput } from '../ui/PasswordInput.tsx';
import { PasswordStrengthMeter } from '../ui/PasswordStrengthMeter.tsx';
import { handleAuthError } from '../../constants.ts';
import { ItemManager, ManageableItem, ItemType } from './settings/ItemManager.tsx';
import { Logo } from '../ui/Logo.tsx';
import { useSearchParams } from 'react-router-dom';


// Styling Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-5 py-2 text-sm';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';
const btnSecondary = 'bg-transparent text-black dark:text-white border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-black dark:focus-visible:ring-white';
const btnDanger = 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500';
const inputBase = 'block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-black';
const selectBase = inputBase;

// Environment Variables Access
const LEMON_SQUEEZY_CHECKOUT_URL = (import.meta as any).env.VITE_LEMON_SQUEEZY_CHECKOUT_URL || "";
const LEMON_SQUEEZY_PORTAL_URL = (import.meta as any).env.VITE_LEMON_SQUEEZY_PORTAL_URL || "";

type Theme = 'light' | 'dark' | 'system';
type SettingsTab = 'geral' | 'personalizacao' | 'ajuda' | 'conta';

const currencies = [
    { symbol: '€', code: 'EUR' },
    { symbol: '$', code: 'USD' },
    { symbol: '£', code: 'GBP' },
    { symbol: '¥', code: 'JPY' },
    { symbol: 'R$', code: 'BRL' },
    { symbol: 'Fr', code: 'CHF' },
    { symbol: 'C$', code: 'CAD' },
    { symbol: 'A$', code: 'AUD' },
    { symbol: '¥', code: 'CNY' },
];

const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '');

type SettingsState = {
    activeTab: SettingsTab;
    settingsDraft: Config;
    newNames: {
        incomeCategory: string;
        expenseCategory: string;
        account: string;
    };
    isDeleteDataModalOpen: boolean;
    isSaving: boolean;
    itemToDelete: { id: string, name: string, type: ItemType } | null;
};

type SettingsAction =
    | { type: 'SET_ACTIVE_TAB'; payload: SettingsTab }
    | { type: 'HANDLE_GENERAL_CHANGE'; payload: { name: string; value: string } }
    | { type: 'HANDLE_NEW_NAME_CHANGE'; payload: { type: 'account' | 'incomeCategory' | 'expenseCategory'; value: string } }
    | { type: 'UPDATE_ITEMS'; payload: { key: keyof Config; items: ManageableItem[] } }
    | { type: 'RESET_NEW_NAME'; payload: { type: 'account' | 'incomeCategory' | 'expenseCategory' } }
    | { type: 'SET_IS_SAVING'; payload: boolean }
    | { type: 'SET_DELETE_DATA_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_ITEM_TO_DELETE'; payload: { id: string, name: string, type: ItemType } | null }
    | { type: 'RESET_STATE'; payload: { config: Config } };

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
    switch (action.type) {
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
        case 'HANDLE_GENERAL_CHANGE':
            return {
                ...state,
                settingsDraft: { ...state.settingsDraft, [action.payload.name]: action.payload.value },
            };
        case 'HANDLE_NEW_NAME_CHANGE':
            return {
                ...state,
                newNames: { ...state.newNames, [action.payload.type]: action.payload.value },
            };
        case 'UPDATE_ITEMS':
            return {
                ...state,
                settingsDraft: { ...state.settingsDraft, [action.payload.key]: action.payload.items }
            };
        case 'RESET_NEW_NAME':
            return {
                ...state,
                newNames: { ...state.newNames, [action.payload.type]: '' }
            };
        case 'SET_IS_SAVING':
            return { ...state, isSaving: action.payload };
        case 'SET_DELETE_DATA_MODAL_OPEN':
            return { ...state, isDeleteDataModalOpen: action.payload };
        case 'SET_ITEM_TO_DELETE':
            return { ...state, itemToDelete: action.payload };
        case 'RESET_STATE':
            return {
                ...state,
                settingsDraft: action.payload.config,
            };
        default:
            return state;
    }
};


const ThemeSelector: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => {
    const options: { value: Theme; label: string }[] = [
        { value: 'light', label: 'Diurno' },
        { value: 'dark', label: 'Noturno' },
        { value: 'system', label: 'Sistema' },
    ];

    return (
        <div>
            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Tema Visual</label>
            <div className="flex space-x-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-800">
                {options.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-900 ${theme === option.value
                                ? 'bg-white shadow-sm dark:bg-neutral-700 text-black dark:text-white'
                                : 'text-neutral-600 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-neutral-700/60'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};


const SettingsPage: React.FC = () => {
    const { user, config, processedConfig, updateConfig, showToast, deleteAllData, theme, setTheme, signOut, updateUserEmail, updateUserPassword, activeYear, setActiveYear, exportData, subscriptionStatus } = useAppContext();

    // Utilizar useSearchParams para ler corretamente os parâmetros em HashRouter
    const [searchParams] = useSearchParams();

    const [state, dispatch] = React.useReducer(settingsReducer, {
        activeTab: 'geral',
        settingsDraft: config,
        newNames: {
            incomeCategory: '',
            expenseCategory: '',
            account: ''
        },
        isDeleteDataModalOpen: false,
        isSaving: false,
        itemToDelete: null,
    });

    // State for account management forms
    const [newEmail, setNewEmail] = useState('');
    const [passwordForEmail, setPasswordForEmail] = useState('');
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');


    React.useEffect(() => {
        dispatch({ type: 'RESET_STATE', payload: { config } });

        // Check if we navigated here from the lock screen (query param tab=conta)
        const tabParam = searchParams.get('tab');
        if (tabParam === 'conta') {
            dispatch({ type: 'SET_ACTIVE_TAB', payload: 'conta' });
        }
    }, [config, searchParams]);

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(null);
        if (!newEmail.trim() || !passwordForEmail.trim()) {
            setEmailError('Por favor, preenche todos os campos.');
            return;
        }
        setIsUpdatingEmail(true);
        const { error } = await updateUserEmail(newEmail, passwordForEmail);
        if (error) {
            setEmailError(handleAuthError(error.message));
        } else {
            showToast('Verifica os teus emails (antigo e novo) para confirmares a alteração.', 'success');
            setNewEmail('');
            setPasswordForEmail('');
        }
        setIsUpdatingEmail(false);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        if (newPassword !== confirmNewPassword) {
            setPasswordError('As novas passwords não coincidem.');
            return;
        }
        if (!currentPassword || !newPassword) {
            setPasswordError('Por favor, preenche todos os campos.');
            return;
        }
        setIsUpdatingPassword(true);
        const { error } = await updateUserPassword(currentPassword, newPassword);
        if (error) {
            setPasswordError(handleAuthError(error.message));
        } else {
            showToast('Password alterada com sucesso! Por favor, entra novamente.', 'success');
            await signOut();
            // Navigation will be handled by ProtectedLayout after sign out
        }
        setIsUpdatingPassword(false);
    };

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        dispatch({ type: 'HANDLE_GENERAL_CHANGE', payload: { name, value } });
    };

    const getConfigKey = (type: ItemType): keyof Config => {
        if (type === 'incomeCategory') return 'incomeCategories';
        if (type === 'expenseCategory') return 'expenseCategories';
        return 'accounts';
    };

    const handleAddItem = (type: ItemType) => {
        const key = getConfigKey(type);
        const newName = state.newNames[type].trim();

        // TAREFA 4: Restrição de Contas Freemium (Impede criação se >= 2 ativas)
        if (type === 'account' && subscriptionStatus === 'free') {
            const activeAccountCount = (state.settingsDraft.accounts || []).filter(a => a.isActive).length;
            if (activeAccountCount >= 2) {
                showToast("O plano Gratuito limita-se a 2 contas. Faz upgrade para Capitão para navegação ilimitada.", 'warning');
                return;
            }
        }

        if (!newName) {
            showToast('O nome não pode estar vazio.', 'error');
            return;
        }

        const currentItems = state.settingsDraft[key] as ManageableItem[];
        if (currentItems.some(item => item.name.toLowerCase() === newName.toLowerCase())) {
            showToast(`O item "${newName}" já existe.`, 'error');
            return;
        }

        const newItem: ManageableItem = { id: uuidv4(), name: newName, isActive: true };
        dispatch({ type: 'UPDATE_ITEMS', payload: { key, items: [...currentItems, newItem] } });
        dispatch({ type: 'RESET_NEW_NAME', payload: { type } });
    };

    const handleUpdateItemName = (id: string, newName: string, type: ItemType) => {
        const key = getConfigKey(type);
        const updatedItems = (state.settingsDraft[key] as ManageableItem[]).map(item =>
            item.id === id ? { ...item, name: newName } : item
        );
        dispatch({ type: 'UPDATE_ITEMS', payload: { key, items: updatedItems } });
    };

    const handleArchiveItem = (id: string, type: ItemType) => {
        const key = getConfigKey(type);
        const updatedItems = (state.settingsDraft[key] as ManageableItem[]).map(item => item.id === id ? { ...item, isActive: false } : item);
        dispatch({ type: 'UPDATE_ITEMS', payload: { key, items: updatedItems } });
    };

    const handleRestoreItem = (id: string, type: ItemType) => {
        const key = getConfigKey(type);

        // TAREFA 4: Restrição de Contas Freemium (Impede restauro se >= 2 ativas)
        if (type === 'account' && subscriptionStatus === 'free') {
            const activeAccountCount = (state.settingsDraft.accounts || []).filter(a => a.isActive).length;
            if (activeAccountCount >= 2) {
                showToast("O plano Gratuito limita-se a 2 contas. Faz upgrade para Capitão para navegação ilimitada.", 'warning');
                return;
            }
        }

        const updatedItems = (state.settingsDraft[key] as ManageableItem[]).map(item => item.id === id ? { ...item, isActive: true } : item);
        dispatch({ type: 'UPDATE_ITEMS', payload: { key, items: updatedItems } });
    };

    const handleDeleteItem = (id: string, name: string, type: ItemType) => {
        dispatch({ type: 'SET_ITEM_TO_DELETE', payload: { id, name, type } });
    };

    const handleConfirmDeleteItem = () => {
        if (!state.itemToDelete) return;
        const { id, type } = state.itemToDelete;
        const key = getConfigKey(type);
        const updatedItems = (state.settingsDraft[key] as ManageableItem[]).filter(item => item.id !== id);
        dispatch({ type: 'UPDATE_ITEMS', payload: { key, items: updatedItems } });
        dispatch({ type: 'SET_ITEM_TO_DELETE', payload: null });
    };

    const handleNewNameChange = (type: ItemType, value: string) => {
        dispatch({ type: 'HANDLE_NEW_NAME_CHANGE', payload: { type, value } });
    }

    const handleSave = async () => {
        dispatch({ type: 'SET_IS_SAVING', payload: true });

        const validateNoDuplicates = (items: ManageableItem[], itemTypeName: string): boolean => {
            const names = new Set<string>();
            for (const item of items) {
                const lowerCaseName = item.name.trim().toLowerCase();
                if (lowerCaseName === '') continue;
                if (names.has(lowerCaseName)) {
                    showToast(`Nome duplicado em ${itemTypeName}: "${item.name}".`, 'error');
                    return false;
                }
                names.add(lowerCaseName);
            }
            return true;
        };

        if (!validateNoDuplicates(state.settingsDraft.accounts, 'Contas de Património')) {
            dispatch({ type: 'SET_IS_SAVING', payload: false });
            return;
        }
        if (!validateNoDuplicates(state.settingsDraft.incomeCategories, 'Categorias de Rendimento')) {
            dispatch({ type: 'SET_IS_SAVING', payload: false });
            return;
        }
        if (!validateNoDuplicates(state.settingsDraft.expenseCategories, 'Categorias de Despesa')) {
            dispatch({ type: 'SET_IS_SAVING', payload: false });
            return;
        }

        const sanitizedDraft = {
            ...state.settingsDraft,
            app_title: sanitize(state.settingsDraft.app_title).trim(),
            user_name: sanitize(state.settingsDraft.user_name || '').trim(),
            objetivo_label: sanitize(state.settingsDraft.objetivo_label).trim(),
            accounts: state.settingsDraft.accounts
                .map(a => ({ ...a, name: sanitize(a.name).trim() }))
                .filter(a => a.name !== ''),
            incomeCategories: state.settingsDraft.incomeCategories
                .map(c => ({ ...c, name: sanitize(c.name).trim() }))
                .filter(c => c.name !== ''),
            expenseCategories: state.settingsDraft.expenseCategories
                .map(c => ({ ...c, name: sanitize(c.name).trim() }))
                .filter(c => c.name !== ''),
        };

        await updateConfig(sanitizedDraft);
        showToast('Configurações guardadas com sucesso!', 'success');
        dispatch({ type: 'SET_IS_SAVING', payload: false });
    };

    const handleReset = () => {
        dispatch({ type: 'RESET_STATE', payload: { config } });
        showToast('Alterações repostas.', 'warning');
    };

    const handleCloseDeleteDataModal = () => {
        dispatch({ type: 'SET_DELETE_DATA_MODAL_OPEN', payload: false });
        setDeleteConfirmationText('');
    };

    const handleDeleteAllDataConfirm = async () => {
        await deleteAllData();
        handleCloseDeleteDataModal();
    };

    const handleSignOut = async () => {
        try {
            // Mostrar o toast ANTES de fazer o logout, para garantir que o utilizador o vê
            // antes de ser redirecionado (o que desmontaria o componente e potencialmente o toast)
            showToast('Até já! 👋', 'success');
            await signOut();
        } catch (error) {
            showToast('Erro ao terminar a sessão.', 'error');
        }
    };

    const handleUpgrade = () => {
        if (!user) return;

        if (!LEMON_SQUEEZY_CHECKOUT_URL) {
            showToast('Erro de configuração: URL de Checkout não definido.', 'error');
            console.error("Missing VITE_LEMON_SQUEEZY_CHECKOUT_URL");
            return;
        }

        // Adiciona o user_id aos custom data para o webhook processar depois
        const separator = LEMON_SQUEEZY_CHECKOUT_URL.includes('?') ? '&' : '?';
        const checkoutUrl = `${LEMON_SQUEEZY_CHECKOUT_URL}${separator}checkout[custom][user_id]=${user.id}`;
        window.open(checkoutUrl, '_blank');
    };

    const handlePortal = () => {
        if (!LEMON_SQUEEZY_PORTAL_URL) {
            showToast('Erro de configuração: URL do Portal não definido.', 'error');
            console.error("Missing VITE_LEMON_SQUEEZY_PORTAL_URL");
            return;
        }
        window.open(LEMON_SQUEEZY_PORTAL_URL, '_blank');
    };

    const hasChanges = JSON.stringify(config) !== JSON.stringify(state.settingsDraft);
    const passwordMismatch = newPassword && confirmNewPassword && newPassword !== confirmNewPassword;

    const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
        { id: 'geral', label: 'Geral', icon: Settings },
        { id: 'personalizacao', label: 'Personalização', icon: Palette },
        { id: 'ajuda', label: 'Ajuda', icon: HelpCircle },
        { id: 'conta', label: 'Conta', icon: User },
    ];

    const activeTabIndex = tabs.findIndex(t => t.id === state.activeTab);
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <>
            <div className="space-y-8 animate-fade-in-scale">
                <div className="space-y-2">
                    <nav className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                                className={`flex-1 group flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black ${state.activeTab === tab.id
                                        ? 'bg-white shadow-sm dark:bg-neutral-700 text-black dark:text-white'
                                        : 'text-neutral-500 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-700/60'
                                    }`}
                                aria-current={state.activeTab === tab.id ? 'page' : undefined}
                            >
                                <tab.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1 relative">
                        <div
                            className="absolute top-0 h-1 rounded-full bg-black dark:bg-white transition-all duration-300 ease-out"
                            style={{
                                width: `${100 / tabs.length}%`,
                                left: `${activeTabIndex * (100 / tabs.length)}%`
                            }}
                        ></div>
                    </div>
                </div>

                <div key={state.activeTab} className="animate-fade-in-scale">
                    {state.activeTab === 'geral' && (
                        <Card>
                            <h2 className="text-lg font-bold">Configurações Gerais</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">Ajusta os detalhes principais da tua aplicação.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label htmlFor="fiscal_year" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Ano Fiscal</label>
                                    <select
                                        id="fiscal_year"
                                        value={activeYear}
                                        onChange={(e) => setActiveYear(parseInt(e.target.value))}
                                        className={selectBase}
                                    >
                                        {yearOptions.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-neutral-400 mt-1">Controla os dados visíveis em toda a aplicação.</p>
                                </div>
                                <div>
                                    <label htmlFor="user_name" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">O Teu Nome</label>
                                    <input type="text" id="user_name" name="user_name" value={state.settingsDraft.user_name || ''} onChange={handleGeneralChange} placeholder="Como queres ser tratado?" className={inputBase} />
                                </div>
                                <div>
                                    <label htmlFor="simbolo_moeda" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Símbolo da Moeda</label>
                                    <select
                                        id="simbolo_moeda"
                                        name="simbolo_moeda"
                                        value={state.settingsDraft.simbolo_moeda}
                                        onChange={handleGeneralChange}
                                        className={selectBase}
                                    >
                                        {currencies.map(c => (
                                            <option key={`${c.code}-${c.symbol}`} value={c.symbol}>
                                                {c.symbol} - {c.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="objetivo_label" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Rótulo do Objetivo</label>
                                    <input type="text" id="objetivo_label" name="objetivo_label" value={state.settingsDraft.objetivo_label} onChange={handleGeneralChange} className={inputBase} />
                                </div>
                                <div>
                                    <label htmlFor="objetivo_patrimonio" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Objetivo de Património</label>
                                    <input type="number" id="objetivo_patrimonio" name="objetivo_patrimonio" value={state.settingsDraft.objetivo_patrimonio} onChange={handleGeneralChange} className={inputBase} />
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                                <ThemeSelector theme={theme} setTheme={setTheme} />
                            </div>
                        </Card>
                    )}

                    {state.activeTab === 'conta' && (
                        <div className="space-y-8">
                            {/* Card de Subscrição - Novo */}
                            <Card className="bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-black">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`p-2 rounded-full ${subscriptionStatus === 'premium' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                                                <Crown className="h-5 w-5" />
                                            </div>
                                            <h2 className="text-lg font-bold">Estado da Subscrição</h2>
                                        </div>
                                        <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md">
                                            {subscriptionStatus === 'premium'
                                                ? 'Parabéns, Capitão! Tens acesso ilimitado a todas as funcionalidades de navegação.'
                                                : 'Estás a navegar no plano Gratuito. Faz o upgrade para desbloquear contas ilimitadas e análises detalhadas.'
                                            }
                                        </p>
                                    </div>
                                    {subscriptionStatus === 'free' ? (
                                        <button
                                            onClick={handleUpgrade}
                                            className={`${btnBase} ${btnSize} ${btnPrimary} shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5`}
                                        >
                                            Upgrade para Capitão
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </button>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                                                <CheckCircle className="h-4 w-4" />
                                                Subscrição Ativa
                                            </div>
                                            <button
                                                onClick={handlePortal}
                                                className={`${btnBase} ${btnSize} ${btnSecondary}`}
                                            >
                                                Gerir Subscrição
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card>
                                <h2 className="text-lg font-bold">Os Teus Dados</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">Faz o download de toda a tua informação em formato JSON para backup.</p>
                                <div className="mt-6">
                                    <button
                                        onClick={exportData}
                                        className={`${btnBase} ${btnSize} ${btnSecondary} w-full sm:w-auto`}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Exportar Dados (JSON)
                                    </button>
                                </div>
                            </Card>
                            <Card>
                                <h2 className="text-lg font-bold">Alterar Email</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">O teu email de acesso atual é <strong className="font-semibold">{user?.email}</strong>.</p>
                                <form onSubmit={handleEmailUpdate} className="space-y-4 mt-6">
                                    <div>
                                        <label htmlFor="new-email" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Novo Email</label>
                                        <input type="email" id="new-email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="novo.email@exemplo.com" className={inputBase} />
                                    </div>
                                    <div>
                                        <label htmlFor="password-for-email" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Password Atual</label>
                                        <PasswordInput id="password-for-email" value={passwordForEmail} onChange={e => setPasswordForEmail(e.target.value)} required placeholder="A tua password atual" autoComplete="current-password" />
                                    </div>
                                    {emailError && <p className="text-sm text-red-600 dark:text-red-500">{emailError}</p>}
                                    <div className="pt-2">
                                        <button type="submit" disabled={isUpdatingEmail} className={`${btnBase} ${btnSize} ${btnPrimary} w-full sm:w-auto`}>
                                            {isUpdatingEmail ? (
                                                <>
                                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                    A guardar...
                                                </>
                                            ) : (
                                                'Guardar Email'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Card>
                            <Card>
                                <h2 className="text-lg font-bold">Alterar Password</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">Altera a tua password de acesso.</p>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4 mt-6">
                                    <div>
                                        <label htmlFor="current-password" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Password Atual</label>
                                        <PasswordInput id="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="A tua password atual" autoComplete="current-password" />
                                    </div>
                                    <div>
                                        <label htmlFor="new-password" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Nova Password</label>
                                        <PasswordInput id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="A tua nova password" autoComplete="new-password" />
                                        <PasswordStrengthMeter password={newPassword} />
                                    </div>
                                    <div>
                                        <label htmlFor="confirm-new-password" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Confirmar Nova Password</label>
                                        <PasswordInput id="confirm-new-password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required placeholder="Confirma a nova password" autoComplete="new-password" />
                                        {passwordMismatch && <p className="text-sm text-red-600 dark:text-red-500 mt-1 px-1">As passwords não coincidem.</p>}
                                    </div>
                                    {passwordError && <p className="text-sm text-red-600 dark:text-red-500">{passwordError}</p>}
                                    <div className="pt-2">
                                        <button type="submit" disabled={isUpdatingPassword || passwordMismatch || !currentPassword || !newPassword} className={`${btnBase} ${btnSize} ${btnPrimary} w-full sm:w-auto`}>
                                            {isUpdatingPassword ? (
                                                <>
                                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                    A guardar...
                                                </>
                                            ) : (
                                                'Guardar Password'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Card>
                            <Card>
                                <h2 className="text-lg font-bold">Gestão da Sessão</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">Termina a tua sessão atual neste dispositivo.</p>
                                <div className="mt-6">
                                    <button
                                        onClick={handleSignOut}
                                        className={`${btnBase} ${btnSize} ${btnSecondary} w-full sm:w-auto`}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Terminar Sessão
                                    </button>
                                </div>
                            </Card>
                            <Card>
                                <h2 className="text-lg font-bold">Zona de Perigo</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">Esta ação é destrutiva e não pode ser desfeita.</p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => dispatch({ type: 'SET_DELETE_DATA_MODAL_OPEN', payload: true })}
                                        className={`${btnBase} ${btnSize} ${btnDanger} w-full sm:w-auto`}
                                    >
                                        Apagar Todos os Dados
                                    </button>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                        Isto irá apagar permanentemente todas as tuas transações e registos de património. A tua conta e configurações serão mantidas.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    )}

                    {state.activeTab === 'personalizacao' && (
                        <div className="space-y-8">
                            <ItemManager
                                title="Categorias de Rendimento"
                                items={state.settingsDraft.incomeCategories}
                                itemType="incomeCategory"
                                newItemPlaceholder="Nova categoria de rendimento"
                                newNames={state.newNames}
                                handleNewNameChange={handleNewNameChange}
                                handleAddItem={handleAddItem}
                                handleUpdateItemName={handleUpdateItemName}
                                handleArchiveItem={handleArchiveItem}
                                handleRestoreItem={handleRestoreItem}
                                handleDeleteItem={handleDeleteItem}
                            />
                            <ItemManager
                                title="Categorias de Despesa"
                                items={state.settingsDraft.expenseCategories}
                                itemType="expenseCategory"
                                newItemPlaceholder="Nova categoria de despesa"
                                newNames={state.newNames}
                                handleNewNameChange={handleNewNameChange}
                                handleAddItem={handleAddItem}
                                handleUpdateItemName={handleUpdateItemName}
                                handleArchiveItem={handleArchiveItem}
                                handleRestoreItem={handleRestoreItem}
                                handleDeleteItem={handleDeleteItem}
                            />
                            <ItemManager
                                title="Contas de Património"
                                description={`Adiciona, remove e renomeia as contas para corresponderem às tuas finanças.${subscriptionStatus === 'free' ? ' (Máx. 2 no plano Free)' : ''}`}
                                items={state.settingsDraft.accounts}
                                itemType="account"
                                newItemPlaceholder="Nova conta de património"
                                newNames={state.newNames}
                                handleNewNameChange={handleNewNameChange}
                                handleAddItem={handleAddItem}
                                handleUpdateItemName={handleUpdateItemName}
                                handleArchiveItem={handleArchiveItem}
                                handleRestoreItem={handleRestoreItem}
                                handleDeleteItem={handleDeleteItem}
                            />
                            {subscriptionStatus === 'free' && (
                                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-black rounded-full">
                                        <Crown className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Limite do Plano Gratuito</h4>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Estás limitado a 2 contas de património. Faz upgrade para ilimitado.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {state.activeTab === 'ajuda' && (
                        <div className="space-y-6">
                            <Card>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                                        <Logo variant="icon" className="h-8 w-8 text-black dark:text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Manual do Navegador</h2>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Bem-vindo à tua expedição financeira.</p>
                                    </div>
                                </div>

                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <div className="bg-neutral-50 dark:bg-neutral-800/30 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 mb-8">
                                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-black dark:text-white">
                                            <Anchor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            A Filosofia da Caravel
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-300 mb-0 leading-relaxed">
                                            Controlo 100% manual. Com uma rotina de 5 minutos por mês, registas o essencial para entenderes a tua evolução financeira sem a complexidade de ligar contas bancárias. Tu és o capitão.
                                        </p>
                                    </div>

                                    <h3 className="text-lg font-bold mb-4">Os 4 Instrumentos Principais</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 not-prose">
                                        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                            <LayoutDashboard className="h-6 w-6 mb-3 text-blue-600 dark:text-blue-500" />
                                            <h4 className="font-bold text-sm mb-1">Dashboard (A Ponte de Comando)</h4>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                                A tua visão geral. Encontras o gráfico do património, a Bússola com a análise mensal e o Leme de Gastos.
                                            </p>
                                        </div>
                                        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                            <Scroll className="h-6 w-6 mb-3 text-amber-700 dark:text-amber-500" />
                                            <h4 className="font-bold text-sm mb-1">Transações (O Diário de Bordo)</h4>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                                Regista o teu "combustível" (Rendimentos) e "mantimentos" (Despesas). Usa os filtros para analisar os teus hábitos.
                                            </p>
                                        </div>
                                        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                            <Map className="h-6 w-6 mb-3 text-emerald-600 dark:text-emerald-500" />
                                            <h4 className="font-bold text-sm mb-1">Património (O Mapa de Navegação)</h4>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                                Marca a tua posição exata. O formulário pré-preenche os dados do mês anterior para facilitar a atualização mensal.
                                            </p>
                                        </div>
                                        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                            <Settings className="h-6 w-6 mb-3 text-neutral-600 dark:text-neutral-400" />
                                            <h4 className="font-bold text-sm mb-1">Definições (A Casa das Máquinas)</h4>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                                Afina os instrumentos. Personaliza categorias, contas, o tema visual e gere os teus dados de utilizador.
                                            </p>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold mb-4">A Tua Bússola: Entender os KPIs</h3>
                                    <div className="space-y-4 mb-8">
                                        <p className="text-neutral-600 dark:text-neutral-300">A Bússola (no Dashboard) decompõe o teu crescimento mensal em duas forças:</p>

                                        <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mt-1">
                                                <Wind className="h-4 w-4 text-green-700 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <strong className="block text-sm text-black dark:text-white">Do Teu Esforço (Poupança / Vento de Feição)</strong>
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                    O resultado direto das tuas ações: Rendimentos menos Despesas. Se for positivo, o vento sopra a favor.
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mt-1">
                                                <Waves className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <strong className="block text-sm text-black dark:text-white">Do Teu Dinheiro (Ativos / Correntes)</strong>
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                    O que o teu dinheiro fez por si só (valorização de investimentos ou despesas esquecidas). Se for positivo, a corrente ajuda; se negativo, é um alerta.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold mb-4">Dicas para Dominar a Navegação</h3>
                                    <div className="bg-neutral-50 dark:bg-neutral-800/30 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
                                        <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300 list-disc pl-4">
                                            <li><strong className="text-black dark:text-white">A Rotina Mensal:</strong> Tira 5 minutos no dia 1 de cada mês. Regista os totais de despesas/rendimentos do mês passado e atualiza o saldo das contas.</li>
                                            <li><strong className="text-black dark:text-white">Arquivar vs Apagar:</strong> Se já não usas uma conta ou categoria, arquiva-a nas Definições para manteres o histórico intacto.</li>
                                            <li><strong className="text-black dark:text-white">Protocolos de Emergência:</strong> Podes exportar os teus dados (JSON) a qualquer momento na secção "Conta" para salvaguarda.</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {hasChanges && (
                <div className="fixed bottom-24 sm:bottom-4 inset-x-0 z-10 flex justify-center px-4 animate-fade-in-scale">
                    <div className="p-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 rounded-xl shadow-lg">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block mr-4">Tens alterações não guardadas.</p>
                        <button
                            onClick={handleReset}
                            className={`${btnBase} ${btnSize} ${btnSecondary}`}
                        >
                            Repor
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={state.isSaving}
                            className={`${btnBase} ${btnSize} ${btnPrimary}`}
                        >
                            {state.isSaving ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    A guardar...
                                </>
                            ) : (
                                'Guardar Alterações'
                            )}
                        </button>
                    </div>
                </div>
            )}

            <ActionModal
                isOpen={!!state.itemToDelete}
                onClose={() => dispatch({ type: 'SET_ITEM_TO_DELETE', payload: null })}
                title={`Eliminar "${state.itemToDelete?.name}"`}
                actions={[
                    { text: 'Cancelar', onClick: () => dispatch({ type: 'SET_ITEM_TO_DELETE', payload: null }), intent: 'secondary' },
                    { text: 'Sim, Eliminar', onClick: handleConfirmDeleteItem, intent: 'danger' }
                ]}
            >
                <p>Tens a certeza? Esta ação é irreversível e irá remover o item permanentemente. As transações associadas não serão eliminadas, mas ficarão sem categoria/conta.</p>
            </ActionModal>

            <ActionModal
                isOpen={state.isDeleteDataModalOpen}
                onClose={handleCloseDeleteDataModal}
                title="Confirmar Eliminação Total"
                actions={[
                    { text: 'Cancelar', onClick: handleCloseDeleteDataModal, intent: 'secondary' },
                    {
                        text: 'Sim, Eliminar Tudo',
                        onClick: handleDeleteAllDataConfirm,
                        intent: 'danger',
                        disabled: deleteConfirmationText.trim().toLowerCase() !== 'apagar tudo',
                    }
                ]}
            >
                <div className="space-y-4">
                    <p>
                        Esta ação é <strong className="font-bold text-red-600 dark:text-red-500">permanente e irreversível</strong>.
                        Todos os teus registos de transações e património serão eliminados para sempre.
                        Esta ação não pode ser desfeita.
                    </p>
                    <div>
                        <label htmlFor="delete-confirm" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                            Para confirmar, escreve <strong className="font-mono text-black dark:text-white">apagar tudo</strong> no campo abaixo.
                        </label>
                        <input
                            id="delete-confirm"
                            type="text"
                            value={deleteConfirmationText}
                            onChange={(e) => setDeleteConfirmationText(e.target.value)}
                            className={inputBase}
                            autoComplete="off"
                            autoFocus
                        />
                    </div>
                </div>
            </ActionModal>
        </>
    );
};

export default SettingsPage;