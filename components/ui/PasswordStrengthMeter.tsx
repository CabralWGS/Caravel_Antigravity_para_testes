import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
}

type Strength = {
  score: number;
  level: 'Inexistente' | 'Fraca' | 'Média' | 'Forte';
  color: string;
};

const checkPasswordStrength = (password: string): { strength: Strength; checks: Record<string, boolean> } => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  if (checks.length) score++;
  if (checks.uppercase) score++;
  if (checks.lowercase) score++;
  if (checks.number) score++;
  if (checks.special) score++;

  let level: Strength['level'] = 'Inexistente';
  let color = 'bg-neutral-300 dark:bg-neutral-700';

  if (password.length > 0) {
      if (score <= 2) {
          level = 'Fraca';
          color = 'bg-red-500';
      } else if (score <= 4) {
          level = 'Média';
          color = 'bg-yellow-500';
      } else {
          level = 'Forte';
          color = 'bg-green-500';
      }
  }


  return { strength: { score, level, color }, checks };
};

const Requirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <li className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-green-600 dark:text-green-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
    {met ? <Check className="h-3.5 w-3.5 flex-shrink-0" /> : <X className="h-3.5 w-3.5 flex-shrink-0" />}
    <span>{text}</span>
  </li>
);

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const { strength, checks } = checkPasswordStrength(password);

  if (password.length === 0) {
      return null;
  }

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center gap-2">
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium w-16 text-right">{strength.level}</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pl-1">
        <Requirement met={checks.length} text="Pelo menos 8 caracteres" />
        <Requirement met={checks.uppercase} text="Uma letra maiúscula" />
        <Requirement met={checks.lowercase} text="Uma letra minúscula" />
        <Requirement met={checks.number} text="Um número" />
        <Requirement met={checks.special} text="Um carácter especial" />
      </ul>
    </div>
  );
};
