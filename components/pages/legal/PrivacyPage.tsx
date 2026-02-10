
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Database, CreditCard, BarChart3, Cookie, Trash2, Mail } from 'lucide-react';
import { Logo } from '../../ui/Logo.tsx';

const PrivacyPage: React.FC = () => {
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
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 mb-6">
                            <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                            Política de Privacidade
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
                            A tua privacidade é a nossa bússola. Transparência total sobre como tratamos os teus dados.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-10">

                        {/* 1. Princípio Fundamental */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">1</span>
                                O Princípio Fundamental
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    A Caravel foi desenhada com privacidade <strong className="text-black dark:text-white">"by default"</strong>. Não vendemos os teus dados a terceiros, não criamos perfis de publicidade e não acedemos às tuas credenciais bancárias. Os teus dados financeiros são e serão sempre teus — usamo-los exclusivamente para te prestar o serviço.
                                </p>
                            </div>
                        </section>

                        {/* 2. Dados Recolhidos */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">2</span>
                                Que dados recolhemos e porquê?
                            </h2>
                            <div className="pl-11 space-y-3">
                                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                    <p className="font-semibold text-sm text-black dark:text-white mb-1">Identidade</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">O teu email é usado exclusivamente para autenticação e comunicações críticas do serviço (recuperação de password, alterações de termos). Nunca enviaremos spam.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                    <p className="font-semibold text-sm text-black dark:text-white mb-1">Dados Financeiros</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">As transações, contas e valores de património que inseres manualmente. Estes dados são encriptados na base de dados e usados apenas para gerar o teu dashboard pessoal.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                    <p className="font-semibold text-sm text-black dark:text-white mb-1">Dados Técnicos</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Logs básicos de acesso (IP, navegador) para segurança, prevenção de ataques e estabilidade do serviço. Estes dados são anonimizados e eliminados periodicamente.</p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Processadores de Dados */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">3</span>
                                Processadores de Dados (Sub-processors)
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                    Para fornecer o serviço, utilizamos parceiros de confiança que operam sob normas estritas de segurança e cumprem o RGPD/GDPR:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <h3 className="font-bold text-sm text-black dark:text-white">Supabase</h3>
                                        </div>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">Infraestrutura de base de dados e autenticação. Os teus dados financeiros residem aqui, protegidos por segurança de nível empresarial com encriptação AES-256.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <h3 className="font-bold text-sm text-black dark:text-white">Lemon Squeezy</h3>
                                        </div>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">Processamento de pagamentos e Merchant of Record. Gerem os dados de faturação e cartão de crédito. A Caravel nunca tem acesso ao teu cartão.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50 sm:col-span-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <h3 className="font-bold text-sm text-black dark:text-white">Google Ads</h3>
                                        </div>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">Ferramenta de marketing para medir a eficácia das nossas campanhas. Ativamos cookies de marketing apenas após o teu consentimento explícito.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Controlo Total */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">4</span>
                                Controlo Total e Direito ao Esquecimento
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                    Respeitamos integralmente os teus direitos sobre os teus dados (RGPD Art. 15-22). Dentro da aplicação (Definições {'>'} Conta), disponibilizamos ferramentas automáticas:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10">
                                        <p className="font-bold text-sm text-black dark:text-white mb-1">📦 Exportar (Portabilidade)</p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Download instantâneo de todos os teus registos em formato JSON. Os teus dados, no teu formato, a qualquer momento.</p>
                                    </div>
                                    <div className="p-4 rounded-xl border-2 border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10">
                                        <p className="font-bold text-sm text-black dark:text-white mb-1">🗑️ Apagar (Esquecimento)</p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Eliminação permanente e irreversível de toda a tua conta e dados associados. Sem questionários, sem espera.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Cookies */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">5</span>
                                Cookies e Marketing
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    Utilizamos cookies essenciais de sessão para manter o teu login ativo. Adicionalmente, o <strong className="text-black dark:text-white">Google Ads</strong> é usado para fins estatísticos e de promoção. Estes cookies de marketing <strong className="text-black dark:text-white">só são ativados após o teu consentimento explícito</strong> no banner de cookies que aparece na primeira visita.
                                </p>
                            </div>
                        </section>

                        {/* 6. Base Legal */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">6</span>
                                Base Legal do Processamento
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    O processamento dos teus dados baseia-se em duas bases legais: o teu <strong className="text-black dark:text-white">consentimento expresso</strong> (para cookies de marketing) e a <strong className="text-black dark:text-white">execução do contrato de serviço</strong> (para os dados financeiros que inseres e que são necessários para a funcionalidade da aplicação).
                                </p>
                            </div>
                        </section>

                        {/* 7. Retenção */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">7</span>
                                Retenção de Dados
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    Os teus dados financeiros são mantidos apenas enquanto a tua conta estiver ativa. Se apagares a conta, os dados são eliminados dos nossos servidores ativos de forma imediata e permanente. Backups de infraestrutura podem reter dados encriptados por até 30 dias adicionais antes da eliminação completa.
                                </p>
                            </div>
                        </section>

                        {/* 8. Contacto */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500">8</span>
                                Contacto
                            </h2>
                            <div className="pl-11">
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    Para questões relacionadas com privacidade, exercício de direitos RGPD ou qualquer dúvida sobre os teus dados, contacta-nos em{' '}
                                    <a href="mailto:captain@thecaravelapp.com" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">captain@thecaravelapp.com</a>.
                                    Comprometemo-nos a responder no prazo de 30 dias úteis.
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
                        <Link to="/terms" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Termos</Link>
                        <Link to="/blog" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Blog</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPage;
