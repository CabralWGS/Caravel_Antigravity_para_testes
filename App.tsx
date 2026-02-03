
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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {!session && <CookieBanner />}
      <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 pb-28 sm:pb-8">

        <AppTabs />

        <main className="mt-4 sm:mt-8">
          {isLoading ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-black dark:border-white" role="status">
                <span className="sr-only">A carregar...</span>
              </div>
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
