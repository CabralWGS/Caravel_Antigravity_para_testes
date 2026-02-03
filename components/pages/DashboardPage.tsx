
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip, ReferenceLine, PieChart, Pie, Cell, Sector } from 'recharts';
import { Card } from '../ui/Card.tsx';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus, Lock, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, Activity, CalendarDays, Compass, Anchor, Wind, Waves, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.tsx';
import { CustomChartTooltip } from '../ui/CustomChartTooltip.tsx';
import { useFinancialSummary } from '../../hooks/useFinancialSummary.ts';
import { Transaction, PatrimonioEntry, Account } from '../../types.ts';
import { getCategoryColor, getTransactionDescription } from '../../constants.ts';
import { OnboardingModal } from '../ui/OnboardingModal.tsx';
import { Logo } from '../ui/Logo.tsx';
import { Tooltip } from '../ui/Tooltip.tsx';


type TimeRange = '3M' | '6M' | '1Y' | 'Max';
type ExpenseTimeRange = '1M' | '3M' | 'YTD';
type AssetTimeRange = '1M' | '3M' | 'YTD';

// Styling Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-5 py-2 text-sm';
const btnLight = 'bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 focus-visible:ring-black dark:focus-visible:ring-white';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';

const ASSET_COLORS = [
    '#3b82f6', // Blue 500
    '#8b5cf6', // Violet 500
    '#10b981', // Emerald 500
    '#06b6d4', // Cyan 500
    '#6366f1', // Indigo 500
    '#14b8a6', // Teal 500
    '#f43f5e', // Rose 500
    '#f59e0b', // Amber 500
];

const getAssetColor = (index: number) => ASSET_COLORS[index % ASSET_COLORS.length];

const PremiumLock: React.FC<{
    isLocked: boolean;
    children: React.ReactNode;
    className?: string;
}> = ({ isLocked, children, className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <div className={`transition-all duration-300 ${isLocked ? 'blur-sm opacity-40 select-none pointer-events-none grayscale' : ''}`}>
                {children}
            </div>
            {isLocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-full mb-2 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700">
                        <Lock className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                    </div>
                    <Link
                        to="/app/settings?tab=conta"
                        className="text-xs font-bold text-black dark:text-white hover:underline"
                    >
                        Desbloquear
                    </Link>
                </div>
            )}
        </div>
    );
};


