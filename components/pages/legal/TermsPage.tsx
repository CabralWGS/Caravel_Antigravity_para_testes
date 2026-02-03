import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Logo } from '../../ui/Logo.tsx';
import { Card } from '../../ui/Card.tsx';

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
                        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Termos de Serviço</h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            Regras da expedição e responsabilidades.
                        </p>
                    </div>

                    <Card className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                        <h3>1. Aceitação dos Termos</h3>
                        <p>
                            Ao criar uma conta, subscrever ou utilizar a Caravel ("o Serviço"), concordas legalmente com estes Termos de Serviço.
                            Se não concordares com algum ponto, deves cessar a utilização imediatamente.
                        </p>

                        <div className="my-8 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                            <div className="flex items-center gap-2 mb-3 text-yellow-800 dark:text-yellow-200 font-bold text-lg">
                                <AlertTriangle className="h-6 w-6" />
                                <span>Isenção de Responsabilidade Financeira (Disclaimer)</span>
                            </div>
                            <p className="text-sm text-yellow-900 dark:text-yellow-100 m-0">
                                A Caravel é estritamente uma ferramenta de software para registo, organização e visualização de dados inseridos pelo utilizador.
                                <strong>Nós não somos consultores financeiros, contabilistas ou gestores de investimento.</strong> Nenhuma informação na aplicação,
                                incluindo gráficos, métricas de "Crescimento Passivo" ou projeções, constitui aconselhamento financeiro.
                                Tu és o único responsável pelas tuas decisões de investimento e gestão de património.
                            </p>
                        </div>

                        <h3>2. Subscrições e Pagamentos (Lemon Squeezy)</h3>
                        <p>
                            O nosso processo de encomendas e faturação é conduzido pelo nosso revendedor online e Merchant of Record, <strong>Lemon Squeezy</strong>.
                            Todos os pagamentos e gestão de subscrições são processados de forma segura pela plataforma deles.
                        </p>
                        <ul>
                            <li><strong>Pagamentos:</strong> Ao subscreveres o plano Premium ("Capitão"), aceitas os Termos de Serviço da Lemon Squeezy.</li>
                            <li><strong>Impostos:</strong> A Lemon Squeezy encarrega-se da recolha e pagamento de impostos (IVA/VAT) aplicáveis à tua jurisdição.</li>
                            <li><strong>Cancelamento:</strong> Podes cancelar a tua subscrição a qualquer momento. Continuarás a ter acesso às funcionalidades pagas até ao final do ciclo de faturação atual.</li>
                            <li><strong>Reembolsos:</strong> Avaliamos pedidos de reembolso caso a caso, mas reservamo-nos o direito de recusar reembolsos para serviços digitais já prestados/acedidos, exceto quando exigido por lei.</li>
                        </ul>

                        <h3>3. Uso Aceitável</h3>
                        <p>
                            Comprometes-te a usar a Caravel apenas para fins legais e pessoais. É estritamente proibido:
                        </p>
                        <ul>
                            <li>Tentar aceder indevidamente a contas de outros utilizadores.</li>
                            <li>Usar automação (bots) para interagir com o serviço de forma abusiva.</li>
                            <li>Engenharia reversa ou cópia da propriedade intelectual da aplicação.</li>
                        </ul>

                        <h3>4. Disponibilidade e Dados</h3>
                        <p>
                            Esforçamo-nos para manter a Caravel disponível 24/7. No entanto, não garantimos que o serviço seja ininterrupto ou livre de erros.
                            Recomendamos que utilizes a funcionalidade de "Exportar Dados (JSON)" regularmente para manteres um backup pessoal da tua informação.
                        </p>

                        <h3>5. Alterações aos Termos</h3>
                        <p>
                            Podemos atualizar estes termos ocasionalmente para refletir mudanças no serviço ou requisitos legais.
                            O uso continuado da aplicação após alterações constitui aceitação dos novos termos.
                        </p>

                        <h3>6. Lei Aplicável</h3>
                        <p>
                            Estes termos são regidos pelas leis de Portugal e da União Europeia. Qualquer disputa será resolvida nos tribunais competentes de Lisboa, Portugal.
                        </p>

                        <hr />
                        <p className="text-xs text-neutral-500">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
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