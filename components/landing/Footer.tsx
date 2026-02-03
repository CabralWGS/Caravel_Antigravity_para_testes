
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 py-10 transition-colors duration-300">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Copyright (Esquerda em Desktop / Topo em Mobile) */}
                    <div className="text-center md:text-left order-2 md:order-1">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            &copy; {currentYear} Caravel. Todos os direitos reservados.
                        </p>
                    </div>

                    {/* Links & Suporte (Direita em Desktop / Baixo em Mobile) */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 order-1 md:order-2">
                        <nav className="flex gap-6">
                            <Link
                                to="/blog"
                                className="text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                Blog
                            </Link>
                            <Link
                                to="/terms"
                                className="text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                Termos de Serviço
                            </Link>
                            <Link
                                to="/privacy"
                                className="text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                Política de Privacidade
                            </Link>
                        </nav>

                        {/* Divisor visual apenas em desktop/tablet */}
                        <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">|</span>

                        <a
                            href="mailto:captain@thecaravelapp.com"
                            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors group"
                        >
                            <Mail className="h-4 w-4 group-hover:stroke-black dark:group-hover:stroke-white" />
                            <span>Suporte</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