const AssetAllocationPanel: React.FC<{
    entries: PatrimonioEntry[];
    accounts: Account[];
    currencySymbol: string;
}> = ({ entries, accounts, currencySymbol }) => {
    const [timeRange, setTimeRange] = React.useState<AssetTimeRange>('1M');
    const [hoveredAccount, setHoveredAccount] = React.useState<string | null>(null);

    const timeRanges: { id: AssetTimeRange; label: string; }[] = [
        { id: '1M', label: '1M' },
        { id: '3M', label: '3M' },
        { id: 'YTD', label: 'YTD' },
    ];

    const data = React.useMemo(() => {
        if (entries.length === 0) return { items: [], total: 0, date: '' };

        const sorted = [...entries].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        const latest = sorted[sorted.length - 1];
        const latestDate = new Date(latest.data);

        let comparisonEntry: PatrimonioEntry | null = null;

        if (sorted.length > 1) {
            if (timeRange === '1M') {
                comparisonEntry = sorted[sorted.length - 2];
            } else {
                let targetDate: Date;
                const currentYear = latestDate.getFullYear();
                const currentMonth = latestDate.getMonth();

                if (timeRange === '3M') {
                    targetDate = new Date(currentYear, currentMonth - 3, 1);
                } else { // YTD
                    targetDate = new Date(currentYear, 0, 1);
                }

                comparisonEntry = sorted.find(e => {
                    const d = new Date(e.data);
                    return d >= targetDate && e.id !== latest.id;
                }) || sorted[0];

                if (comparisonEntry?.id === latest.id) comparisonEntry = null;
            }
        }

        const items = accounts
            .map((acc, index) => {
                const currentValue = latest.account_values[acc.id] || 0;
                const previousValue = comparisonEntry ? (comparisonEntry.account_values[acc.id] || 0) : 0;
                const variation = comparisonEntry ? currentValue - previousValue : 0;

                if (!acc.isActive && currentValue === 0) return null;

                return {
                    id: acc.id,
                    name: acc.name,
                    value: currentValue,
                    variation: variation,
                    hasPrevious: !!comparisonEntry,
                    color: getAssetColor(index)
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null && item.value > 0)
            .sort((a, b) => b.value - a.value);

        return {
            items,
            total: latest.total_patrimonio,
            date: latest.data
        };
    }, [entries, accounts, timeRange]);

    const renderActiveShape = (props: any) => <Sector {...props} />;

    const renderInactiveShape = (props: any) => {
        if (hoveredAccount !== null) {
            const { outerRadius, innerRadius } = props;
            const thickness = outerRadius - innerRadius;
            const finalInnerRadius = outerRadius - (thickness * 0.8);
            return <Sector {...props} innerRadius={finalInnerRadius} opacity={0.6} />;
        }
        return <Sector {...props} />;
    };

    if (data.items.length === 0) {
        return (
            <Card className="h-full flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold">Onde está o dinheiro?</h3>
                </div>
                <div className="flex-1 flex items-center justify-center text-center p-4">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Regista o teu património para veres a alocação de ativos.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="h-full flex flex-col" onMouseLeave={() => setHoveredAccount(null)}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">Onde está o dinheiro?</h3>
                </div>
                <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg self-end sm:self-center">
                    {timeRanges.map(range => (
                        <button key={range.id} onClick={() => setTimeRange(range.id)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${timeRange === range.id ? 'bg-white dark:bg-neutral-600 text-black dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>{range.label}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                <div className="h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.items}
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="90%"
                                paddingAngle={3}
                                dataKey="value"
                                onMouseEnter={(d) => setHoveredAccount(d.id)}
                                activeShape={renderActiveShape}
                                inactiveShape={renderInactiveShape}
                                // @ts-ignore
                                activeIndex={data.items.findIndex(i => i.id === hoveredAccount)}
                            >
                                {data.items.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Total</p>
                            <p className="text-xl font-bold tracking-tight">{currencySymbol}{data.total.toLocaleString('pt-PT', { notation: "compact", maximumFractionDigits: 1 })}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {data.items.map((item) => {
                        const percentage = (item.value / data.total) * 100;
                        const isHovered = hoveredAccount === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`p-2 rounded-lg transition-all duration-200 cursor-default ${isHovered ? 'bg-neutral-50 dark:bg-neutral-800/60' : ''}`}
                                onMouseEnter={() => setHoveredAccount(item.id)}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                                        <span className="text-sm font-medium truncate">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold font-mono">{currencySymbol}{item.value.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                </div>

                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex-grow h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }}></div>
                                    </div>

                                    {item.hasPrevious && Math.abs(item.variation) > 0.01 ? (
                                        <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.variation > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {item.variation > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                            <span>{currencySymbol}{Math.abs(item.variation).toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    ) : item.hasPrevious ? (
                                        <div className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                                            <Minus className="h-3 w-3" />
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Card>
    );
};


const ExpenseAnalysisPanel: React.FC<{
    transactions: Transaction[];
    categoryMap: Map<string, string>;
    accountMap: Map<string, string>;
    currencySymbol: string;
    theme: 'light' | 'dark' | 'system';
}> = ({ transactions, categoryMap, accountMap, currencySymbol, theme }) => {
    const [timeRange, setTimeRange] = React.useState<ExpenseTimeRange>('3M');
    const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = React.useState<{ id: string; name: string } | null>(null);

    const timeRanges: { id: ExpenseTimeRange; label: string; }[] = [
        { id: '1M', label: '1M' },
        { id: '3M', label: '3M' },
        { id: 'YTD', label: 'YTD' },
    ];

    const expenseData = React.useMemo(() => {
        const today = new Date();

        const getDatesForRange = (range: ExpenseTimeRange) => {
            let start: Date;
            let prevStart: Date;
            let prevEnd: Date;

            if (range === '1M') {
                // Mês atual vs Mês anterior
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                prevStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                prevEnd = new Date(today.getFullYear(), today.getMonth(), 0);
            } else if (range === '3M') {
                // Últimos 3 meses vs 3 meses anteriores
                start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
                prevStart = new Date(today.getFullYear(), today.getMonth() - 5, 1);
                prevEnd = new Date(today.getFullYear(), today.getMonth() - 2, 0);
            } else { // YTD
                // Ano atual vs Ano anterior
                start = new Date(today.getFullYear(), 0, 1);
                prevStart = new Date(today.getFullYear() - 1, 0, 1);
                prevEnd = new Date(today.getFullYear() - 1, 11, 31);
            }
            return { start, end: today, prevStart, prevEnd };
        };

        const { start, end, prevStart, prevEnd } = getDatesForRange(timeRange);

        const filterTransactions = (s: Date, e: Date) => transactions.filter(t => {
            if (t.tipo !== 'despesa' || !t.data) return false;
            const parts = t.data.split('-').map(Number);
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            return d >= s && d <= e;
        });

        const currentExpenses = filterTransactions(start, end);
        const previousExpenses = filterTransactions(prevStart, prevEnd);

        if (currentExpenses.length === 0 && previousExpenses.length === 0) return { data: [], total: 0 };

        const currentTotals = currentExpenses.reduce((acc: Record<string, number>, t) => {
            const catId = t.categoria_id || 'unknown';
            acc[catId] = (acc[catId] || 0) + Number(t.valor);
            return acc;
        }, {} as Record<string, number>);

        const previousTotals = previousExpenses.reduce((acc: Record<string, number>, t) => {
            const catId = t.categoria_id || 'unknown';
            acc[catId] = (acc[catId] || 0) + Number(t.valor);
            return acc;
        }, {} as Record<string, number>);

        const allCategoryIds = Array.from(new Set([...Object.keys(currentTotals), ...Object.keys(previousTotals)]));

        const sortedExpenses = allCategoryIds
            .map(id => {
                const currentVal = currentTotals[id] || 0;
                const prevVal = previousTotals[id] || 0;
                const variation = currentVal - prevVal;
                return {
                    id,
                    name: categoryMap.get(id) || 'Desconhecido',
                    value: currentVal,
                    variation,
                    hasPrevious: previousExpenses.length > 0
                };
            })
            .filter(item => item.value > 0 || Math.abs(item.variation) > 0.01)
            .sort((a, b) => b.value - a.value);

        const total = currentExpenses.reduce((sum, t) => sum + Number(t.valor), 0);

        return { data: sortedExpenses, total };
    }, [transactions, categoryMap, timeRange]);

    const transactionsForSelectedCategory = React.useMemo(() => {
        if (!selectedCategory) return [];
        const today = new Date();
        let start: Date;

        if (timeRange === '1M') start = new Date(today.getFullYear(), today.getMonth(), 1);
        else if (timeRange === '3M') start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        else start = new Date(today.getFullYear(), 0, 1);

        return transactions
            .filter(t => {
                if (t.tipo !== 'despesa' || t.categoria_id !== selectedCategory.id) return false;
                const parts = t.data.split('-').map(Number);
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                return d >= start && d <= today;
            })
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    }, [selectedCategory, transactions, timeRange]);

    const activeIndex = React.useMemo(() => {
        if (hoveredCategory === null) return -1;
        return expenseData.data.findIndex(d => d.id === hoveredCategory);
    }, [hoveredCategory, expenseData.data]);

    const renderActiveShape = (props: any) => <Sector {...props} />;
    const renderInactiveShape = (props: any) => {
        if (hoveredCategory !== null) {
            const { outerRadius, innerRadius } = props;
            const finalInnerRadius = outerRadius - (outerRadius - innerRadius) * 0.8;
            return <Sector {...props} innerRadius={finalInnerRadius} opacity={0.6} />;
        }
        return <Sector {...props} />;
    };

    if (expenseData.total === 0 && expenseData.data.length === 0) {
        return (
            <Card className="h-full flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold">Análise de Despesas</h3>
                    <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg self-end sm:self-center">
                        {timeRanges.map(range => (
                            <button key={range.id} onClick={() => setTimeRange(range.id)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${timeRange === range.id ? 'bg-white dark:bg-neutral-600 text-black dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>{range.label}</button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">Nenhuma despesa registada neste período para analisar.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col" onMouseLeave={() => setHoveredCategory(null)}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h3 className="text-lg font-bold">Análise de Despesas</h3>
                <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg self-end sm:self-center">
                    {timeRanges.map(range => (
                        <button key={range.id} onClick={() => { setTimeRange(range.id); setSelectedCategory(null); }} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${timeRange === range.id ? 'bg-white dark:bg-neutral-600 text-black dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>{range.label}</button>
                    ))}
                </div>
            </div>

            <div key={timeRange} className="animate-fade-in-scale flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center h-full">
                    <div className="h-56 relative mx-auto w-full max-w-[240px] sm:max-w-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData.data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius="60%"
                                    outerRadius="90%"
                                    dataKey="value"
                                    onMouseEnter={(data) => setHoveredCategory(data.id)}
                                    paddingAngle={3}
                                    // @ts-ignore
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    inactiveShape={renderInactiveShape}
                                >
                                    {expenseData.data.map((entry) => (
                                        <Cell key={`cell-${entry.id}`} fill={getCategoryColor(entry.name)} strokeWidth={0} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Total</p>
                                <p className="text-xl font-bold tracking-tight">{currencySymbol}{expenseData.total.toLocaleString('pt-PT', { notation: "compact", maximumFractionDigits: 1 })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-full max-h-64 overflow-y-auto pr-1 relative custom-scrollbar">
                        {selectedCategory ? (
                            <div key={selectedCategory.id} className="animate-fade-in-scale">
                                <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white dark:bg-neutral-900 py-2 z-10 border-b border-neutral-50 dark:border-neutral-800">
                                    <button onClick={() => setSelectedCategory(null)} className="p-1 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2">
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                    <h4 className="font-bold text-sm truncate">{selectedCategory.name}</h4>
                                </div>
                                <div className="space-y-3">
                                    {transactionsForSelectedCategory.map(t => (
                                        <div key={t.id} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-xs">{getTransactionDescription(t, accountMap, categoryMap)}</p>
                                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{t.data}</p>
                                            </div>
                                            <p className={`font-mono tracking-tight font-semibold text-xs`}>{currencySymbol}{t.valor.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div key="categories" className="animate-fade-in-scale space-y-1">
                                {expenseData.data.map(entry => {
                                    const percentage = expenseData.total > 0 ? (entry.value / expenseData.total) * 100 : 0;
                                    const isHovered = hoveredCategory === entry.id;
                                    const hasVariation = entry.hasPrevious && Math.abs(entry.variation) > 0.01;

                                    return (
                                        <div
                                            key={`legend-${entry.id}`}
                                            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${isHovered ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
                                            onMouseEnter={() => setHoveredCategory(entry.id)}
                                            onClick={() => setSelectedCategory({ id: entry.id, name: entry.name })}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getCategoryColor(entry.name) }}></span>
                                                    <span className="font-medium text-sm truncate">{entry.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono tracking-tight font-semibold text-sm">{currencySymbol}{entry.value.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</span>
                                                    {hasVariation && (
                                                        <Tooltip text={`Variação de ${currencySymbol}${Math.abs(entry.variation).toFixed(2)} vs período anterior`}>
                                                            <div className={`flex items-center px-1 py-0.5 rounded text-[10px] font-bold ${entry.variation > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                                                {entry.variation > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                                            </div>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: getCategoryColor(entry.name) }}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};


const formatMonthYear = (dateStr: string) => {
    if (typeof dateStr !== 'string' || !dateStr.includes('-')) {
        return dateStr;
    }
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    if (isNaN(date.getTime())) {
        return dateStr;
    }
    const formattedDate = date.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};


const DashboardPage: React.FC = () => {
    const { user, config, processedConfig, patrimonioEntries, transactions, theme, hasCompletedOnboarding, completeOnboarding, isLoading, subscriptionStatus, error, refreshData } = useAppContext();
    const [timeRange, setTimeRange] = React.useState<TimeRange>('Max');
    const [showOnboarding, setShowOnboarding] = React.useState(false);

    const sortedPatrimonioEntries = React.useMemo(() =>
        patrimonioEntries.filter(e => e && e.data).slice().sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()),
        [patrimonioEntries]);

    // Initial Compass Date Logic
    const [compassDate, setCompassDate] = React.useState<Date>(() => new Date());

    React.useEffect(() => {
        if (sortedPatrimonioEntries.length > 0) {
            const lastEntry = sortedPatrimonioEntries[sortedPatrimonioEntries.length - 1];
            // Use ISO string to ensure consistent parsing
            const lastDate = new Date(lastEntry.data);
            if (!isNaN(lastDate.getTime())) {
                setCompassDate(lastDate);
            }
        }
    }, [sortedPatrimonioEntries.length]);

    React.useEffect(() => {
        if (!hasCompletedOnboarding && !isLoading && !error) {
            const timer = setTimeout(() => {
                setShowOnboarding(true);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [hasCompletedOnboarding, isLoading, error]);

    const handleCompleteOnboarding = async () => {
        await completeOnboarding();
        setShowOnboarding(false);
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-fade-in">
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
                </div>
                <div className="text-center max-w-md px-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Não foi possível carregar os dados</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">{error}</p>
                </div>
                <button
                    onClick={refreshData}
                    className="inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black px-6 py-2.5 text-sm bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                </button>
            </div>
        );
    }

    const formatCurrency = (value: number) => `${config.simbolo_moeda}${value.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const latestEntry = sortedPatrimonioEntries.length > 0 ? sortedPatrimonioEntries[sortedPatrimonioEntries.length - 1] : null;
    const currentPatrimonio = latestEntry ? latestEntry.total_patrimonio : 0;

    // Use a string representation for consistent lookups (YYYY-MM)
    const compassMonthStr = `${compassDate.getFullYear()}-${String(compassDate.getMonth() + 1).padStart(2, '0')}`;

    const financialSummary = useFinancialSummary(
        transactions,
        sortedPatrimonioEntries,
        currentPatrimonio,
        config.accounts,
        compassMonthStr + '-01' // Pass valid date string to helper
    );

    const navigateCompass = (direction: 'prev' | 'next') => {
        setCompassDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };

    const filteredPatrimonioData = React.useMemo(() => {
        if (timeRange === 'Max' || sortedPatrimonioEntries.length === 0) return sortedPatrimonioEntries;

        const now = new Date();
        let monthsToSubtract = 0;
        if (timeRange === '3M') monthsToSubtract = 3;
        if (timeRange === '6M') monthsToSubtract = 6;
        if (timeRange === '1Y') monthsToSubtract = 12;

        const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsToSubtract, 1);

        return sortedPatrimonioEntries.filter(entry => entry.data && new Date(entry.data) >= cutoffDate);
    }, [sortedPatrimonioEntries, timeRange]);


    const chartData = React.useMemo(() => {
        const dataForChart = filteredPatrimonioData.length > 0 ? filteredPatrimonioData : sortedPatrimonioEntries;

        if (dataForChart.length === 0) {
            return [{ name: 'Start', value: 0 }];
        }

        return dataForChart
            .filter(entry => entry && entry.data)
            .map(entry => ({
                name: entry.data.slice(0, 7),
                value: entry.total_patrimonio,
            }));
    }, [filteredPatrimonioData, sortedPatrimonioEntries]);

    const initialValue = chartData.length > 0 ? chartData[0].value : 0;
    const strokeColor = "#3b82f6";

    const patrimonioGoal = parseFloat(config.objetivo_patrimonio);
    const progress = patrimonioGoal > 0 ? (currentPatrimonio / patrimonioGoal) * 100 : 0;

    const categoryMap = React.useMemo(() => {
        const map = new Map<string, string>();
        processedConfig.allIncomeCategories.forEach(c => map.set(c.id, c.name));
        processedConfig.allExpenseCategories.forEach(c => map.set(c.id, c.name));
        return map;
    }, [processedConfig.allIncomeCategories, processedConfig.allExpenseCategories]);

    const accountMap = React.useMemo(() => {
        const map = new Map<string, string>();
        processedConfig.allAccounts.forEach(a => map.set(a.id, a.name));
        return map;
    }, [processedConfig.allAccounts]);

    const displayName = config.user_name || user?.email?.split('@')[0] || 'Navegador';


    return (
        <>
            <OnboardingModal isOpen={showOnboarding} onComplete={handleCompleteOnboarding} />
            <div className="space-y-8 animate-fade-in-scale pb-8">
                <div className="flex items-center gap-4">
                    <Logo variant="icon" className="h-12 w-12 flex-shrink-0" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                            Olá, <span className="font-extrabold">{displayName}</span>!
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Bem-vindo à tua Ponte de Comando.</p>
                    </div>
                </div>

                <Card>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                            <h2 className="text-lg font-bold">{config.objetivo_label}</h2>
                            <p className="text-3xl font-extrabold tracking-tight">{formatCurrency(currentPatrimonio)}</p>
                        </div>
                        <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                            {(['3M', '6M', '1Y', 'Max'] as TimeRange[]).map(range => (
                                <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors ${timeRange === range ? 'bg-white dark:bg-neutral-600 text-black dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-60 -mx-6 sm:mx-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <RechartsTooltip
                                    content={<CustomChartTooltip
                                        initialValue={initialValue}
                                        currencySymbol={config.simbolo_moeda}
                                    />}
                                    cursor={false}
                                />
                                <ReferenceLine
                                    y={initialValue}
                                    stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}
                                    strokeDasharray="2 4"
                                    strokeOpacity={0.5}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={strokeColor}
                                    fillOpacity={1}
                                    fill="url(#colorUv)"
                                    strokeWidth={2}
                                    activeDot={{
                                        r: 5,
                                        strokeWidth: 2,
                                        fill: strokeColor,
                                        stroke: theme === 'dark' ? '#000' : '#fff'
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Progresso</span>
                            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Objetivo: {formatCurrency(patrimonioGoal)}</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                            <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                        <p className="text-right text-sm mt-1 text-neutral-500 dark:text-neutral-400">{progress.toFixed(1)}%</p>
                    </div>
                </Card>

                {financialSummary ? (
                    <Card className="flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigateCompass('prev')}
                                    className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <h3 className="font-bold whitespace-nowrap flex items-center gap-2 text-lg">
                                    <Compass className="h-5 w-5" />
                                    <span>Bússola: {formatMonthYear(financialSummary.monthAnalyzed)}</span>
                                </h3>
                                <button
                                    onClick={() => navigateCompass('next')}
                                    className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                            {financialSummary.isOngoing ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full animate-pulse border border-blue-100 dark:border-blue-900/30">
                                    <Activity className="h-3 w-3" />
                                    <span>Em Curso</span>
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-bold rounded-full">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Fechado</span>
                                </div>
                            )}
                        </div>

                        {/* Grid de 3 Colunas */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 divide-y lg:divide-y-0 lg:divide-x dark:divide-neutral-800">

                            {/* Coluna 1: O Rumo (Património) */}
                            <div className="flex flex-col gap-4 lg:pr-8">
                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    <Anchor className="h-4 w-4" />
                                    O Rumo
                                </div>
                                <div>
                                    {financialSummary.patrimonyTotal !== null ? (
                                        <>
                                            <p className="text-3xl font-extrabold tracking-tight">{formatCurrency(financialSummary.patrimonyTotal)}</p>
                                            <div className={`flex items-center gap-2 mt-1 text-sm font-bold ${financialSummary.patrimonyVariation >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                                                {financialSummary.patrimonyVariation >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                <span>{financialSummary.patrimonyVariation >= 0 ? '+' : ''}{formatCurrency(financialSummary.patrimonyVariation)}</span>
                                                <span className="opacity-60 font-medium">({financialSummary.patrimonyVariationPercent.toFixed(1)}%)</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col justify-center h-full">
                                            <p className="text-lg font-bold text-neutral-400 dark:text-neutral-500">Sem registo de património.</p>
                                            <Link to="/app/patrimonio" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 font-medium">
                                                + Registar agora
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                {financialSummary.patrimonyTotal !== null && (
                                    <div className="space-y-2 mt-2">
                                        {financialSummary.topAccountIncreases.map(acc => (
                                            <div key={acc.accountId} className="flex justify-between items-center text-sm">
                                                <span className="truncate text-neutral-600 dark:text-neutral-400 max-w-[140px]">{accountMap.get(acc.accountId)}</span>
                                                <span className="text-green-600 dark:text-green-500 font-mono font-semibold">+{formatCurrency(acc.value)}</span>
                                            </div>
                                        ))}
                                        {financialSummary.topAccountDecreases.map(acc => (
                                            <div key={acc.accountId} className="flex justify-between items-center text-sm">
                                                <span className="truncate text-neutral-600 dark:text-neutral-400 max-w-[140px]">{accountMap.get(acc.accountId)}</span>
                                                <span className="text-red-600 dark:text-red-500 font-mono font-semibold">{formatCurrency(acc.value)}</span>
                                            </div>
                                        ))}
                                        {financialSummary.topAccountIncreases.length === 0 && financialSummary.topAccountDecreases.length === 0 && (
                                            <p className="text-xs text-neutral-400 italic">Sem alterações significativas nas contas.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Coluna 2: O Vento (Fluxo) */}
                            <PremiumLock isLocked={subscriptionStatus === 'free'} className="flex flex-col gap-4 lg:px-8 pt-8 lg:pt-0">
                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    <Wind className="h-4 w-4" />
                                    O Vento
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-neutral-600 dark:text-neutral-400">Entradas</span>
                                            <span className="font-bold">{formatCurrency(financialSummary.incomeTotal)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                            {financialSummary.hasPrevData && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${financialSummary.incomeDeltaPercent >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'}`}>
                                                    {financialSummary.incomeDeltaPercent > 0 ? '+' : ''}{financialSummary.incomeDeltaPercent.toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-neutral-600 dark:text-neutral-400">Saídas</span>
                                            <span className="font-bold">{formatCurrency(financialSummary.expenseTotal)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-500 rounded-full"
                                                    style={{ width: `${financialSummary.incomeTotal > 0 ? Math.min((financialSummary.expenseTotal / financialSummary.incomeTotal) * 100, 100) : 100}%` }}
                                                ></div>
                                            </div>
                                            {financialSummary.hasPrevData && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${financialSummary.expenseDeltaPercent <= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {financialSummary.expenseDeltaPercent > 0 ? '+' : ''}{financialSummary.expenseDeltaPercent.toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </PremiumLock>

                            {/* Coluna 3: Destaques */}
                            <PremiumLock isLocked={subscriptionStatus === 'free'} className="flex flex-col gap-4 lg:pl-8 pt-8 lg:pt-0">
                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    <Waves className="h-4 w-4" />
                                    Destaques
                                </div>

                                <div className="space-y-4">
                                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Maior Categoria de Despesa</p>
                                        {financialSummary.biggestExpenseCategory ? (
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-semibold text-sm">{categoryMap.get(financialSummary.biggestExpenseCategory.id) || 'Desconhecido'}</span>
                                                <span className="font-mono font-bold text-sm">{formatCurrency(financialSummary.biggestExpenseCategory.value)}</span>
                                            </div>
                                        ) : <span className="text-sm italic text-neutral-400">Sem dados</span>}
                                    </div>

                                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Maior Aumento vs Mês Anterior</p>
                                        {financialSummary.biggestCategorySpike ? (
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-semibold text-sm">{categoryMap.get(financialSummary.biggestCategorySpike.id) || 'Desconhecido'}</span>
                                                <div className="flex items-center gap-1 text-red-600 dark:text-red-500 font-bold text-sm">
                                                    <ArrowUpRight className="h-3 w-3" />
                                                    <span>+{formatCurrency(financialSummary.biggestCategorySpike.increase)}</span>
                                                </div>
                                            </div>
                                        ) : <span className="text-sm italic text-neutral-400">Estável</span>}
                                    </div>
                                </div>
                            </PremiumLock>
                        </div>

                        {/* Footer: O Navegador */}
                        {subscriptionStatus !== 'free' && (
                            <div className={`mt-2 p-4 rounded-xl flex gap-4 items-start border ${financialSummary.navigatorInsight.type === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' :
                                financialSummary.navigatorInsight.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' :
                                    'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
                                }`}>
                                <div className={`p-2 rounded-lg mt-0.5 ${financialSummary.navigatorInsight.type === 'success' ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' :
                                    financialSummary.navigatorInsight.type === 'warning' ? 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200' :
                                        'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                                    }`}>
                                    <Compass className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold mb-1 ${financialSummary.navigatorInsight.type === 'success' ? 'text-green-800 dark:text-green-200' :
                                        financialSummary.navigatorInsight.type === 'warning' ? 'text-amber-800 dark:text-amber-200' :
                                            'text-blue-800 dark:text-blue-200'
                                        }`}>O Navegador</h4>
                                    <p className={`text-sm leading-relaxed ${financialSummary.navigatorInsight.type === 'success' ? 'text-green-700 dark:text-green-300' :
                                        financialSummary.navigatorInsight.type === 'warning' ? 'text-amber-700 dark:text-amber-300' :
                                            'text-blue-700 dark:text-blue-300'
                                        }`}>
                                        {financialSummary.navigatorInsight.message}
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                ) : (
                    sortedPatrimonioEntries.length > 0 && (
                        <Card>
                            <div className="text-center p-4">
                                <h3 className="font-bold">Ativa a Tua Bússola</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Regista o património por mais um mês para desbloqueares a análise mensal da tua expedição financeira.</p>
                            </div>
                        </Card>
                    )
                )}

                <Card>
                    <h3 className="font-bold mb-4">Ações Rápidas</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/app/transactions" className={`${btnBase} ${btnSize} ${btnLight} w-full sm:w-auto`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Registar Transação
                        </Link>
                        <Link to="/app/patrimonio" className={`${btnBase} ${btnSize} ${btnLight} w-full sm:w-auto`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Atualizar Património
                        </Link>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AssetAllocationPanel
                        entries={sortedPatrimonioEntries}
                        accounts={config.accounts}
                        currencySymbol={config.simbolo_moeda}
                    />

                    <ExpenseAnalysisPanel
                        transactions={transactions}
                        categoryMap={categoryMap}
                        accountMap={accountMap}
                        currencySymbol={config.simbolo_moeda}
                        theme={theme}
                    />
                </div>
            </div>
        </>
    );
};

// Componente auxiliar para ícones (para evitar erros de linting se CheckCircle não estiver importado acima)
const CheckCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

export default DashboardPage;
