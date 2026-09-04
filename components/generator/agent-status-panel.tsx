'use client';

import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { AGENTS_LIST } from '@/lib/agents-config';
import { GeneratorStep } from '@/types/project';

interface AgentStatusPanelProps {
  step: GeneratorStep;
  loading: boolean;
  getAgentStatus: (id: string) => 'Prêt' | 'En cours' | 'Terminé';
}

export const AgentStatusPanel = ({
  step,
  loading,
  getAgentStatus,
}: AgentStatusPanelProps) => {
  return (
    <div className="bg-card rounded-2xl p-5 md:p-6 shadow-xs border border-border text-foreground relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-border/60 pb-3">
        <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-foreground">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Statut de l&apos;Essaim IA (13 Agents)
        </h3>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
          {step === 'result' ? '13/13 Prêts' : (loading ? 'En cours' : '13 Prêts')}
        </span>
      </div>
      <div className="space-y-2 relative z-10 max-h-[580px] overflow-y-auto pr-1">
        {AGENTS_LIST.map((agent) => {
          const status = getAgentStatus(agent.id);
          const IconComponent = agent.icon;
          const isRunning = status === 'En cours';
          const isDone = status === 'Terminé';

          return (
            <div 
              key={agent.id} 
              className={`flex items-center justify-between p-2 rounded-xl transition-all border ${
                isRunning 
                  ? 'bg-primary/10 border-primary/40 shadow-xs' 
                  : isDone 
                  ? 'bg-muted/20 border-border/40' 
                  : 'bg-transparent border-transparent hover:border-border/30'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Avatar Icon */}
                <div className="relative shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${agent.badgeColor} ${
                    isRunning ? 'scale-105 shadow-sm ring-2 ring-primary/40' : ''
                  }`}>
                    <IconComponent size={15} />
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-card ${
                    isDone ? 'bg-emerald-500' : isRunning ? 'bg-primary animate-ping' : 'bg-muted-foreground/30'
                  }`} />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {agent.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {agent.role}
                  </div>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  isDone 
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                    : isRunning 
                    ? 'bg-primary/20 text-primary border border-primary/40 animate-pulse' 
                    : 'bg-muted/60 text-muted-foreground border border-border/40'
                }`}>
                  {isDone && <Check size={10} className="stroke-[3]" />}
                  {isRunning && <Loader2 size={10} className="animate-spin" />}
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
