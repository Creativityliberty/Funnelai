'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  PanelLeftClose, 
  PanelLeftOpen, 
  LayoutDashboard, 
  Rocket, 
  FileText, 
  Settings, 
  Cpu, 
  Users 
} from 'lucide-react';
import { AppView } from '@/types/project';
import { GrainOverlay } from '@/components/ui/overlays';
import { MiniChart } from '@/components/ui/mini-chart';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const Sidebar = ({
  isSidebarCollapsed,
  toggleSidebar,
  currentView,
  setCurrentView,
}: SidebarProps) => {
  return (
    <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-68'} transition-all duration-300 ease-in-out bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl z-20 rounded-2xl my-3 ml-3 overflow-hidden relative border border-sidebar-border shrink-0`}>
      <GrainOverlay />
      <div className={`p-4 flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'} border-b border-sidebar-border relative z-10`}>
        {!isSidebarCollapsed ? (
          <div className="text-left">
            <h2 className="font-extrabold tracking-widest text-base text-sidebar-foreground">FUNNEL AI</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-[0.25em] font-medium">Luxe Studio</p>
          </div>
        ) : (
          <div 
            onClick={toggleSidebar}
            className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_10px_var(--color-primary)] cursor-pointer hover:bg-primary/25 transition-all group"
            title="FUNNEL AI — Luxe Studio (Déplier)"
          >
            <Sparkles size={18} className="text-primary group-hover:scale-110 transition-transform" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg border border-border/60 hover:bg-sidebar-accent/80 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors shadow-2xs"
          title={isSidebarCollapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-5 relative z-10 px-2.5">
        <ul className="space-y-1.5">
          <li className="relative">
            <button 
              onClick={() => setCurrentView('dashboard')} 
              title={isSidebarCollapsed ? "Dashboard" : undefined}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3.5 px-4 py-3'} rounded-xl transition-all duration-200 font-semibold text-xs tracking-wider uppercase ${
                currentView === 'dashboard' 
                  ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border shadow-xs' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <LayoutDashboard size={18} className={currentView === 'dashboard' ? 'text-primary drop-shadow-[0_0_6px_var(--color-primary)]' : 'opacity-70'} />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>
          </li>
          <li className="relative">
            <button 
              onClick={() => setCurrentView('generator')} 
              title={isSidebarCollapsed ? "Générateur" : undefined}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3.5 px-4 py-3'} rounded-xl transition-all duration-200 font-semibold text-xs tracking-wider uppercase ${
                currentView === 'generator' 
                  ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border shadow-xs' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Rocket size={18} className={currentView === 'generator' ? 'text-primary drop-shadow-[0_0_6px_var(--color-primary)]' : 'opacity-70'} />
              {!isSidebarCollapsed && <span>Générateur</span>}
            </button>
          </li>
          <li className="relative">
            <button 
              onClick={() => setCurrentView('tunnels')} 
              title={isSidebarCollapsed ? "Mes Tunnels" : undefined}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3.5 px-4 py-3'} rounded-xl transition-all duration-200 font-semibold text-xs tracking-wider uppercase ${
                currentView === 'tunnels' 
                  ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border shadow-xs' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <FileText size={18} className={currentView === 'tunnels' ? 'text-primary drop-shadow-[0_0_6px_var(--color-primary)]' : 'opacity-70'} />
              {!isSidebarCollapsed && <span>Mes Tunnels</span>}
            </button>
          </li>
          <li className="relative">
            <button 
              onClick={() => setCurrentView('settings')} 
              title={isSidebarCollapsed ? "Paramètres" : undefined}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3.5 px-4 py-3'} rounded-xl transition-all duration-200 font-semibold text-xs tracking-wider uppercase ${
                currentView === 'settings' 
                  ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border shadow-xs' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Settings size={18} className={currentView === 'settings' ? 'text-primary drop-shadow-[0_0_6px_var(--color-primary)]' : 'opacity-70'} />
              {!isSidebarCollapsed && <span>Paramètres</span>}
            </button>
          </li>
          <li className="relative">
            <button 
              onClick={() => setCurrentView('integrations')} 
              title={isSidebarCollapsed ? "API & MCP" : undefined}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3.5 px-4 py-3'} rounded-xl transition-all duration-200 font-semibold text-xs tracking-wider uppercase ${
                currentView === 'integrations' 
                  ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border shadow-xs' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Cpu size={18} className={currentView === 'integrations' ? 'text-primary drop-shadow-[0_0_6px_var(--color-primary)]' : 'opacity-70'} />
              {!isSidebarCollapsed && <span>API &amp; MCP</span>}
            </button>
          </li>
        </ul>
      </nav>
      
      {isSidebarCollapsed ? (
        <div className="p-3 border-t border-sidebar-border flex flex-col items-center justify-center relative z-10" title="13 Agents IA Synchronisés">
          <div className="relative">
            <Users size={18} className="text-primary drop-shadow-[0_0_5px_var(--color-primary)]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-sidebar-border bg-sidebar/95 backdrop-blur-sm relative z-10 space-y-3">
           <div className="flex items-center justify-between text-sidebar-foreground/80">
             <div className="flex items-center gap-2">
               <div className="relative">
                 <Users size={16} className="text-primary drop-shadow-[0_0_5px_var(--color-primary)]" />
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
               </div>
               <span className="font-bold text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Agents Actifs</span>
             </div>
             <div className="flex items-center">
               <MiniChart />
             </div>
           </div>
           
           <div className="w-full h-[2px] bg-background/50 rounded-full overflow-hidden relative border border-border/20">
             <motion.div 
               animate={{ 
                 left: ["-40%", "120%", "-40%"],
               }}
               transition={{ 
                 duration: 2.5, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_var(--color-primary)]"
             />
           </div>

           <div className="flex items-center justify-between text-[11px] font-mono">
             <span className="text-muted-foreground">Actifs:</span>
             <span className="text-primary font-bold">13/13 Online</span>
           </div>

            <div className="bg-card/70 rounded-xl p-2.5 font-mono text-[9px] border border-border/60 shadow-inner">
              <div className="space-y-1">
                <div className="flex gap-2 items-center">
                  <span className="text-primary font-bold">SYS</span>
                  <span className="text-muted-foreground">13 Agents IA Synchronisés</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-accent font-bold">UI</span>
                  <span className="text-muted-foreground">Design System Luxe Haute Précision</span>
                </div>
              </div>
            </div>
        </div>
      )}
    </aside>
  );
};
