import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Logo } from '../ui/Logo.tsx';
import { Footer } from '../landing/Footer.tsx';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';

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
    <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
            <Link to="/" aria-label="Voltar à página inicial" title="Caravel - Gestão Financeira Pessoal">
                <Logo variant="full" className="h-16" />
            </Link>
            <nav className="flex items-center gap-6">
                <Link to="/login" className="font-semibold text-sm hover:underline">Entrar</Link>
            </nav>
        </div>
    </header>
);

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        if (slug && blogPostsData[slug]) {
            setPost(blogPostsData[slug]);
        }
    }, [slug]);

    if (!post) {
        return (
            <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
                <BlogHeader />
                <main className="container mx-auto max-w-4xl px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold">Artigo não encontrado</h1>
                    <p className="mt-4 text-neutral-600 dark:text-neutral-300">
                        O artigo que procuras não existe.
                    </p>
                    <Link to="/blog" className="mt-6 inline-flex items-center gap-2 font-semibold hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Voltar ao blog
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const shareUrl = `https://thecaravelapp.com/blog/${post.slug}`;

    return (
        <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
            <BlogHeader />

            <main className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Link */}
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao blog
                </Link>

                {/* Article Header */}
                <article>
                    <header>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={post.date}>
                                    {new Date(post.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </time>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime} de leitura</span>
                            </div>
                        </div>

                        <h1 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                            {post.title}
                        </h1>

                        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
                            {post.description}
                        </p>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Article Content */}
                    <div className="mt-10 prose prose-neutral dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed
            prose-li:leading-relaxed
            prose-strong:font-semibold
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline
          ">
                        {/* Render content - split by lines and render basic markdown */}
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('## ')) {
                                return <h2 key={i}>{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('### ')) {
                                return <h3 key={i}>{line.replace('### ', '')}</h3>;
                            }
                            if (line.startsWith('- ')) {
                                return <li key={i}>{line.replace('- ', '')}</li>;
                            }
                            if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                                return <li key={i}>{line.replace(/^\d\. /, '')}</li>;
                            }
                            if (line.startsWith('---')) {
                                return <hr key={i} className="my-8" />;
                            }
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                            }
                            if (line.trim() === '') {
                                return null;
                            }
                            // Handle bold within text
                            const parts = line.split(/(\*\*[^*]+\*\*)/);
                            return (
                                <p key={i}>
                                    {parts.map((part, j) =>
                                        part.startsWith('**') ? <strong key={j}>{part.replace(/\*\*/g, '')}</strong> : part
                                    )}
                                </p>
                            );
                        })}
                    </div>

                    {/* FAQ Section */}
                    {post.faq && post.faq.length > 0 && (
                        <section className="mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-10">
                            <h2 className="font-display text-2xl font-bold tracking-tight mb-6">Perguntas Frequentes</h2>
                            <div className="space-y-6">
                                {post.faq.map((item, i) => (
                                    <div key={i} className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
                                        <h3 className="text-lg font-semibold">{item.question}</h3>
                                        <p className="mt-2 text-neutral-600 dark:text-neutral-300">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Share / CTA */}
                    <div className="mt-12 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-xl text-center">
                        <p className="font-semibold text-lg">Gostaste deste artigo?</p>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                            Experimenta a Caravel para gerir as tuas finanças com simplicidade.
                        </p>
                        <Link
                            to="/login?view=signup"
                            className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                        >
                            Começar Grátis
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />

            {/* Article Schema Markup */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": post.title,
                    "description": post.description,
                    "author": {
                        "@type": "Organization",
                        "name": "Caravel",
                        "url": "https://thecaravelapp.com"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Caravel",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://thecaravelapp.com/favicon.svg"
                        }
                    },
                    "datePublished": post.date,
                    "dateModified": post.date,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": shareUrl
                    },
                    "inLanguage": "pt-PT"
                })
            }} />

            {/* FAQ Schema Markup */}
            {post.faq && post.faq.length > 0 && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": post.faq.map(item => ({
                            "@type": "Question",
                            "name": item.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": item.answer
                            }
                        }))
                    })
                }} />
            )}
        </div>
    );
};

export default BlogPostPage;
