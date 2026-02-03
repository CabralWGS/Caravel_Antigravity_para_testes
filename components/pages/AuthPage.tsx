
import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../ui/Card.tsx';
import { useAppContext } from '../../context/AppContext.tsx';
import { Loader2, ArrowLeft } from 'lucide-react';
import { PasswordInput } from '../ui/PasswordInput.tsx';
import { PasswordStrengthMeter } from '../ui/PasswordStrengthMeter.tsx';
import { handleAuthError } from '../../constants.ts';
import { Toast } from '../ui/Toast.tsx';
import { Logo } from '../ui/Logo.tsx';
import { CookieBanner } from '../ui/CookieBanner.tsx';

// Styling Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-5 py-2 text-sm';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';
const inputBase = 'block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-black';

type AuthView = 'login' | 'signup' | 'forgot' | 'update_password';

const AuthPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [view, setView] = useState<AuthView>(() => {
        const viewParam = searchParams.get('view');
        if (viewParam === 'signup') return 'signup';
        if (viewParam === 'update_password') return 'update_password';
        return 'login';
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signIn, signUp, resetPasswordForEmail, confirmPasswordReset, session, isRecoveryMode, showToast, toast, dismissToast } = useAppContext();
    const navigate = useNavigate();

    // Lógica de redirecionamento
    useEffect(() => {
        // Prioridade máxima: Se estiver em modo de recuperação, mostra sempre o ecrã de nova password
        if (isRecoveryMode) {
            if (view !== 'update_password') {
                setView('update_password');
            }
            return;
        }

        // Se não estiver em recuperação e tiver sessão, vai para a app
        if (session && !isRecoveryMode) {
            navigate('/app', { replace: true });
        }
    }, [session, isRecoveryMode, navigate, view]);

    // Atualizar a view se o parâmetro de URL mudar
    useEffect(() => {
        const viewParam = searchParams.get('view');
        if (viewParam === 'update_password' && view !== 'update_password') {
            setView('update_password');
        }
    }, [searchParams]);

    const handleAuthSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Limpar toasts antigos (ex: "Sessão terminada") para não confundir o utilizador
        dismissToast();

        const isSignUp = view === 'signup';

        if (isSignUp && password !== confirmPassword) {
            showToast('As passwords não coincidem.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const { error: authError } = isSignUp
                ? await signUp({ email, password })
                : await signIn({ email, password });

            if (authError) {
                showToast(handleAuthError(authError.message), 'error');
            } else if (isSignUp) {
                showToast('Conta criada! Por favor, verifica o teu email para ativar a conta.', 'success');
                setView('login');
                setPassword('');
                setConfirmPassword('');
            } else {
                navigate('/app');
            }
        } catch (err) {
            showToast('Ocorreu um erro inesperado.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordResetSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dismissToast();
        if (!email) {
            showToast('Por favor, insere o teu email.', 'error');
            return;
        }
        setIsLoading(true);
        const { error } = await resetPasswordForEmail(email);
        if (error) {
            showToast(handleAuthError(error.message), 'error');
        } else {
            showToast('Email de recuperação enviado. Verifica a tua caixa de entrada (e spam).', 'success');
            setView('login');
        }
        setIsLoading(false);
    };

    const handleUpdatePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dismissToast();
        if (password !== confirmPassword) {
            showToast('As passwords não coincidem.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const { error } = await confirmPasswordReset(password);
            if (error) {
                showToast(handleAuthError(error.message), 'error');
            } else {
                showToast('Password atualizada com sucesso!', 'success');
                navigate('/app');
            }
        } catch (err) {
            showToast('Erro ao atualizar a password.', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    const passwordMismatch = (view === 'signup' || view === 'update_password') && confirmPassword && password !== confirmPassword;

    const titles = {
        login: 'Bem-vindo de Volta',
        signup: 'Cria a Tua Conta',
        forgot: 'Recuperar Password',
        update_password: 'Nova Password'
    };
    
    const subtitles = {
        login: 'A tua expedição financeira recomeça aqui.',
        signup: 'Começa a tua jornada para a clareza financeira.',
        forgot: 'Insere o teu email para receberes um link de recuperação.',
        update_password: 'Define a tua nova password para continuares.'
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black p-4 flex-col">
            <CookieBanner />
            {!isRecoveryMode && (
                <Link
                    to="/"
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-offset-black rounded-md"
                    aria-label="Voltar à página inicial"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Voltar</span>
                </Link>
            )}
            <div className="w-full max-w-sm animate-fade-in-scale">
                <Card className="w-full">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block"><Logo variant="extended" className="h-32 mx-auto" /></Link>
                        <h2 className="text-2xl font-bold tracking-tight mt-4">{titles[view]}</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-2">{subtitles[view]}</p>
                    </div>
                    <div key={view} className="animate-fade-in-scale">
                        {view === 'forgot' ? (
                            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        onFocus={() => dismissToast()}
                                        required 
                                        placeholder="Email" 
                                        className={inputBase} 
                                        autoComplete="email" 
                                    />
                                </div>
                                 <button type="submit" disabled={isLoading} className={`${btnBase} ${btnSize} ${btnPrimary} w-full pt-2 mt-2`}>
                                    {isLoading ? (<><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />A Enviar...</>) : 'Enviar Email de Recuperação'}
                                </button>
                            </form>
                        ) : view === 'update_password' ? (
                             <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="sr-only">Nova Password</label>
                                    <PasswordInput 
                                        id="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        onFocus={() => dismissToast()}
                                        required 
                                        placeholder="Nova Password" 
                                        autoComplete="new-password" 
                                    />
                                    <PasswordStrengthMeter password={password} />
                                </div>
                                <div className="pt-2">
                                    <label htmlFor="confirmPassword" className="sr-only">Confirmar Password</label>
                                    <PasswordInput 
                                        id="confirmPassword" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        onFocus={() => dismissToast()}
                                        required 
                                        placeholder="Confirmar Password" 
                                        autoComplete="new-password" 
                                    />
                                    {passwordMismatch && <p className="text-sm text-red-600 dark:text-red-500 mt-1 px-1">As passwords não coincidem.</p>}
                                </div>
                                <button type="submit" disabled={isLoading || passwordMismatch} className={`${btnBase} ${btnSize} ${btnPrimary} w-full pt-2 mt-2`}>
                                    {isLoading ? (<><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />A processar...</>) : 'Definir Nova Password'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAuthSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        onFocus={() => dismissToast()}
                                        required 
                                        placeholder="Email" 
                                        className={inputBase} 
                                        autoComplete="email" 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <PasswordInput 
                                        id="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        onFocus={() => dismissToast()}
                                        required 
                                        placeholder="Password" 
                                        autoComplete={view === 'signup' ? "new-password" : "current-password"} 
                                    />
                                </div>
                                {view === 'signup' && (
                                    <>
                                        <PasswordStrengthMeter password={password} />
                                        <div className="pt-2">
                                            <label htmlFor="confirmPassword" className="sr-only">Confirmar Password</label>
                                            <PasswordInput 
                                                id="confirmPassword" 
                                                value={confirmPassword} 
                                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                                onFocus={() => dismissToast()}
                                                required 
                                                placeholder="Confirmar Password" 
                                                autoComplete="new-password" 
                                            />
                                            {passwordMismatch && <p className="text-sm text-red-600 dark:text-red-500 mt-1 px-1">As passwords não coincidem.</p>}
                                        </div>
                                    </>
                                )}
                                <button type="submit" disabled={isLoading || passwordMismatch} className={`${btnBase} ${btnSize} ${btnPrimary} w-full pt-2 mt-2`}>
                                    {isLoading ? (<><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />A processar...</>) : (view === 'signup' ? 'Criar Conta' : 'Entrar')}
                                </button>
                            </form>
                        )}
                    </div>
                    <div className="text-center mt-6 space-y-2">
                        {view === 'login' && (
                            <>
                                <button onClick={() => setView('signup')} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white">
                                    Ainda não tens conta? Cria uma agora.
                                </button>
                                <span className="mx-2 text-neutral-300 dark:text-neutral-700">·</span>
                                 <button onClick={() => setView('forgot')} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white">
                                    Esqueceu-se da password?
                                </button>
                            </>
                        )}
                         {view === 'signup' && (
                             <button onClick={() => setView('login')} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white">
                                Já tens conta? Entra aqui.
                            </button>
                         )}
                         {(view === 'forgot' || view === 'update_password') && !isRecoveryMode && (
                             <button onClick={() => setView('login')} className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white">
                                <ArrowLeft className="h-4 w-4" />
                                Voltar ao Login
                            </button>
                         )}
                    </div>
                </Card>
                <div className="mt-8 text-center px-4">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        Ao continuar, aceitas os nossos <Link to="/terms" className="underline hover:text-black dark:hover:text-white transition-colors">Termos de Serviço</Link> e a nossa <Link to="/privacy" className="underline hover:text-black dark:hover:text-white transition-colors">Política de Privacidade</Link>.
                    </p>
                </div>
            </div>
            {toast && <Toast toast={toast} onDismiss={() => dismissToast()} />}
        </div>
    );
};

export default AuthPage;
