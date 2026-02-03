
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const GOOGLE_ADS_ID = 'AW-17910529020';
const STORAGE_KEY = 'caravel-cookies-accepted';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // 1. Define a função gtag globalmente para estar disponível antes do script carregar
    // Isto garante que o Google saiba o estado do consentimento (default 'denied') imediatamente.
    const initGtag = () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        
        // 2. Define o padrão 'denied' para v2 (Fundamental para o EEE)
        // 'wait_for_update' dá uma janela de tempo para o 'update' ocorrer antes de enviar pings
        window.gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
        });
    };

    const loadGoogleAdsScript = () => {
        if (window.document.getElementById('google-ads-script')) return;

        const script = document.createElement('script');
        script.id = 'google-ads-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
        document.head.appendChild(script);

        // Configuração padrão do Google Ads
        window.gtag('js', new Date());
        window.gtag('config', GOOGLE_ADS_ID);
    };

    useEffect(() => {
        initGtag(); // Inicia sempre o gtag com 'denied' por segurança assim que o componente monta
        
        const hasConsent = localStorage.getItem(STORAGE_KEY);
        if (!hasConsent) {
            // Se não há consentimento guardado, mostra o banner
            setIsVisible(true);
        } else {
            // Se já tem consentimento, atualiza o estado para 'granted' e carrega o script
            handleAccept(true); 
        }
    }, []);

    const handleAccept = (isSilent = false) => {
        if (!isSilent) localStorage.setItem(STORAGE_KEY, 'true');

        // 3. O comando 'update' diz ao Google que o consentimento foi dado
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted'
            });
        }

        loadGoogleAdsScript();
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-800 animate-fade-in font-sans">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
                    
                    {/* Texto / Filosofia */}
                    <div className="text-center sm:text-left">
                        <p className="text-sm font-medium text-white font-sans tracking-tight">
                            Usamos cookies para melhorar a tua expedição. Aceitas o mapa?
                        </p>
                        <div className="mt-1">
                            <Link 
                                to="/privacy" 
                                className="text-xs text-neutral-500 hover:text-white transition-colors underline decoration-neutral-700 underline-offset-2"
                            >
                                Ler Política de Privacidade
                            </Link>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 text-neutral-500 hover:text-white transition-colors sm:hidden"
                            aria-label="Fechar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        
                        <button
                            onClick={() => handleAccept(false)}
                            className="bg-white text-black hover:bg-neutral-200 transition-colors font-bold text-sm px-6 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
                        >
                            Aceitar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
