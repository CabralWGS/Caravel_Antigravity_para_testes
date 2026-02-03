import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: unknown; // O 'label' do Recharts pode ser um número (índice), o que causava o erro.
  initialValue: number;
  currencySymbol: string;
}

const formatCurrency = (value: number, symbol: string) => {
    return `${symbol}${value.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const formatDate = (dateStr: string) => {
    // Função tornada mais robusta para evitar erros com formatos inesperados.
    if (typeof dateStr !== 'string' || !dateStr.includes('-')) {
        return dateStr;
    }
    const parts = dateStr.split('-');
    if (parts.length !== 2) {
        return dateStr;
    }
    const [year, month] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1);
    if (isNaN(date.getTime())) {
        return dateStr; // Retorna a string original se a data for inválida
    }
    const formattedDate = date.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, initialValue, currencySymbol }) => {
  // A lógica agora obtém os dados do 'payload' para garantir a correção dos dados.
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    if (!dataPoint) return null;

    const currentValue = dataPoint.value;
    const dateLabel = dataPoint.name;

    // Lida com o caso especial de quando não há dados e o gráfico mostra "Start".
    if (dateLabel === 'Start') {
      return (
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-neutral-200 dark:border-neutral-800 text-center">
          <p className="text-lg font-bold tracking-tight">{formatCurrency(currentValue, currencySymbol)}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Início</p>
        </div>
      );
    }
    
    const percentageChange = initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : (currentValue > 0 ? 100 : 0);
    const isPositive = percentageChange >= 0;

    return (
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-neutral-200 dark:border-neutral-800 text-center">
        <p className="text-lg font-bold tracking-tight">{formatCurrency(currentValue, currencySymbol)}</p>
        <div className={`flex items-center justify-center text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
            {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
            <span>{Math.abs(percentageChange).toFixed(2)}%</span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{formatDate(dateLabel)}</p>
      </div>
    );
  }

  return null;
};
