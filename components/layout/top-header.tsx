'use client';

import React from 'react';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  Sparkles, 
  Sun, 
  Moon, 
  Rocket 
} from 'lucide-react';
import { GlitchButton } from '@/components/ui/glitch-button';

interface TopHeaderProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  startNewProject: () => void;
}

export const TopHeader = ({
  isSidebarCollapsed,
  toggleSidebar,
  isDarkMode,
  toggleTheme,
  startNewProject,
}: TopHeaderProps) => {
  return (
    <div className="bg-card/70 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl border border-border bg-muted/60 hover:bg-muted text-foreground transition-colors flex items-center justify-center shadow-2xs"
          title={isSidebarCollapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={16} className="text-primary" /> : <PanelLeftClose size={16} className="text-foreground/70" />}
        </button>

        <div className="flex items-center gap-2.5 bg-muted/60 px-4 py-2 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase border border-border text-foreground">
          <div className="relative">
             <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"></div>
             <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary/60 animate-ping"></div>
           </div>
          Système Prêt
        </div>
        <div className="h-6 w-px bg-border hidden md:block"></div>
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Sparkles size={14} className="text-primary" />
          Moteur IA Haute Conversion v4.5 &amp; API Headless
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button (Light/Dark mode) */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-border bg-muted/60 hover:bg-muted text-foreground transition-colors flex items-center justify-center shadow-2xs"
          title={isDarkMode ? "Passer en mode clair (White mode)" : "Passer en mode sombre (Dark mode)"}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={17} className="text-primary" /> : <Moon size={17} className="text-primary" />}
        </button>

        <GlitchButton 
          onClick={startNewProject}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Rocket size={15} />
          NOUVEAU PROJET
        </GlitchButton>
      </div>
    </div>
  );
};
