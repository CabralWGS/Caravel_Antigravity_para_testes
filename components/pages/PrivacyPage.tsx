import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../ui/Logo.tsx';
import { Card } from '../ui/Card.tsx';

const PrivacyPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-300">
            <header className="fixed top-0 left-0 right-0 z-30 py-4 px-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto max-w-4xl flex justify-between items-center">
                    <Link to="/" aria-label="Voltar à página inicial">
                        <Logo variant="icon" className="h-8 w-8" />
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

            <main className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
                <div className="space-y-8 animate-fade-in-scale">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Política de Privacidade</h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            Simples. Transparente. Os teus dados são teus.
                        </p>
                    </div>

                    <Card className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                        <h3>1. O Nosso Compromisso</h3>
                        <p>
                            A Caravel foi construída com um princípio fundamental: <strong>Privacidade em Primeiro Lugar</strong>. 
                            Ao contrário de outras aplicações financeiras, nós não vendemos os teus dados, não analisamos o teu perfil para publicidade 
                            e não nos ligamos às tuas contas bancárias.
                        </p>

                        <h3>2. Que dados recolhemos?</h3>
                        <p>Recolhemos apenas o estritamente necessário para a aplicação funcionar:</p>
                        <ul>
                            <li><strong>Dados de Conta:</strong> O teu email (para autenticação) e preferências (moeda, categorias).</li>
                            <li><strong>Dados Financeiros:</strong> As transações e registos de património que inseres manualmente.</li>
                            <li><strong>Dados Técnicos:</strong> Logs básicos de acesso para segurança e manutenção do servidor.</li>
                        </ul>

                        <h3>3. Como usamos os dados?</h3>
                        <p>
                            Os teus dados são usados <strong>exclusivamente</strong> para te fornecer o serviço da Caravel: gerar os teus gráficos, 
                            calcular a tua evolução patrimonial e guardar as tuas definições. Nunca partilhamos os teus dados financeiros com terceiros.
                        </p>

                        <h3>4. Segurança e Armazenamento</h3>
                        <p>
                            Utilizamos o <strong>Supabase</strong> como infraestrutura de base de dados, que providencia encriptação de dados em repouso e em trânsito. 
                            A autenticação é gerida de forma segura e nós nunca temos acesso à tua password em texto simples.
                        </p>

                        <h3>5. Os teus direitos</h3>
                        <p>
                            Tu és o dono dos teus dados. Na secção "Definições > Conta" da aplicação, podes a qualquer momento:
                        </p>
                        <ul>
                            <li><strong>Exportar:</strong> Descarregar uma cópia completa de todos os teus dados em formato JSON.</li>
                            <li><strong>Apagar:</strong> Eliminar permanentemente a tua conta e todos os registos associados.</li>
                        </ul>

                        <h3>6. Contacto</h3>
                        <p>
                            Se tiveres dúvidas sobre esta política, podes contactar-nos através do suporte na aplicação ou via email.
                        </p>

                        <hr />
                        <p className="text-xs text-neutral-500">Última atualização: {new Date().getFullYear()}</p>
                    </Card>
                </div>
            </main>

            <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} Caravel. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default PrivacyPage;