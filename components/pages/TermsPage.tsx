import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../ui/Logo.tsx';
import { Card } from '../ui/Card.tsx';

const TermsPage: React.FC = () => {
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
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Termos e Condições</h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            As regras da expedição.
                        </p>
                    </div>

                    <Card className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                        <h3>1. Aceitação dos Termos</h3>
                        <p>
                            Ao criar uma conta e utilizar a Caravel, concordas com estes Termos de Serviço. Se não concordares com algum ponto, 
                            não deves utilizar a aplicação.
                        </p>

                        <h3>2. Isenção de Responsabilidade Financeira (Disclaimer)</h3>
                        <p className="font-semibold bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800 not-prose text-sm text-yellow-800 dark:text-yellow-200">
                            A Caravel é uma ferramenta de registo e visualização de dados. <strong>Nós não prestamos consultoria financeira, fiscal ou de investimento.</strong>
                        </p>
                        <p>
                            Todas as informações apresentadas na aplicação (incluindo gráficos, cálculos de "crescimento passivo" e projeções) baseiam-se 
                            exclusivamente nos dados inseridos por ti. Não garantimos a exatidão futura dos teus investimentos nem assumimos responsabilidade 
                            por quaisquer decisões financeiras tomadas com base no uso da aplicação.
                        </p>

                        <h3>3. Uso Aceitável</h3>
                        <p>
                            Comprometes-te a usar a Caravel apenas para fins legais e pessoais. É proibido tentar aceder indevidamente aos dados de outros utilizadores, 
                            sobrecarregar a infraestrutura da aplicação ou utilizar o serviço para atividades ilícitas.
                        </p>

                        <h3>4. Disponibilidade do Serviço</h3>
                        <p>
                            Esforçamo-nos para manter a Caravel disponível 24/7, mas não garantimos que o serviço seja ininterrupto ou livre de erros. 
                            Reservamo-nos o direito de suspender o serviço para manutenção ou atualizações.
                        </p>

                        <h3>5. Alterações aos Termos</h3>
                        <p>
                            Podemos atualizar estes termos ocasionalmente. Notificaremos os utilizadores sobre alterações significativas. 
                            O uso continuado da aplicação após alterações constitui aceitação dos novos termos.
                        </p>

                        <h3>6. Lei Aplicável</h3>
                        <p>
                            Estes termos são regidos pelas leis de Portugal e da União Europeia.
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

export default TermsPage;