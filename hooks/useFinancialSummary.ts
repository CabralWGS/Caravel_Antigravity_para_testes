
import React from 'react';
import { Transaction, PatrimonioEntry, Account } from '../types.ts';

export interface FinancialInsight {
    type: 'success' | 'warning' | 'neutral';
    message: string;
}

export interface AccountMovement {
    accountId: string;
    value: number; // A diferença (ex: +200 ou -50)
}

export interface FinancialSummary {
    monthAnalyzed: string; // YYYY-MM
    
    // 1. Rumo (Património)
    patrimonyTotal: number | null; // Null significa que não há registo para este mês
    patrimonyVariation: number; // Valor absoluto
    patrimonyVariationPercent: number;
    topAccountIncreases: AccountMovement[];
    topAccountDecreases: AccountMovement[];

    // 2. Vento (Fluxo de Caixa)
    incomeTotal: number;
    incomeDeltaPercent: number; // vs mês anterior
    expenseTotal: number;
    expenseDeltaPercent: number; // vs mês anterior
    savingsRate: number; // %

    // 3. Destaques
    biggestExpenseCategory: { id: string; value: number } | null;
    biggestCategorySpike: { id: string; increase: number } | null; // Categoria que aumentou mais vs mês anterior

    // 4. O Navegador
    navigatorInsight: FinancialInsight;
    
    isOngoing: boolean;
    hasPrevData: boolean;
    hasCurrentData: boolean; // Se existe um registo oficial para este mês
}

