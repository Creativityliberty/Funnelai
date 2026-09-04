import React from 'react';

export const ExportPanel = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-xs border border-border">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Export &amp; Intégration</h3>
      <p className="text-xs text-muted-foreground mb-4">Exportez instantanément vos pages de vente prêtes à l&apos;emploi.</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-xl border border-border">
          <span className="text-xs font-medium text-foreground">Next.js &amp; Tailwind v4</span>
          <span className="text-[10px] font-bold text-primary font-mono">OKLCH</span>
        </div>
        <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-xl border border-border">
          <span className="text-xs font-medium text-foreground">Fichier .HTML Autonome</span>
          <span className="text-[10px] font-bold text-muted-foreground font-mono">STANDALONE</span>
        </div>
        <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-xl border border-border">
          <span className="text-xs font-medium text-foreground">Archive Web Complète</span>
          <span className="text-[10px] font-bold text-muted-foreground font-mono">.ZIP</span>
        </div>
      </div>
    </div>
  );
};
