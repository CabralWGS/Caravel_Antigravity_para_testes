import React from 'react';
import { Modal } from './Modal.tsx';
import { Compass, BookText, Settings, PartyPopper, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.tsx';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

// Styling Constants
const btnBase = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-black';
const btnSize = 'px-5 py-2 text-sm';
const btnPrimary = 'bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus-visible:ring-black dark:focus-visible:ring-white';
const btnSecondary = 'bg-transparent text-black dark:text-white border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-black dark:focus-visible:ring-white';

const currencies = [
  { symbol: '€', code: 'EUR', label: 'Euro' },
  { symbol: '$', code: 'USD', label: 'Dólar' },
  { symbol: '£', code: 'GBP', label: 'Libra' },
  { symbol: 'R$', code: 'BRL', label: 'Real' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { updateConfig, config } = useAppContext();
  const [step, setStep] = React.useState(0);
  const [selectedCurrency, setSelectedCurrency] = React.useState(config.simbolo_moeda);

  const handleCurrencySelect = async (symbol: string) => {
      setSelectedCurrency(symbol);
      await updateConfig({ simbolo_moeda: symbol });
  };

  const STEPS = [
    {
      icon: Compass,
      title: 'Bem-vindo à Caravel!',
      content: (
          <div className="space-y-4">
              <p>A tua expedição financeira começa agora. Antes de partirmos, qual a moeda principal da tua expedição?</p>
              <div className="grid grid-cols-2 gap-3">
                  {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleCurrencySelect(c.symbol)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                            selectedCurrency === c.symbol
                                ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-800'
                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600'
                        }`}
                      >
                          <span className="flex items-center gap-2">
                              <span className="font-mono text-lg">{c.symbol}</span>
                              <span>{c.code}</span>
                          </span>
                          {selectedCurrency === c.symbol && <Check className="h-4 w-4" />}
                      </button>
                  ))}
              </div>
          </div>
      ),
    },
    {
      icon: BookText,
      title: 'O Mapa e o Diário de Bordo',
      content: (
          <div className="space-y-4">
              <p>A Caravel funciona com dois registos mensais simples:</p>
              <div className="text-left p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
                  <h4 className="font-bold">1. Património (O Mapa)</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Uma vez por mês (dia 1), marca a tua posição. Regista o valor total que tens em cada conta.</p>
              </div>
              <div className="text-left p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
                  <h4 className="font-bold">2. Transações (O Diário)</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Regista os totais mensais dos teus rendimentos e despesas. Não precisas de cada café, apenas o resumo!</p>
              </div>
          </div>
      ),
    },
    {
      icon: Settings,
      title: 'Personaliza os Teus Instrumentos',
      content: 'Demos-te algumas contas e categorias por defeito. Podes alterá-las, arquivá-las ou adicionar novas a qualquer momento nas Definições para refletir a tua realidade.',
    },
    {
      icon: PartyPopper,
      title: 'Tudo a Postos, Capitão!',
      content: 'Estás pronto para assumir o leme. Lembra-te: a consistência é a chave para o sucesso. Boa navegação!',
    },
  ];

  const CurrentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const handleClose = () => {}; // Prevent closing via backdrop

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="p-6 text-center">
        <div key={step} className="animate-fade-in-scale">
            <div className="flex justify-center items-center mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-400 mb-6">
                <CurrentStep.icon className="h-8 w-8" />
            </div>
            <h2 id="modal-title" className="text-xl font-bold mb-3">{CurrentStep.title}</h2>
            <div className="text-neutral-600 dark:text-neutral-300">
                {typeof CurrentStep.content === 'string' ? <p>{CurrentStep.content}</p> : CurrentStep.content}
            </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
            {/* Progress Dots */}
            <div className="flex gap-2">
                {STEPS.map((_, index) => (
                <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                    index === step ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                />
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} className={`${btnBase} ${btnSize} ${btnSecondary}`}>
                        Anterior
                    </button>
                )}
                <button
                    onClick={isLastStep ? onComplete : () => setStep(s => s + 1)}
                    className={`${btnBase} ${btnSize} ${btnPrimary}`}
                >
                    {isLastStep ? 'Vamos a Isso!' : (step === 0 ? 'Continuar' : 'Seguinte')}
                </button>
            </div>
        </div>
      </div>
    </Modal>
  );
};