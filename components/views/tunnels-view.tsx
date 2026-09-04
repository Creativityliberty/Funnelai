'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Rocket, 
  FileArchive, 
  LayoutDashboard, 
  ArrowRight, 
  Trash2 
} from 'lucide-react';
import { Project } from '@/types/project';

interface TunnelsViewProps {
  projects: Project[];
  startNewProject: () => void;
  loadProject: (project: Project) => void;
  deleteProject: (id: string) => void;
}

export const TunnelsView = ({
  projects,
  startNewProject,
  loadProject,
  deleteProject,
}: TunnelsViewProps) => {
  return (
    <motion.div 
      key="tunnels"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-xs border border-border space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Mes Tunnels</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Bibliothèque de vos funnels générés et fichiers associés.</p>
        </div>
        <button 
          onClick={startNewProject}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Rocket size={15} />
          NOUVEAU TUNNEL
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed border-border">
          <FileArchive size={40} className="mx-auto text-muted-foreground/60 mb-3" />
          <h3 className="text-sm font-bold text-foreground">Aucun tunnel enregistré</h3>
          <p className="text-xs text-muted-foreground mt-1">Lancez une génération pour sauvegarder votre premier tunnel ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col">
              {project.heroImage ? (
                <div className="h-36 overflow-hidden bg-muted relative">
                  <Image src={project.heroImage} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="h-36 bg-muted/40 flex items-center justify-center border-b border-border">
                  <LayoutDashboard size={36} className="text-muted-foreground/40" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-1">{project.name}</h3>
                <p className="text-[11px] text-muted-foreground mb-3">{new Date(project.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{project.request}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <button 
                    onClick={() => loadProject(project)}
                    className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    OUVRIR <ArrowRight size={13} />
                  </button>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
