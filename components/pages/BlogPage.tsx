import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../ui/Logo.tsx';
import { Footer } from '../landing/Footer.tsx';
import { ArrowRight, Calendar, X } from 'lucide-react';
import { blogPosts, allTags } from '../../data/blogPosts.ts';

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

const BlogCard: React.FC<{ post: typeof blogPosts[0] }> = ({ post }) => {
    const [imgError, setImgError] = React.useState(false);

    return (
        <article className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 ease-out">
            <Link to={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="sm:w-72 h-48 sm:h-auto bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden">
                    {!imgError ? (
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Logo variant="minimal" className="h-16 opacity-30" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    {/* Tags - Clickable */}
                    <div className="flex flex-wrap gap-2 mb-3" onClick={(e) => e.preventDefault()}>
                        {post.tags.slice(0, 3).map(tag => (
                            <Link
                                key={tag}
                                to={`/blog?tag=${encodeURIComponent(tag)}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer hover:bg-accent/10 hover:text-accent transition-all duration-200"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-accent transition-colors">
                        {post.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400 line-clamp-2 text-sm">
                        {post.description}
                    </p>

                    {/* Meta */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                            </span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                        <span className="text-sm font-semibold text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                            Ler <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
};

const BlogPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTag = searchParams.get('tag');

    // Filter posts by tag if active
    const filteredPosts = activeTag
        ? blogPosts.filter(p => p.tags.includes(activeTag))
        : blogPosts;

    const clearFilter = () => {
        setSearchParams({});
    };

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

                {/* Active Filter Badge */}
                {activeTag && (
                    <div className="mb-8 flex items-center gap-3">
                        <span className="text-sm text-neutral-500">A filtrar por:</span>
                        <button
                            onClick={clearFilter}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full hover:bg-accent/20 transition-colors cursor-pointer"
                        >
                            {activeTag}
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Tag Filter Pills */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {allTags.map(tag => (
                        <Link
                            key={tag}
                            to={activeTag === tag ? '/blog' : `/blog?tag=${encodeURIComponent(tag)}`}
                            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 cursor-pointer ${activeTag === tag
                                    ? 'bg-accent text-white border-accent'
                                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-accent hover:text-accent'
                                }`}
                        >
                            {tag}
                        </Link>
                    ))}
                </div>

                {/* Blog Posts Grid */}
                <div className="grid gap-6">
                    {filteredPosts.map(post => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                            Nenhum artigo encontrado com a tag "{activeTag}".
                        </p>
                        <button
                            onClick={clearFilter}
                            className="text-accent font-semibold hover:underline cursor-pointer"
                        >
                            Limpar filtro
                        </button>
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

            {/* CollectionPage Schema for SEO */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": activeTag ? `Artigos sobre ${activeTag}` : "Blog Caravel",
                    "description": activeTag
                        ? `Artigos sobre ${activeTag} - finanças pessoais e gestão de património`
                        : "Artigos sobre finanças pessoais, poupança e gestão de património",
                    "url": activeTag
                        ? `https://thecaravelapp.com/blog?tag=${encodeURIComponent(activeTag)}`
                        : "https://thecaravelapp.com/blog",
                    "mainEntity": {
                        "@type": "ItemList",
                        "numberOfItems": filteredPosts.length,
                        "itemListElement": filteredPosts.map((post, i) => ({
                            "@type": "ListItem",
                            "position": i + 1,
                            "url": `https://thecaravelapp.com/blog/${post.slug}`,
                            "name": post.title
                        }))
                    }
                })
            }} />
        </div>
    );
};

export default BlogPage;
