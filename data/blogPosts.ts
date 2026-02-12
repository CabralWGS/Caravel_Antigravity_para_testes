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
    'irs',
    'impostos',
    'reforma',
    'patrimônio',
] as const;

export type BlogTag = typeof allTags[number];

// Blog posts with full content
export const blogPostsData: Record<string, BlogPost> = {
    'patrimonio-liquido-net-worth': {
        slug: 'patrimonio-liquido-net-worth',
        title: 'Património Líquido: Como Calcular e Acompanhar o Teu Net Worth em 2026',
        description: 'Descobre o que é o património líquido, como calcular o teu net worth passo a passo e porque é a métrica mais importante das tuas finanças pessoais.',
        date: '2026-02-12',
        readTime: '7 min',
        author: 'Caravel Team',
        tags: ['patrimônio', 'finanças pessoais', 'portugal', 'literacia financeira'],
        thumbnail: '/blog/patrimonio-liquido-net-worth.webp',
        content: `
## O Que É o Património Líquido e Como se Calcula?

O Património Líquido (ou *Net Worth*) é o verdadeiro termómetro da tua saúde financeira. Ao contrário do salário, que mede quanto ganhas, o património líquido mede **quanto tens**. É o resultado simples de uma subtração poderosa: **Ativos (o que tens)** menos **Passivos (o que deves)**.

Em Portugal, muitas famílias focam-se apenas no rendimento mensal, ignorando esta métrica. No entanto, é possível ter um salário alto e um património líquido negativo (se as dívidas superarem os bens).

> "O rendimento alimenta o teu estilo de vida hoje. O património líquido alimenta o teu futuro."

---

## A Fórmula do Sucesso

Para calcular o teu património líquido, precisas de listar tudo. A fórmula é universal:

**Património Líquido = Total de Ativos - Total de Passivos**

### O Que Incluir nos Ativos (+)
*Tudo o que tem valor financeiro e pode ser convertido em dinheiro.*

- **Dinheiro:** Contas à ordem, depósitos a prazo, dinheiro físico.
- **Investimentos:** Ações, ETFs, PPR, Certificados de Aforro, Criptoactivos.
- **Imobiliário:** Valor de mercado da tua casa (não o valor de compra).
- **Veículos:** Valor comercial atual do teu carro ou mota.
- **Outros:** Joias, obras de arte, participações em empresas.

### O Que Incluir nos Passivos (-)
*Todas as tuas obrigações financeiras.*

- **Crédito Habitação:** O valor que ainda deves ao banco.
- **Crédito Automóvel:** O montante em dívida.
- **Cartões de Crédito:** Saldos por pagar.
- **Empréstimos Pessoais:** Dívidas a instituições ou familiares.

---

## Exemplo Prático: A Família Silva

Vamos ver um caso realista em Portugal. O João e a Maria têm:

**Ativos:**
- Casa: €250.000
- Carro: €15.000
- Depósitos/PPR: €20.000
- **Total Ativos: €285.000**

**Passivos:**
- Crédito Habitação: €180.000
- Crédito Automóvel: €10.000
- **Total Passivos: €190.000**

**Património Líquido:** €285.000 - €190.000 = **€95.000**

Isto significa que, se vendessem tudo e pagassem todas as dívidas, sobrariam €95.000. Este é o valor real da sua riqueza.

---

## Como Acompanhar (e Porque Deves Fazê-lo)

Calcular uma vez é útil. Acompanhar ao longo do tempo é transformador.

1. **Define uma Frequência:** Mensalmente é o ideal, mas trimestral ou anualmente também funciona. O importante é a consistência.
2. **Usa a Ferramenta Certa:** Podes usar uma folha de cálculo ou uma app como a Caravel, que foi desenhada especificamente para este propósito.
3. **Analisa a Tendência:** O número subiu ou desceu? Porquê? Se o teu património líquido está a crescer, estás no caminho certo, independentemente do teu salário.

### Erros Comuns a Evitar

- **Sobrevalorizar Ativos:** Sê realista com o valor da casa ou do carro. Usa valores de mercado conservadores.
- **Esquecer Pequenas Dívidas:** Cartões de crédito, BNPL (buy now, pay later) ou dívidas a familiares contam.
- **Não Atualizar:** Um cálculo de há 3 anos não serve de nada hoje.

---

## Conclusão

Gerir o património líquido é assumir o leme das tuas finanças. Deixas de navegar à vista, preocupado apenas com o fim do mês, e passas a traçar uma rota de longo prazo.

Começa hoje. Faz o teu primeiro inventário, calcula o teu número e regista-o. Daqui a um ano, vais agradecer a ti mesmo.

[Inicia a tua Expedição](https://thecaravelapp.com)

---

*A Caravel é um instrumento de navegação e suporte à decisão. Todo o conteúdo é meramente informativo e não constitui aconselhamento financeiro ou recomendação de investimento.*
        `,
        faq: [
            {
                question: 'O que é o património líquido?',
                answer: 'É a diferença entre tudo o que possuis (ativos) e tudo o que deves (passivos). Representa a tua verdadeira riqueza financeira num dado momento.'
            },
            {
                question: 'O meu património líquido pode ser negativo?',
                answer: 'Sim. Se as tuas dívidas forem superiores ao valor dos teus bens (por exemplo, crédito estudantil elevado sem ativos correspondentes), o teu património líquido será negativo. O objetivo é torná-lo positivo ao longo do tempo.'
            },
            {
                question: 'Com que frequência devo calcular o net worth?',
                answer: 'Recomendamos uma revisão mensal ou trimestral. Isto permite-te ver o progresso, manter a motivação e ajustar a tua estratégia financeira atempadamente.'
            },
            {
                question: 'A casa conta para o património líquido?',
                answer: 'Sim. O valor de mercado da tua casa entra nos Ativos. O valor que ainda deves ao banco pelo crédito habitação entra nos Passivos.'
            }
        ]
    },
    'ppr-2026-guia': {
        slug: 'ppr-2026-guia',
        title: 'PPR em 2026: Quanto Rende e Como Deduzir no IRS',
        description: 'Descobre como funciona o PPR em Portugal, quanto rende em 2026 e como maximizar a dedução fiscal até €400.',
        date: '2026-02-10',
        readTime: '6 min',
        author: 'Caravel Team',
        tags: ['poupança', 'investimentos', 'irs', 'portugal', 'reforma'],
        thumbnail: '/blog/ppr-2026-guia.webp',
        content: `
## O Que É um PPR e Quanto Rende em 2026?

Um Plano Poupança Reforma (PPR) é um instrumento financeiro desenhado para construir uma reserva de longo prazo para a reforma. Em 2026, os melhores Seguros PPR com capital garantido oferecem taxas entre **2,00% e 2,20%** de rentabilidade mínima, enquanto os Fundos PPR — sem garantia de capital — têm registado rendimentos médios de **3,53% a 3,95%** ao ano.

Mais do que rentabilidade, o PPR destaca-se pelo **benefício fiscal**: podes deduzir até **€400 por ano no IRS**, dependendo da tua idade. É uma das poucas ferramentas onde o Estado te recompensa diretamente por poupares.

> O PPR não é apenas um produto financeiro — é uma decisão estratégica de longo prazo.

---

## Seguros PPR vs Fundos PPR: Qual Escolher?

Existem dois tipos principais de PPR, e a escolha depende do teu perfil de risco:

### Seguros PPR (Capital Garantido)

- **Risco:** Baixo — o capital investido está protegido
- **Rentabilidade 2026:** 2,00% a 2,20% (garantida)
- **Ideal para:** Perfis conservadores, proximidade da reforma
- **Exemplos:** PRÉVOIR PPR (2,20%), BPI Garantia Extra (2,00%)

### Fundos PPR (Sem Garantia de Capital)

- **Risco:** Médio a alto — investem nos mercados financeiros
- **Rentabilidade média:** 3,53% a 3,95% (histórica, não garantida)
- **Ideal para:** Perfis moderados/dinâmicos, jovens com horizonte longo
- **Vantagem:** Potencial de retorno superior a longo prazo

**Regra de ouro:** Quanto mais longe estiveres da reforma, mais podes beneficiar de um Fundo PPR. Quanto mais perto, mais faz sentido proteger o capital num Seguro PPR.

---

## Benefícios Fiscais PPR em 2026

O grande trunfo do PPR é a **dedução à coleta do IRS**. Podes deduzir 20% do valor investido, com os seguintes limites:

- **Até 35 anos:** dedução máxima de €400/ano (entrega de €2.000)
- **Entre 35 e 50 anos:** dedução máxima de €350/ano (entrega de €1.750)
- **Mais de 50 anos:** dedução máxima de €300/ano (entrega de €1.500)

### Como Funciona na Prática?

Se tens 30 anos e investires **€2.000** num PPR durante 2026, recebes **€400 de volta** no reembolso do IRS de 2027. Isto equivale a um retorno imediato de 20% — antes sequer de considerar a rentabilidade do produto.

> Poucos instrumentos financeiros te dão 20% de retorno garantido no primeiro ano. O PPR é um deles.

---

## Como Escolher o Melhor PPR? (Passo a Passo)

### 1. Define o Teu Perfil de Risco

Pergunta-te: quanto tempo falta para a reforma? Se faltam mais de 20 anos, podes tolerar mais risco. Se faltam menos de 10, prioriza capital garantido.

### 2. Compara Comissões (Atenção!)

As comissões são o maior inimigo silencioso do PPR. Alguns produtos cobram comissões que consomem **30% a 40% da rentabilidade**. Procura PPRs com:

- **Comissão de gestão:** inferior a 1,5% ao ano
- **Comissão de subscrição:** idealmente 0%
- **Comissão de resgate:** verifica as condições de saída antecipada

### 3. Usa os Comparadores Oficiais

- **Comparador ASF** — Para Seguros PPR com capital garantido
- **Comparador CMVM** — Para Fundos PPR de investimento
- **Relatórios APFIPP** — Dados de rentabilidade histórica

### 4. Automatiza as Entregas

Muitos PPRs permitem entregas mensais a partir de **€25**. Automatizar este valor no dia do salário é a forma mais eficaz de construir poupança sem esforço.

---

## Armadilhas a Evitar

O PPR tem vantagens claras, mas não está isento de riscos:

- **Resgates antecipados:** Fora das condições legais (reforma, desemprego, doença grave, crédito habitação), o resgate implica a **devolução dos benefícios fiscais** mais penalização
- **Comissões ocultas:** Lê sempre o Documento de Informação Fundamental (DIF) antes de subscrever
- **Ilusão de garantia:** Nos Fundos PPR, a rentabilidade histórica não garante resultados futuros
- **Concentração excessiva:** O PPR deve ser parte de uma estratégia diversificada, não a tua única poupança

---

## Conclusão

O PPR continua a ser um dos instrumentos mais inteligentes para quem quer poupar para a reforma em Portugal. Com benefícios fiscais imediatos de até €400 e opções para todos os perfis de risco, é uma peça fundamental em qualquer estratégia financeira organizada.

O primeiro passo é simples: define quanto podes investir mensalmente e compara as opções disponíveis. Assumir o leme das finanças significa planear hoje o que vais colher amanhã.

[Inicia a tua Expedição](https://thecaravelapp.com)

---

*A Caravel é um instrumento de navegação e suporte à decisão. Todo o conteúdo é meramente informativo e não constitui aconselhamento financeiro ou recomendação de investimento.*
        `,
        faq: [
            {
                question: 'O que é um PPR?',
                answer: 'Um Plano Poupança Reforma (PPR) é um produto financeiro de longo prazo desenhado para complementar a reforma. Pode ser um Seguro PPR (com capital garantido) ou um Fundo PPR (investido nos mercados, sem garantia de capital).'
            },
            {
                question: 'Quanto posso deduzir no IRS com um PPR?',
                answer: 'Podes deduzir 20% do valor investido, até um máximo de €400/ano (até 35 anos), €350/ano (35-50 anos) ou €300/ano (mais de 50 anos).'
            },
            {
                question: 'Posso resgatar o PPR antes da reforma?',
                answer: 'Sim, mas fora das condições legais (reforma, desemprego de longa duração, doença grave, pagamento de crédito habitação), terás de devolver os benefícios fiscais obtidos, acrescidos de uma penalização.'
            },
            {
                question: 'Qual a diferença entre Seguro PPR e Fundo PPR?',
                answer: 'O Seguro PPR garante o capital investido e oferece uma taxa mínima (2-2,2% em 2026). O Fundo PPR investe nos mercados financeiros sem garantia de capital, mas com potencial de retorno superior a longo prazo (média histórica de 3,5-4%).'
            }
        ]
    },
    'guia-irs-2026': {
        slug: 'guia-irs-2026',
        title: 'IRS 2026: Guia Completo com Datas e Novos Escalões',
        description: 'Prepara o IRS 2026 com o nosso guia essencial. Novas tabelas de retenção, prazos e-Fatura e como maximizar o teu reembolso.',
        date: '2026-02-05',
        readTime: '6 min',
        author: 'Caravel Team',
        tags: ['irs', 'impostos', 'finanças pessoais', 'portugal'],
        thumbnail: '/blog/irs-2026-guide.png',
        content: `
## O Que Muda no IRS 2026?

No IRS 2026, os escalões de rendimento foram atualizados em **3,51%** e o Mínimo de Existência subiu para **€12.880**. O prazo de entrega é de **1 de abril a 30 de junho**, com validação obrigatória de faturas no e-Fatura até **2 de março**.

Estas novidades impactam diretamente a tua carteira — muitos portugueses verão uma redução na fatura fiscal. Mas para tirares partido destas mudanças, precisas de navegar com precisão.

> "Pagar apenas o que é justo não é fugir aos impostos — é literacia financeira."

---

## Calendário Essencial 2026

Marca estas datas no teu mapa para evitar coimas e garantir o reembolso mais rápido possível:

### Até 16 de Fevereiro
- **Senhorios:** Comunicar duração/cessação de contratos de arrendamento.

### Até 2 de Março (Data Crítica!)
- **Validar Faturas:** Acede ao e-Fatura e classifica todas as despesas pendentes. Este é o passo mais importante para maximizar as deduções.
- **Agregado Familiar:** Comunicar alterações ao agregado familiar (filhos que nasceram, casamentos, divórcios).

### 15 a 31 de Março
- **Reclamação:** Verificar despesas gerais familiares e dedutíveis. Se encontrares erros, é a altura de reclamar.
- **Consignação:** Escolher a entidade para doar 0,5% do teu IRS (sem custos para ti).

### 1 de Abril a 30 de Junho
- **Entrega da Declaração:** Prazo único para entrega do IRS (Modo Automático ou Manual).

---

## Novos Escalões: Em que "Mar" Navegas?

Para 2026 (rendimentos de 2025), os limites dos escalões foram atualizados para combater a "fiscal drag" (quando aumentos salariais são engolidos pela inflação fiscal).

1. **1º Escalão:** Até €8.140 (Taxa: 13%)
2. **2º Escalão:** Até €12.247
3. **3º Escalão:** Até €17.158
4. **4º Escalão:** Até €21.972

**O que isto significa:** Se o teu salário aumentou menos de 3,5%, é provável que pagues menos imposto efetivo este ano.

---

## Como Maximizar o Reembolso (Legalmente)

### 1. e-Fatura: A Tua Bússola
Passa a pente fino todas as faturas. Muitas vezes, despesas de saúde ou educação ficam na categoria "Geral" por defeito. Classificá-las corretamente pode valer centenas de euros.

### 2. Poupança-Reforma (PPR)
Se subscreveste um PPR em 2025, podes deduzir 20% do valor investido (até €400 de benefício, dependendo da tua idade). Esta é uma das poucas deduções que depende inteiramente da tua iniciativa.

### 3. Educação e Rendas
Estudantes deslocados? Rendas de casa? Certifica-te que os contratos estão registados e as faturas emitidas com o NIF correto. O benefício nas rendas pode chegar aos €600.

---

## Conclusão

O IRS não tem de ser um monstro marinho. Com organização antecipada e conhecimento dos prazos, transformas uma obrigação burocrática numa oportunidade de rever a saúde das tuas finanças.

Assome o leme hoje: entra no Portal das Finanças e valida as tuas primeiras faturas. A tua expedição para um reembolso maior começa agora.

[Inicia a tua Expedição](https://thecaravelapp.com)

---

*A Caravel é um instrumento de navegação e suporte à decisão. Todo o conteúdo é meramente informativo e não constitui aconselhamento financeiro ou recomendação de investimento.*
        `,
        faq: [
            {
                question: 'Quando começa a entrega do IRS em 2026?',
                answer: 'A entrega da declaração de IRS decorre entre 1 de abril e 30 de junho de 2026, independentemente da categoria de rendimentos.'
            },
            {
                question: 'Até quando tenho de validar as faturas?',
                answer: 'Deves validar todas as tuas faturas no portal e-Fatura até ao dia 2 de março de 2026.'
            },
            {
                question: 'O que acontece se não validar as faturas?',
                answer: 'Se não validares, as despesas podem não ser consideradas para efeitos de dedução à coleta, resultando num reembolso menor ou mais imposto a pagar.'
            },
            {
                question: 'Como funciona o IRS automático?',
                answer: 'O IRS automático é uma declaração pré-preenchida pela AT para contribuintes com rendimentos simples (categoria A e/ou H). Se os dados estiverem corretos, basta confirmar. No entanto, revê sempre antes de aceitar.'
            },
            {
                question: 'Que despesas posso deduzir no IRS?',
                answer: 'Podes deduzir despesas de saúde (15%), educação (30%), habitação (15% de rendas), lares (25%) e despesas gerais familiares (35% até €250). As percentagens referem-se à dedução sobre o montante gasto.'
            }
        ]
    },
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
## O Que É Literacia Financeira e Porque É Essencial?

Literacia financeira é a capacidade de compreender e aplicar conceitos financeiros — como orçamentação, poupança, investimento e gestão de dívida — para tomar decisões informadas sobre dinheiro. Em Portugal, apenas **27% da população** demonstra conhecimentos financeiros adequados, segundo o Banco de Portugal.

Quem não compreende como o dinheiro funciona acaba por ser controlado por ele. Em contrapartida, quem domina os princípios básicos da gestão financeira conquista:

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

[Inicia a tua Expedição](https://thecaravelapp.com)

---

*A Caravel é um instrumento de navegação e suporte à decisão. Todo o conteúdo é meramente informativo e não constitui aconselhamento financeiro ou recomendação de investimento.*
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
        readTime: '6 min',
        author: 'Caravel Team',
        tags: ['orçamento', 'finanças pessoais', 'poupança'],
        thumbnail: '/blog/orcamento-pessoal.webp',
        content: `
## Como Criar um Orçamento Pessoal?

Para criar um orçamento pessoal, segue estes 5 passos: **1)** calcula os rendimentos líquidos, **2)** lista as despesas fixas, **3)** estima as despesas variáveis, **4)** define metas de poupança com a regra 50/30/20, e **5)** revê e ajusta mensalmente.

Um orçamento é a ferramenta mais eficaz para tomar o controlo das tuas finanças — permite-te saber exatamente para onde vai cada euro. Segundo dados recentes, **67% dos portugueses não têm um orçamento definido**, e é precisamente por isso que tantas famílias chegam ao fim do mês sem saber onde foi o dinheiro.

> Quem não sabe para onde vai o dinheiro nunca vai ter o suficiente. O orçamento não é uma restrição — é um mapa.

---

## Os 5 Passos para Criar o Teu Orçamento

### Passo 1: Calcula os Teus Rendimentos Líquidos

Lista todos os rendimentos mensais após impostos:

- Salário líquido
- Rendimentos extra (freelance, part-time, investimentos)
- Subsídios ou outros apoios recorrentes

**Dica:** Usa sempre o valor líquido (após IRS e Segurança Social). Se tens rendimentos variáveis, usa a média dos últimos 3 a 6 meses.

### Passo 2: Lista as Despesas Fixas

Identifica gastos que se repetem todos os meses com valor previsível:

- Renda ou prestação da casa
- Seguros (saúde, automóvel, vida)
- Subscrições (Netflix, Spotify, ginásio)
- Telecomunicações (internet, telemóvel)
- Transportes (passe, combustível, portagens)

### Passo 3: Estima as Despesas Variáveis

Estes são os gastos que podes controlar mais facilmente:

- Alimentação e supermercado
- Lazer e entretenimento
- Restaurantes e cafés
- Compras diversas (roupa, eletrónica)
- Cuidados pessoais

**Dica:** Revê os extratos dos últimos 3 meses para teres uma base realista. A maioria das pessoas subestima os gastos variáveis em **20 a 30%**.

### Passo 4: Define Metas de Poupança

A regra 50/30/20 é um bom ponto de partida:

- **50%** para necessidades (renda, alimentação, contas)
- **30%** para desejos (lazer, restaurantes, compras)
- **20%** para poupança e investimento

Ajusta conforme a tua realidade. Em Portugal, com o custo de habitação a absorver frequentemente mais de 35% do rendimento, a divisão pode precisar de ajustes — e tudo bem. O importante é que exista uma meta de poupança, mesmo que comece nos 10%.

### Passo 5: Revê e Ajusta Mensalmente

Um orçamento não é um documento estático — é uma ferramenta viva. Todos os meses:

- Compara o que planeaste com o que gastaste
- Identifica onde ultrapassaste os limites
- Ajusta categorias se necessário
- Celebra os progressos (a motivação importa)

> O orçamento perfeito não existe ao primeiro mês. Existe ao terceiro, quando já conheces os teus padrões e os ajustas com inteligência.

---

## Erros Comuns que Sabotam o Orçamento

Criar o orçamento é o primeiro passo. Mantê-lo é o desafio. Evita estes erros:

- **Ser demasiado restritivo:** Um orçamento que não inclui lazer é um orçamento que vais abandonar. Sê realista.
- **Esquecer despesas anuais:** Seguros, IMI, IUC, manutenção do carro. Divide o valor anual por 12 e inclui no orçamento mensal.
- **Não registar pequenos gastos:** Cafés, snacks, compras por impulso. Parecem irrelevantes, mas podem somar €100-200/mês.
- **Desistir após um mês mau:** Todos os meses têm imprevistos. Um mês acima do orçamento não é um fracasso — é informação para ajustar.

---

## Ferramentas para Gerir o Orçamento

A melhor ferramenta é aquela que usas consistentemente:

- **Caderno e caneta:** Simples, sem distrações. Funciona para quem prefere o analógico.
- **Folha de cálculo:** Excel ou Google Sheets dão total personalização. Requerem mais esforço inicial.
- **Apps de gestão financeira:** A forma mais visual e rápida. Procura apps que respeitem a tua privacidade e te dêem controlo manual.

O mais importante não é a ferramenta — é o hábito. Dedica 10 minutos por semana a registar e rever. Com consistência, os resultados aparecem em poucas semanas.

---

## Conclusão

Criar um orçamento é o primeiro passo para dominar as tuas finanças. Não precisa de ser perfeito — precisa de existir. Os 5 passos acima dão-te uma estrutura sólida para começar, e o tempo vai encarregar-se de a refinar.

O segredo está na consistência: quem revê o orçamento todos os meses poupa em média **mais 15 a 20%** do que quem não o faz. Começa hoje, mesmo que simples.

[Inicia a tua Expedição](https://thecaravelapp.com)

---

*A Caravel é um instrumento de navegação e suporte à decisão. Todo o conteúdo é meramente informativo e não constitui aconselhamento financeiro ou recomendação de investimento.*
    `,
        faq: [
            {
                question: 'Quanto tempo demora a criar um orçamento?',
                answer: 'Criar o primeiro orçamento pode demorar 30-60 minutos. Com prática e ferramentas como a Caravel, a manutenção mensal demora apenas 5-10 minutos.'
            },
            {
                question: 'Devo usar uma app ou folha de cálculo?',
                answer: 'Ambos funcionam. Apps oferecem uma experiência mais visual e rápida. Folhas de cálculo são mais personalizáveis mas requerem mais esforço. O mais importante é a consistência.'
            },
            {
                question: 'E se os meus rendimentos forem variáveis?',
                answer: 'Usa a média dos últimos 3-6 meses como base. Nos meses de rendimento acima da média, direciona o extra para poupança ou fundo de emergência.'
            },
            {
                question: 'A regra 50/30/20 funciona em Portugal?',
                answer: 'É um bom ponto de partida, mas pode precisar de ajustes. Com o custo de habitação elevado em cidades como Lisboa e Porto, a parcela de necessidades pode ultrapassar 50%. Ajusta as proporções à tua realidade.'
            },
            {
                question: 'Como lidar com despesas imprevistas no orçamento?',
                answer: 'Inclui uma categoria de "imprevistos" no orçamento (5-10% do rendimento). Para despesas maiores, recorre ao fundo de emergência. O importante é que o imprevisto não destrua o plano.'
            }
        ]
    },
    'fundo-emergencia-quanto-poupar': {
        slug: 'fundo-emergencia-quanto-poupar',
        title: 'Fundo de Emergência: Quanto Deves Poupar?',
        description: 'Descobre quanto deves ter no teu fundo de emergência e como construí-lo passo a passo. Guia completo com valores para Portugal.',
        date: '2025-02-01',
        readTime: '5 min',
        author: 'Caravel Team',
        tags: ['poupança', 'fundo emergência', 'finanças pessoais'],
        thumbnail: '/blog/fundo-emergencia.webp',
        content: `
## Quanto Deves Ter no Fundo de Emergência?

Deves ter entre **3 a 6 meses de despesas essenciais** reservados para imprevistos. Para uma família portuguesa com despesas mensais de €1.500, isso significa entre **€4.500 e €9.000**. Se és freelancer ou tens rendimentos variáveis, o ideal sobe para **9 a 12 meses** — entre €13.500 e €18.000.

Este dinheiro não é para férias, compras planeadas ou investimentos. É a tua âncora financeira: o que te impede de recorrer a crédito quando o inesperado acontece.

> Segundo o Banco de Portugal, cerca de 40% das famílias portuguesas não conseguiriam cobrir uma despesa inesperada de €1.000 sem recorrer a crédito. O fundo de emergência existe para que não sejas uma delas.

---

## Porque Precisas de Um? (Os Números Falam)

A vida não avisa. Eis os imprevistos mais comuns e os seus custos médios em Portugal:

- **Reparação automóvel:** €300 a €2.000
- **Avaria doméstica (caldeira, eletrodoméstico):** €200 a €800
- **Despesas médicas não cobertas:** €100 a €1.500
- **Perda de emprego:** 3 a 6 meses sem rendimento

Sem reserva, qualquer destes cenários obriga-te a recorrer a cartões de crédito ou crédito pessoal — com juros que agravam o problema. Com um fundo de emergência, absorves o impacto sem comprometer o resto das tuas finanças.

---

## Como Calcular o Teu Valor Ideal

### Passo 1: Soma as Despesas Essenciais Mensais

Inclui apenas o indispensável:
- Renda ou prestação da casa
- Alimentação
- Contas fixas (água, luz, gás, internet, telecomunicações)
- Transportes
- Seguros obrigatórios

### Passo 2: Multiplica pelo Teu Fator de Segurança

- **Trabalho estável por conta de outrem:** multiplica por 3 a 4
- **Contrato a prazo ou setor instável:** multiplica por 5 a 6
- **Freelancer ou rendimento variável:** multiplica por 9 a 12

**Exemplo concreto:** Se as tuas despesas essenciais são €1.200/mês e trabalhas por conta de outrem com contrato efetivo, o teu fundo ideal é de **€3.600 a €4.800**.

---

## Como Construir o Fundo (Passo a Passo)

1. **Define um primeiro objetivo:** Começa com €1.000. Este valor cobre a maioria dos imprevistos menores e dá-te confiança para continuar.
2. **Automatiza a poupança:** Configura uma transferência automática no dia do salário. Mesmo €50 ou €100 por mês fazem diferença — a consistência vence a velocidade.
3. **Separa o dinheiro:** Guarda numa conta diferente da conta corrente. Se o dinheiro estiver acessível, vais gastá-lo.
4. **Aumenta gradualmente:** Quando atingires €1.000, define o próximo objetivo (3 meses). Quando atingires 3 meses, avança para 6.

> O segredo não é poupar muito de uma vez — é poupar pouco, mas sempre. €100/mês são €1.200 em um ano e €6.000 em cinco.

---

## Onde Guardar o Fundo de Emergência

O fundo de emergência não é para investir — é para estar disponível. As melhores opções em Portugal:

- **Conta poupança separada:** A opção mais simples. Rentabilidade baixa (~0,5-1%), mas acesso imediato.
- **Depósito a prazo com mobilização antecipada:** Melhor taxa (~1,5-2%), mas confirma que podes levantar sem penalização severa.
- **Certificados de Aforro (série F):** Boa rentabilidade (~2,5%), mobilização após 3 meses. Ideal para a parte do fundo que não precisas no imediato.

**Evita:** Ações, fundos de investimento, criptomoedas, ou qualquer ativo volátil. O objetivo é segurança, não rentabilidade.

---

## Erros Comuns a Evitar

- **Não começar por achar que "não dá":** €50/mês já é um fundo de emergência em construção. Começar é mais importante que o valor.
- **Usar o fundo para "oportunidades":** Promoções, viagens ou investimentos não são emergências. Cria objetivos separados para estes.
- **Guardar na conta corrente:** Se o dinheiro não está separado, vai desaparecer nos gastos do dia-a-dia.
- **Parar depois de atingir o objetivo:** A inflação erode o valor. Revê o teu fundo anualmente e ajusta às tuas despesas atuais.

---

## Conclusão

O fundo de emergência é a base de qualquer estratégia financeira sólida. Sem ele, qualquer imprevisto pode deitar abaixo meses de progresso. Com ele, navegas com a tranquilidade de quem sabe que está preparado.

O primeiro passo é simples: abre uma conta separada e configura uma transferência automática, mesmo que pequena. O teu futuro eu vai agradecer-te.

[Inicia a tua Expedição](https://thecaravelapp.com)

---

*A Caravel é um instrumento de navegação e suporte à decisão. Todo o conteúdo é meramente informativo e não constitui aconselhamento financeiro ou recomendação de investimento.*
    `,
        faq: [
            {
                question: 'Quanto devo ter no fundo de emergência?',
                answer: 'Entre 3 a 6 meses de despesas essenciais. Para uma família com €1.500/mês de despesas, isso significa €4.500 a €9.000. Freelancers devem guardar 9 a 12 meses.'
            },
            {
                question: 'Onde devo guardar o fundo de emergência?',
                answer: 'Numa conta poupança de fácil acesso mas separada da conta corrente. Certificados de Aforro são boa opção para parte do fundo. Evita investimentos voláteis — o objetivo é segurança, não rentabilidade.'
            },
            {
                question: 'Posso usar o fundo de emergência para férias?',
                answer: 'Não. O fundo de emergência é exclusivamente para imprevistos (avarias, despesas médicas, perda de emprego). Para férias e outros objetivos, cria uma poupança separada.'
            },
            {
                question: 'Quanto tempo demora a construir um fundo de emergência?',
                answer: 'Depende do valor que poupas mensalmente. Com €100/mês, atinges €1.200 em um ano e €6.000 em cinco anos. O mais importante é começar, mesmo com valores pequenos, e manter a consistência.'
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
## O Que São Mercados Emergentes e Porque Brilham em 2026?

Mercados emergentes são economias em desenvolvimento rápido — como Brasil, Índia, China, Indonésia e México — que oferecem potencial de crescimento superior às economias maduras. Em 2026, são a aposta favorita de Wall Street pela primeira vez numa década.

Após anos de subdesempenho face aos EUA, estas economias superaram o S&P 500 em 2025 e os analistas preveem um **ciclo plurianual de entrada de capitais**. Para investidores portugueses, esta tendência abre portas a uma diversificação geográfica que há muito estava esquecida.

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

[Inicia a tua Expedição](https://thecaravelapp.com)

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