export const useFinancialSummary = (
    transactions: Transaction[], 
    sortedPatrimonioEntries: PatrimonioEntry[],
    currentTotalBalance: number,
    accounts: Account[],
    selectedDate?: string 
): FinancialSummary | null => {
    return React.useMemo(() => {
        // 1. Datas
        const referenceDate = selectedDate ? new Date(selectedDate) : new Date();
        const currentYear = referenceDate.getFullYear();
        const currentMonth = referenceDate.getMonth();

        // Criar strings YYYY-MM para comparação
        const startCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startPrevMonth = new Date(currentYear, currentMonth - 1, 1);

        // Ajuste de fuso horário para garantir que o ISO string bata certo com a data local (evitar problemas de dia 31 vs 01)
        // A forma mais segura para YYYY-MM é manual:
        const currentMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        
        const prevYear = startPrevMonth.getFullYear();
        const prevMonth = startPrevMonth.getMonth();
        const prevMonthStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;

        // 2. Determinar se é "Ongoing" (Mês atual real)
        const realToday = new Date();
        const isOngoing = currentYear === realToday.getFullYear() && currentMonth === realToday.getMonth();

        // -----------------------------------------------------------------------
        // CÁLCULO DO PATRIMÓNIO (O RUMO)
        // -----------------------------------------------------------------------
        
        // Encontrar entradas usando startsWith para ignorar o dia (YYYY-MM-DD vs YYYY-MM)
        const currentEntry = sortedPatrimonioEntries.find(e => e.data && e.data.startsWith(currentMonthStr));
        const prevEntry = sortedPatrimonioEntries.find(e => e.data && e.data.startsWith(prevMonthStr));

        let patrimonyTotal: number | null = null;
        let prevPatrimonyTotal = 0;
        let currentAccountValues: Record<string, number> = {};
        let prevAccountValues: Record<string, number> = {};
        let hasCurrentData = false;

        // Valor Atual
        if (currentEntry) {
            patrimonyTotal = currentEntry.total_patrimonio;
            currentAccountValues = currentEntry.account_values;
            hasCurrentData = true;
        } else if (isOngoing) {
            // Se é o mês corrente e ainda não fechei (não tenho entry), uso o saldo atual "Live"
            // Nota: Se o user não tiver entries nenhumas, currentTotalBalance pode ser 0 ou o último conhecido.
            // Para ser consistente, assumimos que é uma projeção "Em Curso".
            patrimonyTotal = currentTotalBalance;
            
            // Tentamos usar os valores da última entry disponível para calcular variações parciais
            // Se não houver, assumimos 0
            const lastKnown = sortedPatrimonioEntries[sortedPatrimonioEntries.length - 1];
            if (lastKnown) currentAccountValues = lastKnown.account_values;
        } else {
            // Mês passado/futuro sem registo -> Null (UI deve mostrar "Sem registo")
            patrimonyTotal = null;
        }

        // Valor Anterior
        if (prevEntry) {
            prevPatrimonyTotal = prevEntry.total_patrimonio;
            prevAccountValues = prevEntry.account_values;
        }

        // Variação só faz sentido se tivermos um valor atual (mesmo que seja 0, desde que não seja null)
        const validCurrentTotal = patrimonyTotal ?? 0;
        const patrimonyVariation = validCurrentTotal - prevPatrimonyTotal;
        const patrimonyVariationPercent = prevPatrimonyTotal > 0 ? (patrimonyVariation / prevPatrimonyTotal) * 100 : 0;

        // Calcular Variações por Conta ("As Marés")
        const accountMovements: AccountMovement[] = [];
        // Só calculamos movimentos se tivermos dados de AMBOS os meses (ou live vs anterior)
        if (prevEntry && (hasCurrentData || isOngoing)) {
            accounts.forEach(acc => {
                const currVal = currentAccountValues[acc.id] || 0;
                const prevVal = prevAccountValues[acc.id] || 0;
                const diff = currVal - prevVal;
                
                // Ignorar variações insignificantes
                if (Math.abs(diff) > 0.01) {
                    accountMovements.push({ accountId: acc.id, value: diff });
                }
            });
        }

        const topAccountIncreases = accountMovements.filter(m => m.value > 0).sort((a, b) => b.value - a.value).slice(0, 2);
        const topAccountDecreases = accountMovements.filter(m => m.value < 0).sort((a, b) => a.value - b.value).slice(0, 2);

        // -----------------------------------------------------------------------
        // CÁLCULO DO FLUXO (O VENTO)
        // -----------------------------------------------------------------------

        const getFlowForMonth = (monthStr: string) => {
            // Filtrar transações por string de data YYYY-MM
            const txs = transactions.filter(t => t.data && t.data.startsWith(monthStr));
            const income = txs.filter(t => t.tipo === 'rendimento').reduce((sum, t) => sum + t.valor, 0);
            const expense = txs.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);
            
            const expensesByCategory: Record<string, number> = {};
            txs.filter(t => t.tipo === 'despesa' && t.categoria_id).forEach(t => {
                const cat = t.categoria_id!;
                expensesByCategory[cat] = (expensesByCategory[cat] || 0) + t.valor;
            });

            return { income, expense, expensesByCategory };
        };

        const currentFlow = getFlowForMonth(currentMonthStr);
        const prevFlow = getFlowForMonth(prevMonthStr);

        const incomeDeltaPercent = prevFlow.income > 0 ? ((currentFlow.income - prevFlow.income) / prevFlow.income) * 100 : 0;
        const expenseDeltaPercent = prevFlow.expense > 0 ? ((currentFlow.expense - prevFlow.expense) / prevFlow.expense) * 100 : 0;
        const savingsRate = currentFlow.income > 0 ? ((currentFlow.income - currentFlow.expense) / currentFlow.income) * 100 : 0;

        // -----------------------------------------------------------------------
        // DESTAQUES
        // -----------------------------------------------------------------------

        let biggestExpenseCategory: { id: string; value: number } | null = null;
        Object.entries(currentFlow.expensesByCategory).forEach(([id, value]) => {
            if (!biggestExpenseCategory || value > biggestExpenseCategory.value) {
                biggestExpenseCategory = { id, value };
            }
        });

        let biggestCategorySpike: { id: string; increase: number } | null = null;
        Object.entries(currentFlow.expensesByCategory).forEach(([id, currVal]) => {
            const prevVal = prevFlow.expensesByCategory[id] || 0;
            const increase = currVal - prevVal;
            if (increase > 10) {
                if (!biggestCategorySpike || increase > biggestCategorySpike.increase) {
                    biggestCategorySpike = { id, increase };
                }
            }
        });

        // -----------------------------------------------------------------------
        // O NAVEGADOR (INSIGHTS)
        // -----------------------------------------------------------------------
        
        let navigatorInsight: FinancialInsight = { type: 'neutral', message: 'Continua a registar dados para obteres insights.' };

        if (patrimonyTotal === null) {
             navigatorInsight = { type: 'neutral', message: 'Sem dados de património para este mês. Regista o valor das tuas contas para veres a evolução.' };
        } else if (!prevEntry && !isOngoing) {
             navigatorInsight = { type: 'neutral', message: 'Este é o início da tua jornada neste período. O próximo mês trará comparações.' };
        } else {
            const savings = currentFlow.income - currentFlow.expense;
            const wealthGrew = patrimonyVariation > 0;
            const expensesDown = expenseDeltaPercent < 0;

            if (wealthGrew && expensesDown) {
                navigatorInsight = { type: 'success', message: 'Excelente rota! Aumentaste o património e reduziste as despesas.' };
            } else if (wealthGrew && savings > 0) {
                navigatorInsight = { type: 'success', message: 'Bons ventos. O teu património cresce impulsionado pela tua poupança.' };
            } else if (!wealthGrew && currentFlow.expense > currentFlow.income) {
                navigatorInsight = { type: 'warning', message: 'Alerta de tempestade. Gastaste mais do que ganhaste e o património desceu.' };
            } else if (wealthGrew && savings <= 0) {
                navigatorInsight = { type: 'neutral', message: 'Curioso. O património subiu (valorização de ativos?) apesar de não teres poupado.' };
            } else if (!wealthGrew && savings > 0) {
                navigatorInsight = { type: 'warning', message: 'Atenção. Poupaste dinheiro, mas o património desceu. Verifica a desvalorização das tuas contas.' };
            } else {
                navigatorInsight = { type: 'neutral', message: 'Mantém o rumo. Analisa os destaques para otimizar o próximo mês.' };
            }
        }

        return {
            monthAnalyzed: currentMonthStr,
            patrimonyTotal,
            patrimonyVariation,
            patrimonyVariationPercent,
            topAccountIncreases,
            topAccountDecreases,
            incomeTotal: currentFlow.income,
            incomeDeltaPercent,
            expenseTotal: currentFlow.expense,
            expenseDeltaPercent,
            savingsRate,
            biggestExpenseCategory,
            biggestCategorySpike,
            navigatorInsight,
            isOngoing,
            hasPrevData: !!prevEntry,
            hasCurrentData
        };

    }, [transactions, sortedPatrimonioEntries, selectedDate, currentTotalBalance, accounts]);
};
