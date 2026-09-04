'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  FileText, 
  Users, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { Project, AppView } from '@/types/project';
import { MiniChart } from '@/components/ui/mini-chart';

interface DashboardViewProps {
  projects: Project[];
  setCurrentView: (view: AppView) => void;
  loadProject: (project: Project) => void;
}

export const DashboardView = ({
  projects,
  setCurrentView,
  loadProject,
}: DashboardViewProps) => {
  return (
    <motion.div 
      key="dashboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tableau de Bord</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Vue d&apos;ensemble de votre suite de tunnels de vente.</p>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-xs border border-border">
          <CreditCard size={16} className="text-primary" />
          <span className="text-xs font-bold text-foreground">PLAN LUXE PRO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tunnels Générés', value: projects.length, icon: FileText, color: 'text-primary' },
          { label: 'Agents IA Actifs', value: '13', icon: Users, color: 'text-accent' },
          { label: 'Images Créées', value: projects.filter(p => p.heroImage).length, icon: ImageIcon, color: 'text-chart-2' },
          { label: 'Temps Économisé', value: `${projects.length * 4}h`, icon: Sparkles, color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-5 rounded-2xl shadow-xs border border-border flex flex-col gap-3 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center ${stat.color} group-hover:scale-105 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="h-8 w-full flex items-end justify-center pt-2 border-t border-border/50">
              <MiniChart width={160} height={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl shadow-xs border border-border">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-foreground">Projets Récents</h3>
            <button onClick={() => setCurrentView('tunnels')} className="text-primary text-xs font-bold hover:underline">Voir tout</button>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
              <p className="text-muted-foreground text-sm">Aucun projet généré pour l&apos;instant.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3.5 bg-muted/20 hover:bg-muted/50 rounded-xl transition-all border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-primary border border-border">
                      {project.heroImage ? <Image src={project.heroImage} alt="" width={40} height={40} className="rounded-lg object-cover" /> : <FileText size={18} />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{project.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{new Date(project.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => loadProject(project)} className="p-2 hover:bg-card rounded-lg text-primary transition-colors border border-transparent hover:border-border">
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-xs border border-border text-foreground relative overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              Plan Actuel
            </h3>
            <div className="mb-5 p-4 rounded-xl bg-muted/40 border border-border">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Abonnement</p>
              <p className="text-2xl font-black text-primary mt-1">STUDIO LUXE PRO</p>
            </div>
            <ul className="space-y-2.5 mb-6">
              {['Générations illimitées', 'Images IA Haute Définition', 'Export ZIP & Multi-Framework', 'Support Commercial Dédié'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check size={14} className="text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl font-bold text-xs tracking-wider transition-colors border border-border">
            GÉRER L&apos;ABONNEMENT
          </button>
        </div>
      </div>
    </motion.div>
  );
};
