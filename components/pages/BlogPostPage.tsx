import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Logo } from '../ui/Logo.tsx';
import { Footer } from '../landing/Footer.tsx';
import { ArrowLeft, User } from 'lucide-react';
import { blogPostsData, BlogPost } from '../../data/blogPosts.ts';

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
                        {/* Clickable Tags */}
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <Link
                                    key={tag}
                                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                                    className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300 cursor-pointer hover:bg-accent/10 hover:border-accent hover:text-accent transition-all duration-200"
                                >
                                    {tag}
                                </Link>
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

                {/* Article Image / Hero */}
                <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="w-full h-64 sm:h-96 bg-neutral-900 rounded-2xl sm:rounded-3xl shadow-lg border border-neutral-800 overflow-hidden relative">
                        {post.thumbnail ? (
                            <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Logo variant="icon" className="w-24 h-24 sm:w-32 sm:h-32 opacity-10" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Article Content */}
                <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none
                        prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
                        prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-12 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-8 prose-h3:mb-3
                        prose-p:text-base prose-p:sm:text-lg prose-p:leading-relaxed prose-p:sm:leading-loose prose-p:text-neutral-600 dark:prose-p:text-neutral-400 prose-p:mb-6
                        prose-ul:my-4 prose-ul:pl-0 prose-ul:list-none prose-ul:space-y-2
                        prose-ol:my-4 prose-ol:pl-0 prose-ol:list-none prose-ol:space-y-2
                        prose-li:text-base prose-li:sm:text-lg prose-li:text-neutral-600 dark:prose-li:text-neutral-400 prose-li:leading-relaxed
                        prose-strong:font-semibold prose-strong:text-neutral-900 dark:prose-strong:text-white
                        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-8 prose-blockquote:bg-neutral-50 dark:prose-blockquote:bg-neutral-900/50 prose-blockquote:rounded-r-xl
                        prose-blockquote:not-italic prose-blockquote:text-lg prose-blockquote:sm:text-xl prose-blockquote:text-neutral-700 dark:prose-blockquote:text-neutral-300
                        prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800 prose-hr:my-10
                    ">
                        {(() => {
                            const lines = post.content.split('\n');
                            const elements: React.ReactNode[] = [];
                            let currentList: string[] = [];
                            let listType: 'ul' | 'ol' | null = null;

                            const parseInline = (text: string) => {
                                const parts = text.split(/(\*\*[^*]+\*\*)/);
                                return parts.map((part, j) =>
                                    part.startsWith('**') ? <strong key={j}>{part.replace(/\*\*/g, '')}</strong> : part
                                );
                            };

                            const flushList = () => {
                                if (currentList.length > 0) {
                                    if (listType === 'ol') {
                                        elements.push(
                                            <ol key={elements.length} className="my-6 space-y-3">
                                                {currentList.map((item, idx) => (
                                                    <li key={idx} className="flex gap-4 items-start">
                                                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center mt-0.5">{idx + 1}</span>
                                                        <span>{parseInline(item)}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        );
                                    } else {
                                        elements.push(
                                            <ul key={elements.length} className="my-6 space-y-3">
                                                {currentList.map((item, idx) => (
                                                    <li key={idx} className="flex gap-3 items-start">
                                                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-3"></span>
                                                        <span>{parseInline(item)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    currentList = [];
                                    listType = null;
                                }
                            };

                            lines.forEach((line, i) => {
                                // Unordered list
                                if (line.startsWith('- ')) {
                                    if (listType !== 'ul') flushList();
                                    listType = 'ul';
                                    currentList.push(line.replace('- ', ''));
                                    return;
                                }

                                // Ordered list
                                if (/^\d+\.\s/.test(line)) {
                                    if (listType !== 'ol') flushList();
                                    listType = 'ol';
                                    currentList.push(line.replace(/^\d+\.\s/, ''));
                                    return;
                                }

                                // Not a list item, flush any pending list
                                flushList();

                                if (line.startsWith('## ')) {
                                    elements.push(<h2 key={i}>{line.replace('## ', '')}</h2>);
                                } else if (line.startsWith('### ')) {
                                    elements.push(<h3 key={i}>{line.replace('### ', '')}</h3>);
                                } else if (line.startsWith('---')) {
                                    elements.push(<hr key={i} />);
                                } else if (line.startsWith('> ')) {
                                    elements.push(<blockquote key={i}><p>{parseInline(line.replace('> ', ''))}</p></blockquote>);
                                } else if (line.trim() !== '') {
                                    elements.push(<p key={i}>{parseInline(line)}</p>);
                                }
                            });

                            flushList(); // Don't forget trailing list
                            return elements;
                        })()}
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
                                    Inicia a tua expedição
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

            {/* Article Schema */}
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

            {/* FAQ Schema for SEO */}
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

            {/* Breadcrumb Schema */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://thecaravelapp.com" },
                        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://thecaravelapp.com/blog" },
                        { "@type": "ListItem", "position": 3, "name": post.title, "item": shareUrl }
                    ]
                })
            }} />
        </div>
    );
};

export default BlogPostPage;
