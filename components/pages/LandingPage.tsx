import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card.tsx';
import { ArrowLeftRight, Landmark, LayoutDashboard, Compass } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Logo } from '../ui/Logo.tsx';
import { PricingSection } from '../landing/PricingSection.tsx';
import { Footer } from '../landing/Footer.tsx';
import { CookieBanner } from '../ui/CookieBanner.tsx';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Styling Constants - Premium Luxury Design
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black cursor-pointer';
const btnSize = 'px-6 py-3 text-base';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white hover:shadow-lg hover:-translate-y-0.5';


const LandingHeader: React.FC = () => {
    const { session } = useAppContext();

    return (
        <header className="absolute top-0 left-0 right-0 z-30 py-6 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl flex justify-between items-center">
                <Link to="/" aria-label="Voltar à página inicial da Caravel" title="Caravel - Gestão Financeira Pessoal">
                    <Logo variant="full" className="h-24" alt="Logótipo Caravel - Gestão Financeira Pessoal" />
                </Link>
                <div className="flex items-center gap-6">
                    {session ? (
                        <Link to="/app" className={`${btnBase} ${btnSize} ${btnPrimary}`} title="Aceder ao Dashboard">
                            Ir para o Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="font-semibold text-base hover:underline" title="Entrar na tua conta">
                                Entrar
                            </Link>
                            <Link to="/login?view=signup" className={`${btnBase} px-6 py-2.5 text-base ${btnPrimary}`} title="Criar nova conta">
                                Iniciar Expedição
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

const AppMockup: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl shadow-neutral-300/20 dark:shadow-black/20 overflow-hidden ${className}`}>
        <div className="h-8 bg-neutral-100 dark:bg-neutral-800/50 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6">
            {children}
        </div>
    </div>
);

const LandingPage: React.FC = () => {
    const { isRecoveryMode, isLoadingAuth } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (isRecoveryMode) {
            navigate('/login?view=update_password', { replace: true });
        }
    }, [isRecoveryMode, navigate]);

    // Se estiver a carregar a autenticação ou em modo de recuperação,
    // mostra apenas um loader para evitar que a landing page "pisque" antes de redirecionar.
    if (isLoadingAuth || isRecoveryMode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-black dark:border-white" role="status" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse">A preparar a tua expedição...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen animate-fade-in">
            <CookieBanner />
            <LandingHeader />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 text-center overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_50%_30%,rgba(59,130,246,0.1)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(40%_50%_at_50%_30%,rgba(59,130,246,0.1)_0%,rgba(0,0,0,0)_100%)]"></div>
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                                O Dashboard de Finanças Pessoais Para Quem Valoriza o Controlo.
                            </h1>
                            <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-neutral-600 dark:text-neutral-300">
                                A Caravel é a tua bússola financeira 100% manual e privada. Conquista clareza sobre o teu património com uma rotina de 5 minutos por mês. Sem ligar as tuas contas bancárias.
                            </p>
                        </div>
                        <div className="mt-10">
                            <Link to="/login?view=signup" className={`${btnBase} ${btnSize} ${btnPrimary}`} title="Começar grátis - Iniciar Expedição">
                                Iniciar Expedição Gratuita
                            </Link>
                            <p className="mt-4 text-sm text-neutral-500">Registo em 60 segundos. Não é necessário cartão.</p>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="py-20 lg:py-28">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Perdido no nevoeiro financeiro?</h2>
                        </div>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="text-center card-premium cursor-default">
                                <h3 className="text-lg font-bold">O Nó da Complexidade</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">Aplicações que exigem dezenas de categorias e micro-gestão?</p>
                            </Card>
                            <Card className="text-center card-premium cursor-default">
                                <h3 className="text-lg font-bold">A Âncora da Insegurança</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">Preocupado em partilhar os teus dados e passwords bancárias?</p>
                            </Card>
                            <Card className="text-center card-premium cursor-default">
                                <h3 className="text-lg font-bold">A Maré da Incerteza</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">Sentes que o teu dinheiro se move, mas não sabes se está a ir na direção certa?</p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Solution Section */}
                <section className="py-20 lg:py-28 bg-neutral-50 dark:bg-neutral-900/50">
                    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">A tua rota para a clareza financeira.</h2>
                            <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300">Acreditamos no controlo manual e consciente. A Caravel foi desenhada para ser a tua bússola, não um piloto automático complexo. A nossa rotina mensal dá-te a visão macro que precisas, protegendo 100% da tua privacidade e eliminando falhas de sincronização.</p>
                        </div>

                        {/* Interactive Chart Demo */}
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
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">A Tua Expedição</p>
                                        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">€42.350,00</p>
                                    </div>
                                    <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-md text-neutral-600 dark:text-neutral-300">3M</span>
                                        <span className="px-3 py-1 text-xs font-semibold rounded-md text-neutral-600 dark:text-neutral-300">6M</span>
                                        <span className="px-3 py-1 text-xs font-semibold rounded-md bg-white dark:bg-neutral-600 text-black dark:text-white shadow-sm">1Y</span>
                                    </div>
                                </div>

                                <div className="h-60">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={[
                                                { name: 'Jan', value: 25000 },
                                                { name: 'Fev', value: 27500 },
                                                { name: 'Mar', value: 26800 },
                                                { name: 'Abr', value: 29200 },
                                                { name: 'Mai', value: 31500 },
                                                { name: 'Jun', value: 33000 },
                                                { name: 'Jul', value: 34200 },
                                                { name: 'Ago', value: 35800 },
                                                { name: 'Set', value: 38000 },
                                                { name: 'Out', value: 39500 },
                                                { name: 'Nov', value: 41000 },
                                                { name: 'Dez', value: 42350 },
                                            ]}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorDemo" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#9ca3af' }}
                                            />
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg px-4 py-2">
                                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{payload[0].payload.name}</p>
                                                                <p className="text-lg font-bold">€{payload[0].value?.toLocaleString('pt-PT')}</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#3b82f6"
                                                fillOpacity={1}
                                                fill="url(#colorDemo)"
                                                strokeWidth={2}
                                                activeDot={{
                                                    r: 6,
                                                    strokeWidth: 2,
                                                    fill: '#3b82f6',
                                                    stroke: '#fff'
                                                }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                                    👆 Passa o rato sobre o gráfico para ver os valores
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 lg:py-28">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">A tua rotina mensal de 5 minutos.</h2>
                        </div>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="border-t-2 border-blue-600 pt-8">
                                <ArrowLeftRight className="h-10 w-10 mx-auto text-neutral-500" />
                                <h3 className="mt-4 text-lg font-bold">1. Regista no Diário</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">Uma vez por mês, insere os totais dos teus rendimentos e despesas.</p>
                            </div>
                            <div className="border-t-2 border-blue-600 pt-8">
                                <Landmark className="h-10 w-10 mx-auto text-neutral-500" />
                                <h3 className="mt-4 text-lg font-bold">2. Marca a Posição</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">Atualiza o valor das tuas contas para ter uma visão exata do teu património.</p>
                            </div>
                            <div className="border-t-2 border-blue-600 pt-8">
                                <LayoutDashboard className="h-10 w-10 mx-auto text-neutral-500" />
                                <h3 className="mt-4 text-lg font-bold">3. Analisa o Rumo</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">Usa a tua Ponte de Comando para visualizar o progresso e ajustar a rota.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section - NOVA */}
                <PricingSection />

                {/* Social Proof Section */}
                <section className="py-20 lg:py-28 bg-neutral-50 dark:bg-neutral-900/50">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Junta-te a quem já navegou primeiro.</h2>
                            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">Navegadores que escolheram tomar o leme das suas finanças.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-4xl sm:text-5xl font-extrabold text-blue-600">500+</p>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Utilizadores ativos</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-extrabold text-blue-600">€2M+</p>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Património monitorizado</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-extrabold text-blue-600">5 min</p>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Rotina mensal média</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-extrabold text-blue-600">100%</p>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Privacidade garantida</p>
                            </div>
                        </div>
                        {/* Testimonial */}
                        <div className="mt-16 max-w-2xl mx-auto text-center">
                            <blockquote className="text-xl italic text-neutral-700 dark:text-neutral-300">
                                "Finalmente uma app que não me pede passwords bancárias. Simples, privada e eficaz."
                            </blockquote>
                            <p className="mt-4 font-semibold">— Miguel S., Empreendedor</p>
                        </div>
                    </div>
                </section >

                {/* FAQ Section */}
                < section className="py-20 lg:py-28" id="faq" >
                    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Perguntas Frequentes</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "A Caravel é segura? Preciso de ligar as minhas contas bancárias?",
                                    a: "A Caravel é 100% manual e não requer nenhuma ligação bancária. Os teus dados financeiros nunca saem do teu controlo. Não temos acesso às tuas passwords ou contas."
                                },
                                {
                                    q: "Quanto tempo preciso de investir por mês?",
                                    a: "A nossa rotina mensal demora em média 5 minutos. Basta atualizar os totais das tuas contas e registar os rendimentos e despesas do mês."
                                },
                                {
                                    q: "A Caravel é grátis?",
                                    a: "Sim! Temos um plano gratuito que te permite começar a usar a Caravel sem qualquer custo. Para funcionalidades avançadas, oferecemos planos premium."
                                },
                                {
                                    q: "E se quiser ligar o meu banco mais tarde?",
                                    a: "A Caravel foi desenhada para ser manual por filosofia, não por limitação. Acreditamos que o registo consciente traz mais clareza do que a automação. Não planeamos adicionar ligações bancárias."
                                },
                                {
                                    q: "Os meus dados estão protegidos?",
                                    a: "Absolutamente. Usamos encriptação de ponta e nunca partilhamos os teus dados com terceiros. A tua privacidade é a nossa prioridade máxima."
                                }
                            ].map((item, i) => (
                                <details key={i} className="group border border-neutral-200 dark:border-neutral-800 rounded-lg">
                                    <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900/50 rounded-lg">
                                        {item.q}
                                        <span className="ml-4 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <p className="px-5 pb-5 text-neutral-600 dark:text-neutral-300">{item.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                    {/* FAQ Schema - All 5 Questions */}
                    <script type="application/ld+json" dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                { "@type": "Question", "name": "A Caravel é segura? Preciso de ligar as minhas contas bancárias?", "acceptedAnswer": { "@type": "Answer", "text": "A Caravel é 100% manual e não requer nenhuma ligação bancária. Os teus dados financeiros nunca saem do teu controlo. Não temos acesso às tuas passwords ou contas." } },
                                { "@type": "Question", "name": "Quanto tempo preciso de investir por mês?", "acceptedAnswer": { "@type": "Answer", "text": "A nossa rotina mensal demora em média 5 minutos. Basta atualizar os totais das tuas contas e registar os rendimentos e despesas do mês." } },
                                { "@type": "Question", "name": "A Caravel é grátis?", "acceptedAnswer": { "@type": "Answer", "text": "Sim! Temos um plano gratuito que te permite começar a usar a Caravel sem qualquer custo. Para funcionalidades avançadas, oferecemos planos premium." } },
                                { "@type": "Question", "name": "E se quiser ligar o meu banco mais tarde?", "acceptedAnswer": { "@type": "Answer", "text": "A Caravel foi desenhada para ser manual por filosofia, não por limitação. Acreditamos que o registo consciente traz mais clareza do que a automação. Não planeamos adicionar ligações bancárias." } },
                                { "@type": "Question", "name": "Os meus dados estão protegidos?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutamente. Usamos encriptação de ponta e nunca partilhamos os teus dados com terceiros. A tua privacidade é a nossa prioridade máxima." } }
                            ]
                        })
                    }} />
                    {/* HowTo Schema */}
                    <script type="application/ld+json" dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "HowTo",
                            "name": "Como gerir as tuas finanças com a Caravel",
                            "description": "Rotina mensal de 5 minutos para clareza financeira completa",
                            "totalTime": "PT5M",
                            "step": [
                                { "@type": "HowToStep", "position": 1, "name": "Regista no Diário", "text": "Uma vez por mês, insere os totais dos teus rendimentos e despesas." },
                                { "@type": "HowToStep", "position": 2, "name": "Marca a Posição", "text": "Atualiza o valor das tuas contas para ter uma visão exata do teu património." },
                                { "@type": "HowToStep", "position": 3, "name": "Analisa o Rumo", "text": "Usa a tua Ponte de Comando para visualizar o progresso e ajustar a rota." }
                            ]
                        })
                    }} />
                    {/* Review Schema */}
                    <script type="application/ld+json" dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Review",
                            "itemReviewed": {
                                "@type": "SoftwareApplication",
                                "name": "Caravel"
                            },
                            "author": {
                                "@type": "Person",
                                "name": "Miguel S."
                            },
                            "reviewBody": "Finalmente uma app que não me pede passwords bancárias. Simples, privada e eficaz.",
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": "5",
                                "bestRating": "5"
                            }
                        })
                    }} />
                </section >

                {/* Manifesto Section */}
                < section className="py-20 lg:py-28" >
                    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center bg-neutral-900 dark:bg-neutral-800/50 text-white rounded-3xl py-20">
                        <Compass className="h-12 w-12 mx-auto text-blue-500" />
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-6">Construído para Capitães, não para passageiros.</h2>
                        <p className="mt-6 text-lg max-w-2xl mx-auto text-neutral-300">A Caravel é para quem entende que o verdadeiro controlo financeiro não vem da automação, mas da atenção. É para quem prefere 5 minutos de foco deliberado a horas de categorização automática. É para quem acredita que os seus dados financeiros são apenas seus. Se este é o teu perfil, bem-vindo a bordo.</p>
                    </div>
                </section >

                {/* Final CTA Section */}
                < section className="py-20 lg:py-28 text-center" >
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">A tua expedição para a tranquilidade financeira começa agora.</h2>
                            <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300">Cria a tua conta e faz o teu primeiro registo em menos de 5 minutos.</p>
                        </div>
                        <div className="mt-10">
                            <Link to="/login?view=signup" className={`${btnBase} ${btnSize} ${btnPrimary}`} title="Registar conta grátis">
                                Iniciar Expedição Gratuita
                            </Link>
                        </div>
                    </div>
                </section >
            </main >

            <Footer />
        </div >
    );
};

export default LandingPage;
