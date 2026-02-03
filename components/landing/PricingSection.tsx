
import React, { useState } from 'react';
import { Check, X, Crown, Anchor } from 'lucide-react';
import { Link } from 'react-router-dom';

// Styling Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-6 py-3 text-sm sm:text-base';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white shadow-lg hover:shadow-xl hover:-translate-y-0.5';
const btnOutline = 'bg-transparent text-black dark:text-white border-2 border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white focus-visible:ring-black dark:focus-visible:ring-white';

type BillingCycle = 'monthly' | 'yearly';

const FeatureItem: React.FC<{ text: string; included?: boolean }> = ({ text, included = true }) => (
    <li className="flex items-start gap-3 text-sm sm:text-base">
        {included ? (
            <div className="mt-0.5 p-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
            </div>
        ) : (
            <div className="mt-0.5 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                <X className="h-3.5 w-3.5 text-neutral-400" />
            </div>
        )}
        <span className={included ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400 line-through decoration-neutral-400/50'}>
            {text}
        </span>
    </li>
);

export const PricingSection: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

    const handleToggle = (cycle: BillingCycle) => {
        setBillingCycle(cycle);
    };

    return (
        <section className="py-20 lg:py-28 bg-neutral-50 dark:bg-black transition-colors duration-300" id="pricing">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">Escolhe a tua Rota</h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Começa gratuitamente e faz o upgrade quando precisares de mais poder de navegação.
                    </p>
                </div>

                {/* Toggle Switch */}
                <div className="flex justify-center mb-12">
                    <div className="relative flex items-center p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm">
                        <button
                            onClick={() => handleToggle('monthly')}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${billingCycle === 'monthly'
                                ? 'text-black dark:text-white'
                                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                }`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => handleToggle('yearly')}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${billingCycle === 'yearly'
                                ? 'text-black dark:text-white'
                                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                }`}
                        >
                            Anual
                            {billingCycle === 'yearly' && (
                                <span className="absolute -top-3 -right-6 md:-right-10 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 animate-fade-in-scale">
                                    -30%
                                </span>
                            )}
                        </button>

                        {/* Animated Background Pill */}
                        <div
                            className={`absolute top-1 bottom-1 rounded-full bg-neutral-100 dark:bg-neutral-800 transition-transform duration-300 ease-in-out ${billingCycle === 'monthly'
                                ? 'left-1 w-[calc(50%-4px)] translate-x-0'
                                : 'left-1 w-[calc(50%-4px)] translate-x-full'
                                }`}
                        />
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Free Plan - Marinheiro */}
                    <div className="relative p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform hover:-translate-y-1 duration-300">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                                    <Anchor className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <h3 className="text-xl font-bold">Marinheiro</h3>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 h-10">
                                Para quem está a começar a sua primeira expedição financeira.
                            </p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold tracking-tight">0€</span>
                                <span className="text-neutral-500">/sempre</span>
                            </div>
                            <p className="text-xs text-neutral-400 mt-2 font-medium">&nbsp;</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Registo ilimitado de transações" />
                            <FeatureItem text="Dashboard Essencial" />
                            <FeatureItem text="Máx. 2 Contas de Património" />
                            <FeatureItem text="Análise Mensal (Bússola)" included={false} />
                            <FeatureItem text="Suporte Prioritário" included={false} />
                        </ul>

                        <Link
                            to="/login?view=signup"
                            className={`${btnBase} ${btnSize} ${btnOutline} w-full`}
                        >
                            Começar Grátis
                        </Link>
                    </div>

                    {/* Premium Plan - Capitão */}
                    <div className="relative p-8 bg-white dark:bg-black rounded-3xl border-2 border-black dark:border-white shadow-2xl shadow-neutral-200/50 dark:shadow-neutral-900/50 flex flex-col transform md:-translate-y-4 hover:-translate-y-5 transition-all duration-300">
                        {/* Badge */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                            Mais Popular
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-black dark:bg-white rounded-xl">
                                    <Crown className="h-6 w-6 text-white dark:text-black" />
                                </div>
                                <h3 className="text-xl font-bold">Capitão</h3>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 h-10">
                                Navegação sem limites para quem quer controlo total.
                            </p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-1 animate-value-fade-in" key={billingCycle}>
                                <span className="text-4xl font-extrabold tracking-tight">
                                    {billingCycle === 'yearly' ? '25,00€' : '2,99€'}
                                </span>
                                <span className="text-neutral-500">
                                    /{billingCycle === 'yearly' ? 'ano' : 'mês'}
                                </span>
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-500 mt-2 font-bold h-4 flex items-center">
                                {billingCycle === 'yearly' ? 'Equivalente a ~2,08€/mês (Poupas 30%)' : 'Faturado mensalmente'}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Registo ilimitado de transações" />
                            <FeatureItem text="Dashboard Completo" />
                            <FeatureItem text="Contas de Património Ilimitadas" />
                            <FeatureItem text="Bússola Financeira (Analytics)" />
                            <FeatureItem text="Suporte Prioritário por Email" />
                        </ul>

                        <a
                            href={billingCycle === 'yearly' ? '#checkout-yearly' : '#checkout-monthly'}
                            className={`${btnBase} ${btnSize} ${btnPrimary} w-full`}
                        >
                            Tornar-me Capitão
                        </a>
                        <p className="text-center text-xs text-neutral-400 mt-3">
                            Pagamento seguro via Lemon Squeezy. Cancela quando quiseres.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};
