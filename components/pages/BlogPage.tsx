import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo.tsx';
import { Footer } from '../landing/Footer.tsx';
import { ArrowRight, Calendar } from 'lucide-react';

// Blog posts metadata - will be replaced with actual content loading
const blogPosts = [
    {
        slug: 'literacia-financeira-portugal',
        title: 'Literacia Financeira em Portugal: Guia Completo 2026',
        description: 'Aprende a gerir as tuas finanças em Portugal. Descobre os 5 pilares da literacia financeira, dicas de poupança e como proteger a tua privacidade.',
        date: '2026-02-03',
        readTime: '6 min',
        tags: ['literacia financeira', 'finanças pessoais', 'portugal'],
    },
    {
        slug: 'como-criar-orcamento-pessoal',
        title: 'Como Criar um Orçamento Pessoal em 5 Passos Simples',
        description: 'Aprende a criar um orçamento mensal eficaz em apenas 5 passos. Guia prático para começares a controlar as tuas finanças hoje.',
        date: '2025-02-03',
        readTime: '5 min',
        tags: ['orçamento', 'iniciantes'],
    },
    {
        slug: 'fundo-emergencia-quanto-poupar',
        title: 'Fundo de Emergência: Quanto Deves Poupar?',
        description: 'Descobre quanto deves ter no teu fundo de emergência e como construí-lo passo a passo.',
        date: '2025-02-01',
        readTime: '4 min',
        tags: ['poupança', 'fundo emergência'],
    },
];

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

const BlogCard: React.FC<{ post: typeof blogPosts[0] }> = ({ post }) => (
    <article className="group border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
            <span>•</span>
            <span>{post.readTime} de leitura</span>
        </div>
        <h2 className="mt-3 font-display text-xl font-bold tracking-tight group-hover:underline">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300 line-clamp-2">{post.description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
            <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 hover:underline">
                Ler artigo <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    </article>
);

const BlogPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
            <BlogHeader />

            <main className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="font-display text-4xl font-extrabold tracking-tight">Blog Caravel</h1>
                    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
                        Artigos sobre finanças pessoais, poupança e gestão de património.
                    </p>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid gap-6">
                    {blogPosts.map(post => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>

                {/* Empty State (for when no posts exist) */}
                {blogPosts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Em breve, novos artigos sobre finanças pessoais.
                        </p>
                    </div>
                )}
            </main>

            <Footer />

            {/* Schema Markup for Blog */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Blog",
                    "name": "Blog Caravel",
                    "description": "Artigos sobre finanças pessoais, poupança e gestão de património",
                    "url": "https://thecaravelapp.com/blog",
                    "publisher": {
                        "@type": "Organization",
                        "name": "Caravel",
                        "url": "https://thecaravelapp.com"
                    }
                })
            }} />
        </div>
    );
};

export default BlogPage;
