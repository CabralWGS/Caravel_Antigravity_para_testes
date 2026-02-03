import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '../supabaseClient.ts';
import { AuthContextType, SubscriptionStatus, Session, User, AuthError, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, AuthChangeEvent } from '../types.ts';
import { useUI } from './UIContext.tsx';
import { SUPABASE_TABLES } from '../constants.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useUI();
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [authEvent, setAuthEvent] = useState<AuthChangeEvent | null>(null);
    const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('free');

    // Função auxiliar para buscar o perfil e atualizar estado da subscrição
    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from(SUPABASE_TABLES.PROFILES)
                .select('subscription_status')
                .eq('id', userId)
                .maybeSingle();
            
            if (data && !error) {
                setSubscriptionStatus(data.subscription_status as SubscriptionStatus);
            }
        } catch (err) {
            console.warn("Erro ao carregar perfil:", err);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Verificar recuperação de password via URL hash
        if (window.location.hash.includes('type=recovery')) {
            setIsRecoveryMode(true);
        }

        // --- ARQUITETURA DE INICIALIZAÇÃO PARALELA ---
        // 1. Configurar o Listener IMEDIATAMENTE (antes de pedir a sessão)
        // Isto garante que apanhamos eventos disparados pelo cliente Supabase ao "acordar"
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (!mounted) return;

            setAuthEvent(event);
            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (event === 'PASSWORD_RECOVERY') {
                setIsRecoveryMode(true);
            }
            
            if (event === 'SIGNED_OUT') {
                setIsRecoveryMode(false);
                setSubscriptionStatus('free');
            }

            // Se temos utilizador, tentamos atualizar o perfil
            if (currentSession?.user) {
                // Não esperamos pelo profile para libertar a UI, fazemos em background
                fetchProfile(currentSession.user.id);
            }

            // O Listener tem autoridade para desbloquear a UI imediatamente
            setIsLoadingAuth(false);
        });

        // 2. Pedir a Sessão em PARALELO (sem await bloqueante)
        // Se o listener acima disparar primeiro (comum em refresh), ele trata de tudo.
        // Se este pedido responder primeiro (comum em cold start), ele trata de tudo.
        supabase.auth.getSession().then(async ({ data, error }) => {
            if (!mounted) return;
            
            if (error) {
                console.warn("Erro ao obter sessão inicial:", error);
                // Mesmo com erro, libertamos a UI para não bloquear infinitamente
                setIsLoadingAuth(false);
                return;
            }

            if (data?.session) {
                setSession(data.session);
                setUser(data.session.user);
                // Fetch profile se existir sessão
                await fetchProfile(data.session.user.id);
            }
            
            // Também tem autoridade para desbloquear
            setIsLoadingAuth(false);
        }).catch(err => {
            console.error("Exceção crítica na sessão:", err);
            if (mounted) setIsLoadingAuth(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signIn = useCallback(async (credentials: SignInWithPasswordCredentials) => {
        const { error } = await supabase.auth.signInWithPassword(credentials);
        return { error };
    }, []);

    const signUp = useCallback(async (credentials: SignUpWithPasswordCredentials) => {
        const { error } = await supabase.auth.signUp(credentials);
        return { error };
    }, []);

    const signOut = useCallback(async () => {
        // Optimistic UI update
        setUser(null);
        setSession(null);
        setSubscriptionStatus('free');
        
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (e) {
            console.error("Sign out error:", e);
            return { error: e as AuthError };
        }
    }, []);

    const resetPasswordForEmail = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        return { error };
    }, []);

    const confirmPasswordReset = useCallback(async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (!error) {
            setIsRecoveryMode(false);
        }
        return { error };
    }, []);

    const updateUserEmail = useCallback(async (newEmail: string, passwordForVerification: string) => {
        if (!user || !user.email) {
            const error = { name: 'AuthError', message: 'Utilizador não autenticado.' };
            return { error: error as AuthError };
        }
        const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: passwordForVerification });
        if (verifyError) {
            if (verifyError.message.includes("Invalid login credentials")) {
                verifyError.message = "Incorrect password provided.";
            }
            return { error: verifyError };
        }
        const { data, error: updateError } = await supabase.auth.updateUser({ email: newEmail });
        if (data.user) {
            setUser(data.user);
        }
        return { error: updateError };
    }, [user]);

    const updateUserPassword = useCallback(async (currentPassword: string, newPassword: string) => {
        if (!user || !user.email) {
            const error = { name: 'AuthError', message: 'Utilizador não autenticado.' };
            return { error: error as AuthError };
        }
        const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
        if (verifyError) {
            if (verifyError.message.includes("Invalid login credentials")) {
                verifyError.message = "Incorrect password provided.";
            }
            return { error: verifyError };
        }
        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
        return { error: updateError };
    }, [user]);

    const value: AuthContextType = useMemo(() => ({
        session,
        user,
        authEvent,
        isRecoveryMode,
        isLoadingAuth,
        subscriptionStatus,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
        confirmPasswordReset,
        updateUserEmail,
        updateUserPassword
    }), [session, user, authEvent, isRecoveryMode, isLoadingAuth, subscriptionStatus, signIn, signUp, signOut, resetPasswordForEmail, confirmPasswordReset, updateUserEmail, updateUserPassword]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};