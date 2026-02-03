import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Logo } from '../ui/Logo.tsx';
import { Footer } from '../landing/Footer.tsx';
import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';
import { Card } from '../ui/Card.tsx';

// Blog post content storage - this will be populated with actual markdown content
interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    content: string;
    author: string;
    tags: string[];
    faq?: { question: string; answer: string }[];
}

// Sample blog posts data - in production, load from /content/blog/
const blogPostsData: Record<string, BlogPost> = {
    'literacia-financeira-portugal': {
        slug: 'literacia-financeira-portugal',
        title: 'Literacia Financeira em Portugal: Guia Completo 2026',
        description: 'Aprende a gerir as tuas finanças em Portugal. Descobre os 5 pilares da literacia financeira, dicas de poupança e como proteger a tua privacidade.',
        date: '2026-02-03',
        readTime: '6 min',
        author: 'Caravel Team',
        tags: ['literacia financeira', 'finanças pessoais', 'portugal'],
        content: `
## TL;DR

Literacia financeira é a capacidade de tomar decisões informadas sobre o teu dinheiro. Em Portugal, a tendência é clara: cada vez mais pessoas procuram autonomia, segurança e privacidade. Descobre os 5 pilares essenciais e como assumir o leme das tuas finanças.

---

## Porque É Que a Literacia Financeira É Essencial?

A realidade é clara: quem não compreende como o dinheiro funciona, acaba por ser controlado por ele. Em contrapartida, quem domina os princípios básicos da gestão financeira conquista:

- **Autonomia** — Tomas decisões sem depender de terceiros
- **Segurança** — Constróis uma reserva de emergência sólida
- **Liberdade** — Planeias o futuro com confiança
- **Privacidade** — Manténs o controlo sobre os teus dados financeiros

> A literacia financeira não é um luxo. É a bússola que te guia em águas turbulentas.

---

## O Novo Paradigma: Aprendizagem Comunitária

Antigamente, a educação financeira vinha dos bancos ou de consultores. Hoje, os portugueses estão a mudar essa dinâmica. Comunidades no Reddit, grupos no Discord e fóruns especializados tornaram-se fontes primárias de conhecimento.

### Porquê esta mudança?

1. **Desconfiança nas instituições tradicionais** — Escândalos bancários e taxas ocultas criaram ceticismo
2. **Acesso democratizado** — A internet eliminou barreiras de entrada
3. **Experiências reais partilhadas** — Pessoas comuns a ajudar pessoas comuns
4. **Velocidade** — Respostas imediatas vs. marcar reunião no banco

Esta tendência reflete algo mais profundo: a vontade de **retomar o controlo**. Não se trata apenas de poupar dinheiro — trata-se de construir conhecimento próprio, sem intermediários.

---

## Os 5 Pilares da Literacia Financeira

Para quem está a começar esta expedição, eis os fundamentos essenciais:

### 1. Orçamentação Consciente

Saber exatamente para onde vai cada euro é o primeiro passo. Sem este mapa, navegas às cegas.

- Regista todas as despesas (sim, todas)
- Categoriza por necessidade vs. desejo
- Revê mensalmente e ajusta

### 2. Fundo de Emergência

Antes de pensar em investir, constrói uma reserva equivalente a 3-6 meses de despesas. Esta é a tua âncora em tempestades inesperadas.

### 3. Gestão de Dívida

Nem toda a dívida é igual. Prioriza eliminar dívidas de alto juro (cartões de crédito) antes de acumular ativos.

### 4. Poupança Automática

O segredo não é disciplina sobre-humana — é automatização. Configura transferências automáticas no dia do salário.

### 5. Educação Contínua

A literacia financeira não é um destino, é uma viagem. Reserva 30 minutos por semana para aprender algo novo sobre finanças.

---

## Privacidade: O Elemento Esquecido

Num mundo onde as aplicações financeiras proliferam, há uma questão que poucos colocam: **quem tem acesso aos teus dados?**

A tua informação financeira é uma das mais sensíveis que existe. Revela:
- Quanto ganhas
- Onde gastas
- Os teus hábitos de vida
- As tuas vulnerabilidades

Escolher ferramentas que respeitam a tua privacidade não é paranoia — é prudência. Procura aplicações que:

- Não vendam os teus dados a terceiros
- Armazenem informação de forma encriptada
- Te dêem controlo total sobre o que partilhas

---

## Como Começar Hoje

A literacia financeira não exige um MBA. Exige apenas três coisas:

1. **Curiosidade** — Questiona tudo o que te dizem sobre dinheiro
2. **Consistência** — Pequenos passos diários superam grandes planos abandonados
3. **Ferramentas certas** — Uma boa aplicação de gestão financeira pode ser o teu primeiro-imediato

> "Assumir o leme das finanças" não é apenas um slogan — é uma decisão diária.

---

## Próximo Passo

A tua expedição financeira começa com uma decisão: deixar de ser passageiro e passar a ser capitão.

Se procuras uma ferramenta que te ajude a organizar as tuas finanças com total privacidade e controlo manual, sem algoritmos a decidir por ti — a Caravel foi desenhada exatamente para isso.
        `,
        faq: [
            {
                question: 'Onde devo guardar o fundo de emergência?',
                answer: 'Numa conta poupança de fácil acesso mas separada da conta corrente. Evita investimentos voláteis – o objetivo é segurança, não rentabilidade.'
            },
            {
                question: 'O que é literacia financeira?',
                answer: 'Literacia financeira é o conjunto de conhecimentos e competências que permitem tomar decisões informadas sobre gestão de dinheiro, poupança, investimento e planeamento financeiro.'
            },
            {
                question: 'Porque é importante ter literacia financeira?',
                answer: 'Permite tomar decisões autónomas, construir segurança financeira, planear o futuro com confiança e proteger-se de fraudes ou decisões impulsivas.'
            },
            {
                question: 'Como posso melhorar a minha literacia financeira?',
                answer: 'Começa por registar as tuas despesas, cria um orçamento mensal, define objetivos de poupança e dedica tempo semanal a aprender sobre finanças pessoais através de livros, podcasts ou comunidades online.'
            },
            {
                question: 'Qual é a diferença entre poupar e investir?',
                answer: 'Poupar é guardar dinheiro de forma segura para necessidades futuras. Investir é alocar dinheiro em ativos com potencial de crescimento, aceitando algum nível de risco.'
            }
        ]
    },
    'como-criar-orcamento-pessoal': {
        slug: 'como-criar-orcamento-pessoal',
        title: 'Como Criar um Orçamento Pessoal em 5 Passos Simples',
        description: 'Aprende a criar um orçamento mensal eficaz em apenas 5 passos. Guia prático para começares a controlar as tuas finanças hoje.',
        date: '2025-02-03',
        readTime: '5 min',
        author: 'Caravel Team',
        tags: ['orçamento', 'finanças pessoais', 'poupança'],
        content: `
## TL;DR

Criar um orçamento pessoal é simples: calcula os teus rendimentos, lista as despesas fixas, define limites para gastos variáveis, reserva 10-20% para poupança, e revê mensalmente. Com a Caravel, podes fazer isto em menos de 5 minutos por mês.

---

## Porque precisas de um orçamento?

Um orçamento é a ferramenta mais poderosa para atingir estabilidade financeira. Segundo estudos recentes, **67% dos portugueses não têm um orçamento definido**, o que leva a gastos impulsivos e dificuldade em poupar.

Ter um orçamento permite-te:
- Saber exatamente para onde vai o teu dinheiro
- Identificar gastos desnecessários
- Criar uma almofada financeira
- Alcançar objetivos de poupança

---

## Como Criar um Orçamento? (Passo a Passo)

### Passo 1: Calcula os Teus Rendimentos

Lista todos os teus rendimentos mensais líquidos. Inclui:
- Salário
- Rendimentos extra (freelance, investimentos)
- Subsídios ou outros

**Dica:** Usa o valor líquido (após impostos) para maior precisão.

### Passo 2: Lista as Despesas Fixas

Identifica gastos que não variam muito de mês para mês:
- Renda/prestação da casa
- Seguros
- Subscrições (Netflix, Spotify, etc.)
- Transportes

### Passo 3: Estima as Despesas Variáveis

Estes são os gastos que podes controlar mais facilmente:
- Alimentação
- Lazer e entretenimento
- Compras diversas
- Restaurantes

### Passo 4: Define Metas de Poupança

A regra 50/30/20 sugere:
- **50%** para necessidades
- **30%** para desejos
- **20%** para poupança

Ajusta conforme a tua situação.

### Passo 5: Revê e Ajusta Mensalmente

Um orçamento não é estático. Revê-o todos os meses para:
- Identificar onde gastaste demais
- Ajustar limites se necessário
- Celebrar progressos

---

## Conclusão

Criar um orçamento é o primeiro passo para dominar as tuas finanças. Não precisa de ser complicado – começa pelos 5 passos acima e ajusta conforme necessário. Com consistência, verás resultados em poucas semanas.

**Pronto para começar?** A Caravel ajuda-te a manter o controlo com um dashboard simples, manual e 100% privado.
    `,
        faq: [
            {
                question: 'Quanto tempo demora a criar um orçamento?',
                answer: 'Criar o primeiro orçamento pode demorar 30-60 minutos. Com prática e ferramentas como a Caravel, a manutenção mensal demora apenas 5-10 minutos.'
            },
            {
                question: 'Devo usar uma app ou folha de cálculo?',
                answer: 'Ambos funcionam. Apps como a Caravel oferecem uma experiência mais visual e privada. Folhas de cálculo são mais personalizáveis mas requerem mais esforço.'
            },
            {
                question: 'E se os meus rendimentos forem variáveis?',
                answer: 'Usa a média dos últimos 3-6 meses como base. Nos meses de rendimento acima da média, direciona o extra para poupança ou fundo de emergência.'
            }
        ]
    },
    'fundo-emergencia-quanto-poupar': {
        slug: 'fundo-emergencia-quanto-poupar',
        title: 'Fundo de Emergência: Quanto Deves Poupar?',
        description: 'Descobre quanto deves ter no teu fundo de emergência e como construí-lo passo a passo.',
        date: '2025-02-01',
        readTime: '4 min',
        author: 'Caravel Team',
        tags: ['poupança', 'fundo emergência', 'finanças pessoais'],
        content: `
## TL;DR

Um fundo de emergência deve cobrir 3 a 6 meses das tuas despesas essenciais. Começa com um objetivo de €1.000 e depois cresce gradualmente.

---

## O que é um Fundo de Emergência?

Um fundo de emergência é dinheiro reservado para imprevistos – despesas médicas, reparações urgentes, ou perda de emprego. Não é para férias nem compras planeadas.

---

## Quanto Deves Poupar?

A regra geral é:
- **Mínimo:** 3 meses de despesas
- **Ideal:** 6 meses de despesas
- **Se és freelancer:** 9-12 meses

### Como Calcular

1. Soma as tuas despesas essenciais mensais (renda, alimentação, contas, transportes)
2. Multiplica por 3 a 6

**Exemplo:** Se gastas €1.500/mês em essenciais, precisas de €4.500 a €9.000.

---

## Como Construir o Fundo

1. **Define um objetivo inicial** - Começa com €1.000
2. **Automatiza** - Transfere um valor fixo no início do mês
3. **Guarda em conta separada** - Dificulta o acesso para evitar tentações
4. **Aumenta gradualmente** - Quando atingires €1.000, aumenta para 3 meses

---

## Conclusão

Um fundo de emergência dá-te paz de espírito e liberdade financeira. Começa pequeno, mas começa hoje.
    `,
        faq: [
            {
                question: 'Onde devo guardar o fundo de emergência?',
                answer: 'Numa conta poupança de fácil acesso mas separada da conta corrente. Evita investimentos voláteis – o objetivo é segurança, não rentabilidade.'
            },
            {
                question: 'Posso usar o fundo de emergência para férias?',
                answer: 'Não. O fundo de emergência é apenas para imprevistos. Para férias, cria um objetivo de poupança separado.'
            }
        ]
    }
};

