import React from 'react';
import { Modal } from './Modal.tsx';

type ActionIntent = 'primary' | 'secondary' | 'danger';
type Action = {
  text: string;
  onClick: () => void;
  intent: ActionIntent;
  type?: 'button' | 'submit';
  form?: string;
  disabled?: boolean;
};

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions: Action[];
  className?: string;
  contentClassName?: string;
}

// Stying Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-5 py-2 text-sm';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';
const btnSecondary = 'bg-transparent text-black dark:text-white border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-black dark:focus-visible:ring-white';
const btnDanger = 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500';

const intentClasses: Record<ActionIntent, string> = {
  primary: `${btnBase} ${btnSize} ${btnPrimary}`,
  secondary: `${btnBase} ${btnSize} ${btnSecondary}`,
  danger: `${btnBase} ${btnSize} ${btnDanger}`,
};

export const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, title, children, actions, className = 'max-w-md', contentClassName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <div className="p-6">
        <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
        <div className={`mt-4 text-neutral-600 dark:text-neutral-300 overflow-y-auto pr-2 ${contentClassName || 'max-h-[60vh] sm:max-h-[70vh]'}`}>
            {children}
        </div>
        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
          {actions.map((action) => (
            <button
              key={action.text}
              type={action.type || 'button'}
              form={action.form}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`w-full sm:w-auto ${intentClasses[action.intent]}`}
              aria-label={action.text}
            >
              {action.text}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};