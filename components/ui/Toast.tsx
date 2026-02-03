

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ToastData } from '../../types.ts';

interface ToastProps {
  toast: ToastData;
  onDismiss: () => void;
}

const icons = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
};

const bgColors = {
  success: 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black',
  error: 'bg-black text-white dark:bg-white dark:text-black',
  warning: 'bg-neutral-600 text-white dark:bg-neutral-400 dark:text-black',
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, onDismiss]);

  return (
    <div
      className={`fixed bottom-28 sm:bottom-5 right-5 flex items-center gap-3 p-4 rounded-lg shadow-lg font-semibold text-sm animate-slide-in-right ${bgColors[toast.type]}`}
    >
      {icons[toast.type]}
      <span>{toast.message}</span>
    </div>
  );
};