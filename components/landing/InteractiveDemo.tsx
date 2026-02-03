import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Check } from 'lucide-react';

interface DemoAccount {
    name: string;
    value: number;
    type: 'asset' | 'liability';
}

const initialAccounts: DemoAccount[] = [
    { name: 'Conta à Ordem', value: 3500, type: 'asset' },
    { name: 'Poupança', value: 8200, type: 'asset' },
    { name: 'Investimentos', value: 15000, type: 'asset' },
    { name: 'Crédito Habitação', value: 120000, type: 'liability' },
];

export const InteractiveDemo: React.FC = () => {
    const [accounts, setAccounts] = useState(initialAccounts);
    const [step, setStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const totalAssets = accounts.filter(a => a.type === 'asset').reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((sum, a) => sum + a.value, 0);
    const netWorth = totalAssets - totalLiabilities;

    const handleUpdateValue = (index: number, delta: number) => {
        const newAccounts = [...accounts];
        newAccounts[index].value = Math.max(0, newAccounts[index].value + delta);
        setAccounts(newAccounts);

        if (step === 0) setStep(1);
    };

    const handleComplete = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setStep(2);
    };

    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-black">
            <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Experimenta agora.</h2>
                    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
                        Clica nos valores para ver como funciona a atualização de património.
                    </p>
                </div>

                {/* Demo Dashboard */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Demo Header */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="ml-4 text-sm text-neutral-500 font-mono">demo.caravelapp.com</span>
                        </div>
                    </div>

                    {/* Demo Content */}
                    <div className="p-6 sm:p-8">
                        {/* Net Worth */}
                        <div className="text-center mb-8">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Património Líquido</p>
                            <p className={`text-4xl sm:text-5xl font-extrabold tracking-tight mt-2 transition-colors ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                €{netWorth.toLocaleString('pt-PT')}
                            </p>
                            <div className="flex justify-center gap-6 mt-4 text-sm">
                                <span className="text-green-600 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    €{totalAssets.toLocaleString('pt-PT')} ativos
                                </span>
                                <span className="text-red-500 flex items-center gap-1">
                                    <TrendingDown className="w-4 h-4" />
                                    €{totalLiabilities.toLocaleString('pt-PT')} passivos
                                </span>
                            </div>
                        </div>

                        {/* Accounts Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {accounts.map((account, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-xl border ${account.type === 'asset'
                                            ? 'border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20'
                                            : 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{account.name}</p>
                                            <p className={`text-xl font-bold ${account.type === 'asset' ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                €{account.value.toLocaleString('pt-PT')}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleUpdateValue(i, -500)}
                                                className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center justify-center text-lg font-bold transition-colors"
                                                aria-label="Diminuir valor"
                                            >
                                                −
                                            </button>
                                            <button
                                                onClick={() => handleUpdateValue(i, 500)}
                                                className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center justify-center text-lg font-bold transition-colors"
                                                aria-label="Aumentar valor"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Progress Steps */}
                        <div className="mt-8 flex justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full transition-colors ${step >= 0 ? 'bg-blue-600' : 'bg-neutral-300'}`}></div>
                            <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-neutral-300'}`}></div>
                            <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-neutral-300'}`}></div>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 text-center">
                            {step >= 1 && !showSuccess && (
                                <button
                                    onClick={handleComplete}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                                >
                                    <Check className="w-4 h-4" /> Guardar Alterações
                                </button>
                            )}
                            {showSuccess && (
                                <p className="text-green-600 font-semibold animate-pulse">✓ Atualização guardada!</p>
                            )}
                            {step === 0 && (
                                <p className="text-sm text-neutral-500">👆 Clica nos botões + ou − para experimentar</p>
                            )}
                            {step >= 2 && !showSuccess && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Viste como é fácil? <a href="/login?view=signup" className="text-blue-600 hover:underline font-semibold">Cria a tua conta grátis →</a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveDemo;
