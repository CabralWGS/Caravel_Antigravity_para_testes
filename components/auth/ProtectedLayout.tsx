import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.tsx';

const ProtectedLayout: React.FC = () => {
    const { user, isLoadingAuth, isRecoveryMode } = useAppContext();

    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black gap-4">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-black dark:border-white" role="status">
                    <span className="sr-only">A verificar autenticação...</span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse">A restaurar sessão...</p>
            </div>
        );
    }

    // Se estiver em modo de recuperação, forçar redirecionamento para o ecrã de Nova Password
    // mesmo que exista uma sessão válida (pois o link de recuperação cria uma sessão temporária)
    if (isRecoveryMode) {
        return <Navigate to="/login?view=update_password" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedLayout;