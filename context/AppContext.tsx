import React, { FC, ReactNode } from 'react';
import { AppContextType } from '../types.ts';
import { useUI } from './UIContext.tsx';
import { useAuth } from './AuthContext.tsx';
import { useData } from './DataContext.tsx';

// O AppProvider original é agora apenas um componente de passagem para manter a árvore limpa
// se for usado no futuro, mas a lógica real está nos contextos específicos.
export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

// Este Hook agora AGREGA os contextos menores.
// Isto permite que o código existente ("const { ... } = useAppContext()") continue a funcionar
// sem alterações, mas por trás estamos a usar a arquitetura dividida.
// Para otimizar componentes individuais, deves importar useUI, useAuth ou useData diretamente.
export const useAppContext = (): AppContextType => {
    const ui = useUI();
    const auth = useAuth();
    const data = useData();

    return {
        ...ui,
        ...auth,
        ...data,
    };
};
