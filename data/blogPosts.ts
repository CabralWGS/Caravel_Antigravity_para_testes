// Centralized blog posts data for SEO/AEO/GEO optimization
// Add new articles here - they will automatically appear in BlogPage and BlogPostPage

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    content: string;
    author: string;
    tags: string[];
    thumbnail?: string;
    faq?: { question: string; answer: string }[];
}

// All available tags for filtering
export const allTags = [
    'literacia financeira',
    'finanças pessoais',
    'portugal',
    'orçamento',
    'iniciantes',
    'poupança',
    'fundo emergência',
    'investimentos',
    'mercados emergentes',
] as const;

export type BlogTag = typeof allTags[number];

// Blog posts with full content
export const blogPostsData: Record<string, BlogPost> = {
    'literacia-financeira-portugal': {
        slug: 'literacia-financeira-portugal',
        title: 'Literacia Financeira em Portugal: Guia Completo 2026',
        description: 'Aprende a gerir as tuas finanças em Portugal. Descobre os 5 pilares da literacia financeira, dicas de poupança e como proteger a tua privacidade.',
        date: '2026-02-03',
        readTime: '6 min',
        author: 'Caravel Team',
        tags: ['literacia financeira', 'finanças pessoais', 'portugal'],
        thumbnail: '/blog/literacia-financeira.webp',
        content: `
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
        thumbnail: '/blog/orcamento-pessoal.webp',
        content: `
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
        thumbnail: '/blog/fundo-emergencia.webp',
        content: `
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
    },
    'mercados-emergentes-2026': {
        slug: 'mercados-emergentes-2026',
        title: 'Mercados Emergentes em 2026: Oportunidade para Portugal?',
        description: 'Descobre porque Wall Street aposta nos mercados emergentes em 2026 e como investidores portugueses podem diversificar com inteligência.',
        date: '2026-02-04',
        readTime: '7 min',
        author: 'Caravel Team',
        tags: ['investimentos', 'mercados emergentes', 'portugal', 'finanças pessoais'],
        thumbnail: '/blog/mercados-emergentes-2026.webp',
        content: `
## Porque Estão os Mercados Emergentes a Brilhar em 2026?

Os mercados emergentes são, pela primeira vez numa década, a aposta favorita de Wall Street. Após anos de subdesempenho face aos EUA, estas economias superaram o S&P 500 em 2025 e os analistas preveem um **ciclo plurianual de entrada de capitais**. Para investidores portugueses, esta tendência abre portas a uma diversificação geográfica que há muito estava esquecida.

- **Rentabilidade superior** — Ações emergentes bateram as americanas em 2025
- **Juros em queda** — Ciclos de corte de taxas favorecem mercados em desenvolvimento
- **Inovação tecnológica** — Exposição a empresas tech asiáticas e latino-americanas

> Os mercados emergentes oferecem o que falta às carteiras europeias: crescimento acelerado e diversificação real.

---

## O Que São Mercados Emergentes?

Mercados emergentes são economias em rápido desenvolvimento — como Brasil, Índia, China, Indonésia e México — que oferecem potencial de crescimento superior às economias maduras, mas com volatilidade mais elevada.

### Porque Interessam Agora?

1. **Avaliações atrativas** — Após anos de correção, estão mais baratos que os mercados desenvolvidos
2. **Demografia favorável** — Populações jovens e classe média em expansão
3. **Digitalização acelerada** — Adoção de fintech e e-commerce supera a Europa
4. **Recursos naturais** — Exposição a commodities essenciais (lítio, cobre, terras raras)

Segundo a Forbes, especialistas recomendam **seletividade**: "Investir no índice genérico de mercados emergentes não é a melhor abordagem — a escolha de empresas de qualidade é crucial."

---

## Como Investir a Partir de Portugal? (Passo a Passo)

### Passo 1: Define o Peso na Carteira

A maioria dos especialistas sugere alocar entre **5% a 15%** do portfólio a mercados emergentes, dependendo da tolerância ao risco. Começa com uma alocação conservadora.

### Passo 2: Escolhe o Veículo de Investimento

- **ETFs de Mercados Emergentes** — Opção mais acessível (ex: iShares MSCI Emerging Markets, Vanguard FTSE Emerging Markets)
- **Fundos de Investimento** — Gestão ativa com seleção de empresas específicas
- **Ações Individuais** — Para investidores experientes que querem escolher empresas

### Passo 3: Considera a Exposição Setorial

Nem todos os setores emergentes são iguais:
- **Tecnologia (China, Índia, Taiwan)** — Semicondutores, e-commerce, fintech
- **Consumo (Índia, Indonésia)** — Crescimento da classe média
- **Energia Verde (Brasil, Chile)** — Lítio, energia renovável, biocombustíveis

### Passo 4: Acompanha e Rebalanceia

A volatilidade é real. Define um calendário de revisão (trimestral ou semestral) para reajustar a alocação conforme necessário.

---

## Portugal e os Mercados Emergentes: O Contexto

O PIB português deverá crescer **2,3% em 2026**, segundo o Banco de Portugal. No entanto, as empresas nacionais continuam a **investir abaixo da média global em tecnologia e inovação**.

Para investidores individuais, isto significa que a diversificação internacional não é apenas desejável — é estratégica. Enquanto a economia local cresce moderadamente, mercados emergentes oferecem exposição a taxas de crescimento de 5-7%.

### Vantagens para Portugueses

- **Acesso via corretoras europeias** — Plataformas como DEGIRO, XTB e Interactive Brokers oferecem ETFs com custos reduzidos
- **Fiscalidade conhecida** — Regime de mais-valias aplica-se normalmente
- **Correlação baixa** — Reduz o risco global da carteira

---

## Riscos a Considerar

Os mercados emergentes não são para todos. Antes de investir, pondera:

- **Volatilidade cambial** — Flutuações de moeda podem amplificar perdas ou ganhos
- **Risco político** — Mudanças de governo podem afetar setores inteiros
- **Liquidez** — Algumas ações são menos líquidas que nos EUA ou Europa
- **Transparência** — Normas de governance variam significativamente

> A diversificação nunca elimina o risco — apenas o distribui de forma mais inteligente.

---

## Conclusão

Os mercados emergentes representam uma das oportunidades mais discutidas de 2026. Para investidores portugueses com horizonte de médio-longo prazo, uma alocação moderada pode adicionar crescimento e diversificação à carteira.

O segredo está na seletividade: escolher veículos de qualidade, manter expectativas realistas e acompanhar a evolução do mercado. Como em qualquer navegação, o destino é importante — mas a preparação é tudo.

---

*A Caravel é um instrumento de navegação e suporte à decisão. Todo o conteúdo é meramente informativo e não constitui aconselhamento financeiro ou recomendação de investimento.*
        `,
        faq: [
            {
                question: 'Quanto devo investir em mercados emergentes?',
                answer: 'A maioria dos especialistas sugere entre 5% a 15% do portfólio. Começa com uma alocação conservadora (5%) e aumenta gradualmente se te sentires confortável com a volatilidade.'
            },
            {
                question: 'Qual é o melhor ETF de mercados emergentes?',
                answer: 'Os mais populares são o iShares MSCI Emerging Markets (IEMG) e o Vanguard FTSE Emerging Markets (VWO). Ambos oferecem diversificação ampla com custos baixos.'
            },
            {
                question: 'Os mercados emergentes são arriscados?',
                answer: 'Sim, apresentam volatilidade superior aos mercados desenvolvidos. Riscos incluem flutuações cambiais, instabilidade política e menor liquidez. Por isso, recomenda-se uma alocação moderada.'
            },
            {
                question: 'Posso investir em mercados emergentes a partir de Portugal?',
                answer: 'Sim, através de corretoras europeias como DEGIRO, XTB ou Interactive Brokers podes comprar ETFs de mercados emergentes com custos reduzidos e sem complicações fiscais adicionais.'
            },
            {
                question: 'Qual é a diferença entre mercados emergentes e fronteira?',
                answer: 'Mercados emergentes (Brasil, Índia, China) são mais desenvolvidos e líquidos. Mercados fronteira (Vietname, Nigéria) são mais pequenos, menos líquidos e mais arriscados, mas com potencial de crescimento superior.'
            }
        ]
    }
};

// Simplified posts array for listing (without full content)
// Sorted by date descending (most recent first)
export const blogPosts = Object.values(blogPostsData)
    .map(({ slug, title, description, date, readTime, tags, thumbnail }) => ({
        slug,
        title,
        description,
        date,
        readTime,
        tags,
        thumbnail,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Get post by slug
export const getPostBySlug = (slug: string): BlogPost | undefined => blogPostsData[slug];
