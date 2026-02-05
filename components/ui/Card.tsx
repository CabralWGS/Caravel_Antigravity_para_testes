import React from 'react';

// FIX: Update CardProps to extend React.HTMLAttributes<HTMLDivElement> to allow passing down extra props like event handlers.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// FIX: Accept and spread additional props (...) to the underlying div element.
export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        p-4 sm:p-6
        bg-white dark:bg-surface
        border border-neutral-100 dark:border-neutral-800/50
        rounded-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        hover:-translate-y-0.5
        transition-all duration-300 ease-out
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