const BlogHeader: React.FC = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <Link to="/" aria-label="Voltar à página inicial" title="Caravel - Gestão Financeira Pessoal">
                <Logo variant="full" className="h-20" />
            </Link>
            <nav className="flex items-center gap-6">
                <Link to="/blog" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">Blog</Link>
                <Link to="/login" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">Entrar</Link>
            </nav>
        </div>
    </header>
);

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (slug && blogPostsData[slug]) {
            setPost(blogPostsData[slug]);
        }
    }, [slug]);

    if (!post) {
        return (
            <div className="bg-neutral-50 dark:bg-black text-black dark:text-white min-h-screen flex flex-col">
                <BlogHeader />
                <main className="flex-grow flex flex-col items-center justify-center container mx-auto max-w-4xl px-4 py-32 text-center">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                        <ArrowLeft className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-display mb-4">Artigo não encontrado</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
                        O artigo que procuras não existe ou foi removido.
                    </p>
                    <Link to="/blog" className="inline-flex items-center gap-2 font-semibold text-black dark:text-white hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Voltar ao blog
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const shareUrl = `https://thecaravelapp.com/blog/${post.slug}`;

    return (
        <div className="bg-neutral-50 dark:bg-black text-black dark:text-white min-h-screen flex flex-col selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <BlogHeader />

            <main className="flex-grow pt-24 pb-20">
                {/* Hero / Header Section */}
                <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-12">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Voltar ao blog
                    </Link>

                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-balance">
                            {post.title}
                        </h1>

                        <p className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed text-balance font-light">
                            {post.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 mt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                                    <User className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-black dark:text-white">{post.author}</p>
                                    <div className="flex gap-3 text-xs">
                                        <time dateTime={post.date}>
                                            {new Date(post.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </time>
                                        <span>•</span>
                                        <span>{post.readTime} de leitura</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Image / Gradient Placeholder */}
                <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="w-full h-64 sm:h-96 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 rounded-2xl sm:rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                        <Logo variant="icon" className="w-24 h-24 sm:w-32 sm:h-32 opacity-10 blur-xl" />
                    </div>
                </div>

                {/* Article Content */}
                <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none
                        prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
                        prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
                        prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                        prose-p:leading-loose prose-p:text-neutral-700 dark:prose-p:text-neutral-300
                        prose-li:text-neutral-700 dark:prose-li:text-neutral-300
                        prose-strong:font-bold prose-strong:text-black dark:prose-strong:text-white
                        prose-a:text-black dark:prose-a:text-white prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 hover:prose-a:decoration-2
                        prose-blockquote:border-l-4 prose-blockquote:border-black dark:prose-blockquote:border-white prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-display prose-blockquote:text-xl
                        prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800 prose-hr:my-12
                    ">
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
                            if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>;
                            if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) return <li key={i}>{line.replace(/^\d\. /, '')}</li>;
                            if (line.startsWith('---')) return <hr key={i} />;
                            if (line.startsWith('> ')) return <blockquote key={i}>{line.replace('> ', '')}</blockquote>;

                            if (line.trim() === '') return null;

                            const parts = line.split(/(\*\*[^*]+\*\*)/);
                            return (
                                <p key={i}>
                                    {parts.map((part, j) =>
                                        part.startsWith('**') ? <strong key={j}>{part.replace(/\*\*/g, '')}</strong> : part
                                    )}
                                </p>
                            );
                        })}
                    </article>

                    {/* FAQ Section with Premium Cards */}
                    {post.faq && post.faq.length > 0 && (
                        <section className="mt-20 pt-12 border-t border-neutral-200 dark:border-neutral-800">
                            <h2 className="font-display text-3xl font-bold tracking-tight mb-8">Perguntas Frequentes</h2>
                            <div className="grid gap-6">
                                {post.faq.map((item, i) => (
                                    <div key={i} className="p-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-sm">
                                        <h3 className="text-lg font-bold mb-2">{item.question}</h3>
                                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CTA Section */}
                    <div className="mt-20">
                        <div className="relative p-8 sm:p-12 bg-black dark:bg-white text-white dark:text-black rounded-3xl overflow-hidden text-center">
                            <div className="relative z-10">
                                <h3 className="font-display text-3xl font-bold mb-4">Gostaste deste artigo?</h3>
                                <p className="text-lg text-neutral-300 dark:text-neutral-600 mb-8 max-w-lg mx-auto">
                                    A Caravel foi desenhada para quem quer aplicar estes princípios na prática. Simples, privada e manual.
                                </p>
                                <Link
                                    to="/login?view=signup"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-lg"
                                >
                                    Começar a Minha Jornada
                                </Link>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-neutral-800 dark:bg-neutral-200 rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-neutral-800 dark:bg-neutral-200 rounded-full opacity-20 blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": post.title,
                    "description": post.description,
                    "author": { "@type": "Organization", "name": "Caravel" },
                    "publisher": { "@type": "Organization", "name": "Caravel", "logo": { "@type": "ImageObject", "url": "https://thecaravelapp.com/favicon.svg" } },
                    "datePublished": post.date,
                    "dateModified": post.date,
                    "mainEntityOfPage": { "@type": "WebPage", "@id": shareUrl },
                    "inLanguage": "pt-PT"
                })
            }} />
        </div>
    );
};

export default BlogPostPage;
