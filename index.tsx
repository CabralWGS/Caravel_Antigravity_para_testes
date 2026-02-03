// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';
// Importamos o AppProvider antigo apenas se houver dependências residuais, mas tecnicamente ele agora é vazio.
// No entanto, a lógica de renderização depende da árvore de Providers correta.
import DashboardPage from './components/pages/DashboardPage.tsx';
import TransactionsPage from './components/pages/TransactionsPage.tsx';
import PatrimonioPage from './components/pages/PatrimonioPage.tsx';
import SettingsPage from './components/pages/SettingsPage.tsx';
import AuthPage from './components/pages/AuthPage.tsx';
import ProtectedLayout from './components/auth/ProtectedLayout.tsx';
import LandingPage from './components/pages/LandingPage.tsx';
import PrivacyPage from './components/pages/legal/PrivacyPage.tsx';
import TermsPage from './components/pages/legal/TermsPage.tsx';
import BlogPage from './components/pages/BlogPage.tsx';
import BlogPostPage from './components/pages/BlogPostPage.tsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/app',
    element: <ProtectedLayout />,
    children: [
      {
        element: <App />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: 'patrimonio', element: <PatrimonioPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/blog/:slug',
    element: <BlogPostPage />,
  },
  {
    path: '*',
    element: <AuthPage />,
  }
]);

type RootElement = HTMLElement & { _reactRoot?: ReactDOM.Root };
const rootElement = document.getElementById('root') as RootElement;

if (!rootElement._reactRoot) {
  rootElement._reactRoot = ReactDOM.createRoot(rootElement);
}

rootElement._reactRoot.render(
  <React.StrictMode>
    <UIProvider>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </AuthProvider>
    </UIProvider>
  </React.StrictMode>
);