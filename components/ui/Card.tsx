import React from 'react';

// FIX: Update CardProps to extend React.HTMLAttributes<HTMLDivElement> to allow passing down extra props like event handlers.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// FIX: Accept and spread additional props (...) to the underlying div element.
export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
