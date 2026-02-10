import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, CreditCard, ShieldCheck, Scale, RefreshCw, Globe } from 'lucide-react';
import { Logo } from '../../ui/Logo.tsx';

const TermsPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-30 py-4 px-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50">
                <div className="container mx-auto max-w-4xl flex justify-between items-center">
                    <Link to="/" aria-label="Voltar à página inicial">
                        <Logo variant="full" className="h-8" />
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Voltar</span>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-20">
                <div className="animate-fade-in">
                    {/* Title */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 mb-6">
                            <FileText className="h-7 w-7 text-neutral-600 dark:text-neutral-300" />
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                            Termos de Serviço
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
                            As regras da expedição. Lê com atenção antes de zarpar.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-10">

                        {/* 1. Aceitação */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">1</span>
                                Aceitação dos Termos
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    Ao criar uma conta, subscrever um plano ou utilizar a Caravel ("o Serviço"), concordas legalmente com estes Termos de Serviço na sua totalidade. Se não concordares com algum ponto, deverás cessar a utilização imediatamente. A utilização continuada constitui aceitação tácita dos termos em vigor.
                                </p>
                            </div>
                        </section>

                        {/* Disclaimer - Highlighted */}
                        <section className="p-6 sm:p-8 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center">
                                        <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-3">
                                        Isenção de Responsabilidade Financeira
                                    </h2>
                                    <p className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">
                                        A Caravel é estritamente uma ferramenta de software para registo, organização e visualização de dados inseridos pelo utilizador. <strong>Não somos consultores financeiros, contabilistas ou gestores de investimento.</strong> Nenhuma informação na aplicação — incluindo gráficos, métricas de crescimento, a "Bússola Financeira" ou quaisquer projeções — constitui aconselhamento financeiro. Tu és o único responsável pelas tuas decisões financeiras e de investimento.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Subscrições */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">2</span>
                                Subscrições e Pagamentos
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                    O processo de pagamento e faturação é conduzido pelo nosso Merchant of Record, <strong className="text-black dark:text-white">Lemon Squeezy</strong>, que gere pagamentos, impostos e faturação de forma segura e conforme.
                                </p>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                        <p className="font-semibold text-sm text-black dark:text-white mb-1">Pagamentos</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Ao subscreveres o plano Premium ("Capitão"), aceitas igualmente os Termos de Serviço da Lemon Squeezy. A Caravel nunca acede aos dados do teu cartão de crédito.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                        <p className="font-semibold text-sm text-black dark:text-white mb-1">Impostos (IVA/VAT)</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">A Lemon Squeezy encarrega-se da recolha e pagamento de todos os impostos aplicáveis à tua jurisdição, em conformidade com a legislação da UE e internacional.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                        <p className="font-semibold text-sm text-black dark:text-white mb-1">Cancelamento</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Podes cancelar a tua subscrição a qualquer momento, sem penalizações. Continuarás a ter acesso às funcionalidades premium até ao final do ciclo de faturação atual.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                        <p className="font-semibold text-sm text-black dark:text-white mb-1">Reembolsos</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Avaliamos pedidos de reembolso caso a caso. Reservamo-nos o direito de recusar reembolsos para serviços digitais já acedidos, exceto quando exigido por lei aplicável.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Uso Aceitável */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">3</span>
                                Uso Aceitável
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                    Comprometes-te a usar a Caravel apenas para fins legais e pessoais. É estritamente proibido:
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 flex-shrink-0" />
                                        Tentar aceder indevidamente a contas de outros utilizadores ou a sistemas internos da plataforma.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 flex-shrink-0" />
                                        Usar automação (bots, scrapers) para interagir com o serviço de forma abusiva ou não autorizada.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 flex-shrink-0" />
                                        Proceder a engenharia reversa, descompilação ou cópia da propriedade intelectual da aplicação.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 flex-shrink-0" />
                                        Utilizar o serviço para fins comerciais, de revenda ou de redistribuição sem autorização prévia.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 4. Disponibilidade */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">4</span>
                                Disponibilidade e Dados
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    Esforçamo-nos para manter a Caravel disponível 24/7, mas não garantimos que o serviço seja ininterrupto ou livre de erros. Poderão ocorrer períodos de manutenção programada, que serão comunicados com a antecedência possível. Recomendamos que utilizes a funcionalidade de <strong className="text-black dark:text-white">"Exportar Dados (JSON)"</strong> regularmente para manteres um backup pessoal da tua informação.
                                </p>
                            </div>
                        </section>

                        {/* 5. Propriedade Intelectual */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">5</span>
                                Propriedade Intelectual
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    Todo o conteúdo, design, código e marca "Caravel" são propriedade exclusiva da Caravel. É concedida uma licença pessoal, não exclusiva e intransferível para usar a aplicação conforme estes termos. Os dados financeiros que inseres são e permanecem integralmente teus.
                                </p>
                            </div>
                        </section>

                        {/* 6. Alterações */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">6</span>
                                Alterações aos Termos
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    Podemos atualizar estes termos ocasionalmente para refletir melhorias no serviço ou requisitos legais. Alterações significativas serão comunicadas por email. O uso continuado da aplicação após alterações constitui aceitação dos novos termos.
                                </p>
                            </div>
                        </section>

                        {/* 7. Lei Aplicável */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">7</span>
                                Lei Aplicável e Jurisdição
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    Estes termos são regidos pelas leis de Portugal e da União Europeia, incluindo o Regulamento Geral sobre a Proteção de Dados (RGPD). Qualquer disputa será resolvida nos tribunais competentes de Lisboa, Portugal, salvo disposição legal em contrário que beneficie o consumidor.
                                </p>
                            </div>
                        </section>

                        {/* Last Update */}
                        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto max-w-3xl px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} Caravel. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Privacidade</Link>
                        <Link to="/blog" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Blog</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TermsPage;