
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../../ui/Logo.tsx';
import { Card } from '../../ui/Card.tsx';

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
                        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Política de Privacidade</h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            Os teus dados são teus. Transparência total sobre quem os processa.
                        </p>
                    </div>

                    <Card className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                        <h3>1. O Princípio Fundamental</h3>
                        <p>
                            A Caravel foi desenhada com privacidade "by default". <strong>Não vendemos os teus dados</strong> a terceiros,
                            não criamos perfis de publicidade e não acedemos às tuas credenciais bancárias.
                        </p>

                        <h3>2. Que dados recolhemos e porquê?</h3>
                        <ul>
                            <li><strong>Identidade:</strong> O teu email é usado exclusivamente para autenticação e comunicações críticas do serviço (recuperação de password, alterações de termos).</li>
                            <li><strong>Dados Financeiros:</strong> As transações, contas e valores de património que inseres manualmente. Estes dados são encriptados na base de dados e usados apenas para gerar o teu dashboard.</li>
                            <li><strong>Dados Técnicos:</strong> Logs básicos de acesso (IP, navegador) para segurança e prevenção de ataques.</li>
                        </ul>

                        <h3>3. Processadores de Dados (Sub-processors)</h3>
                        <p>Para fornecer o serviço, utilizamos parceiros de confiança que operam sob normas estritas de segurança (RGPD/GDPR):</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
                            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                <h4 className="font-bold text-black dark:text-white mb-1">Supabase</h4>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">Infraestrutura de Base de Dados e Autenticação. Os teus dados financeiros residem aqui, protegidos por segurança de nível empresarial.</p>
                            </div>
                            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                <h4 className="font-bold text-black dark:text-white mb-1">Lemon Squeezy</h4>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">Processamento de Pagamentos e Merchant of Record. Eles gerem os teus dados de cartão de crédito e faturação. A Caravel nunca vê o teu cartão.</p>
                            </div>
                            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                <h4 className="font-bold text-black dark:text-white mb-1">Google Ads</h4>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    Ferramenta de marketing. Usamos para medir a eficácia das nossas campanhas e atrair novos navegadores.
                                </p>
                            </div>
                        </div>

                        <h3>4. Controlo Total e Direito ao Esquecimento</h3>
                        <p>
                            Respeitamos integralmente os teus direitos sobre os teus dados. Dentro da aplicação (Definições {'>'} Conta), disponibilizamos ferramentas automáticas para:
                        </p>
                        <ul>
                            <li><strong>Exportar:</strong> Download instantâneo de todos os teus registos em formato JSON (Portabilidade).</li>
                            <li><strong>Apagar:</strong> Eliminação permanente e irreversível de toda a tua conta e dados associados.</li>
                        </ul>

                        <h3>5. Cookies e Marketing</h3>
                        <p>
                            Além dos cookies essenciais de sessão, utilizamos o <strong>Google Ads</strong> para fins estatísticos e de promoção. Estes cookies só são ativados após o teu consentimento explícito no nosso banner de entrada.
                        </p>

                        <h3>6. Contacto</h3>
                        <p>
                            Para questões relacionadas com privacidade, envia um email para <strong>captain@thecaravelapp.com</strong>.
                        </p>

                        <h3>7. Base Legal do Processamento</h3>
                        <p>O processamento dos teus dados baseia-se no teu consentimento (cookies/marketing) e na execução do serviço (dados financeiros).</p>

                        <h3>8. Retenção de Dados</h3>
                        <p>Os teus dados financeiros são mantidos apenas enquanto a tua conta estiver ativa. Se apagares a conta, os dados são eliminados dos nossos servidores ativos imediatamente.</p>

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

export default PrivacyPage;
