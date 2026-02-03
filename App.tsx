
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Settings, ArrowLeftRight, Landmark } from 'lucide-react';
import { Toast } from './components/ui/Toast.tsx';
import { useAppContext } from './context/AppContext.tsx';
import { Logo } from './components/ui/Logo.tsx';
import { CookieBanner } from './components/ui/CookieBanner.tsx';

const CaravelIcon = (props: { className?: string }) => <Logo variant="icon" {...props} />;

const AppTabs: React.FC = () => {
  const tabs: { path: string; label: string; icon: React.ElementType }[] = [
    { path: '/app', label: 'Dashboard', icon: CaravelIcon },
    { path: '/app/transactions', label: 'Transações', icon: ArrowLeftRight },
    { path: '/app/patrimonio', label: 'Património', icon: Landmark },
    { path: '/app/settings', label: 'Definições', icon: Settings },
  ];

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-initial py-3 sm:py-4 transition-all duration-200 outline-none select-none touch-manipulation ${isActive
      ? 'text-black dark:text-white sm:border-b-2 sm:border-black sm:dark:border-white'
      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 sm:border-b-2 sm:border-transparent'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:static bg-white/85 dark:bg-black/85 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 sm:bg-transparent sm:dark:bg-transparent sm:backdrop-blur-none sm:border-b sm:border-t-0 pb-[env(safe-area-inset-bottom)] sm:pb-0">
      <div className="flex sm:space-x-8 px-2 sm:px-0 justify-around sm:justify-start h-[calc(3.5rem+env(safe-area-inset-bottom))] sm:h-auto items-center sm:items-stretch">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/app'}
            className={getLinkClassName}
          >
            <tab.icon className={`h-6 w-6 sm:h-4 sm:w-4 mb-1 sm:mb-0 transition-transform duration-200`} />
            <span className="text-[10px] sm:text-sm font-medium tracking-wide">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

const App: React.FC = () => {
  const { toast, dismissToast, isLoading, session } = useAppContext();
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-50 transition-colors duration-300 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {!session && <CookieBanner />}

      {/* Main Container with refined spacing */}
      <div className="container mx-auto w-full px-6 sm:px-8 lg:px-12 pb-32 pt-8 sm:py-16 bg-white dark:bg-neutral-950 rounded-lg shadow-lg">

        <AppTabs />

        <main className="mt-6 sm:mt-10">
          {isLoading ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 rounded-full"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-black dark:border-white rounded-full animate-spin border-t-transparent dark:border-t-transparent"></div>
              </div>
              <p className="text-sm font-medium text-neutral-500 animate-pulse">A carregar...</p>
            </div>
          ) : (
            <div key={location.pathname} className="animate-fade-in">
              <Outlet />
            </div>
          )}
        </main>
      </div>
      {toast && <Toast toast={toast} onDismiss={() => dismissToast()} />}
    </div>
  );
};

export default App;
