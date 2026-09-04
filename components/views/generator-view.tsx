'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ImageIcon, 
  Maximize2, 
  FileJson, 
  Activity, 
  Loader2 
} from 'lucide-react';
import { Template, TEMPLATES } from '@/lib/templates';
import { GeneratorStep, Project } from '@/types/project';
import { GlitchButton } from '@/components/ui/glitch-button';
import { AgentStatusPanel } from '@/components/generator/agent-status-panel';
import { ExportPanel } from '@/components/generator/export-panel';

interface GeneratorViewProps {
  step: GeneratorStep;
  setStep: (step: GeneratorStep) => void;
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template | null) => void;
  brandingOverrides: any;
  setBrandingOverrides: (overrides: any) => void;
  request: string;
  setRequest: (req: string) => void;
  loading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  parsedIntent: any;
  setParsedIntent: (intent: any) => void;
  handleConfirmIntent: () => void;
  result: any;
  activeAgentName: string | null;
  getAgentStatus: (id: string) => 'Prêt' | 'En cours' | 'Terminé';
  generateHeroImage: () => void;
  isGeneratingImage: boolean;
  setPreview: (preview: any) => void;
  projects: Project[];
  currentProjectId: string | null;
}

export const GeneratorView = ({
  step,
  setStep,
  selectedTemplate,
  setSelectedTemplate,
  brandingOverrides,
  setBrandingOverrides,
  request,
  setRequest,
  loading,
  error,
  handleSubmit,
  parsedIntent,
  setParsedIntent,
  handleConfirmIntent,
  result,
  activeAgentName,
  getAgentStatus,
  generateHeroImage,
  isGeneratingImage,
  setPreview,
  projects,
  currentProjectId,
}: GeneratorViewProps) => {
  return (
    <motion.div 
      key="generator"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="grid grid-cols-1 xl:grid-cols-3 gap-6"
    >
      {/* Left Column: Flow Steps & Results */}
      <div className="xl:col-span-2 space-y-6">
        <AnimatePresence mode="wait">
          {step === 'template-selection' && (
            <motion.div 
              key="template-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1.5">Sélection du Modèle</h1>
                <p className="text-sm text-muted-foreground mb-6">Choisissez une fondation architecturale ou concevez sur-mesure.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option: No Template */}
                  <button 
                    onClick={() => {
                      setSelectedTemplate(null);
                      setStep('input');
                    }}
                    className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-card/80 transition-all text-center bg-card cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-3">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="font-bold text-foreground text-sm">Génération Sur-Mesure</h3>
                    <p className="text-xs text-muted-foreground mt-1">Laissez les agents composer l&apos;intégralité du funnel</p>
                  </button>

                  {/* Templates List */}
                  {TEMPLATES.map((template) => (
                    <button 
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setBrandingOverrides(template.config.branding);
                        setStep('customize');
                      }}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border hover:border-primary transition-all text-left bg-card shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <div className="h-32 w-full relative overflow-hidden bg-muted">
                        <Image src={template.thumbnail} alt={template.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2.5 right-2.5 bg-card/90 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold text-primary uppercase tracking-wider border border-border">
                          {template.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm text-foreground">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'customize' && selectedTemplate && (
            <motion.div 
              key="customize-step"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Personnalisation Luxe</h1>
                    <p className="text-xs md:text-sm text-muted-foreground">Ajustez l&apos;identité visuelle et les contrastes.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setStep('template-selection')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      RETOUR
                    </button>
                    <GlitchButton 
                      onClick={() => setStep('input')}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-xs font-bold tracking-wider"
                    >
                      CONTINUER
                    </GlitchButton>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nuancier &amp; Palette</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg border border-border" style={{ backgroundColor: brandingOverrides?.primaryColor }} />
                          <span className="text-xs font-medium text-foreground">Couleur Primaire (Accents)</span>
                        </div>
                        <input 
                          type="color" 
                          value={brandingOverrides?.primaryColor || '#0066FF'}
                          onChange={(e) => setBrandingOverrides({ ...brandingOverrides, primaryColor: e.target.value, accentColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg border border-border" style={{ backgroundColor: brandingOverrides?.backgroundColor }} />
                          <span className="text-xs font-medium text-foreground">Fond de Page</span>
                        </div>
                        <input 
                          type="color" 
                          value={brandingOverrides?.backgroundColor || '#0A0A0A'}
                          onChange={(e) => setBrandingOverrides({ ...brandingOverrides, backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg border border-border" style={{ backgroundColor: brandingOverrides?.textColor }} />
                          <span className="text-xs font-medium text-foreground">Typographie &amp; Titres</span>
                        </div>
                        <input 
                          type="color" 
                          value={brandingOverrides?.textColor || '#FFFFFF'}
                          onChange={(e) => setBrandingOverrides({ ...brandingOverrides, textColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 border border-border shadow-xs relative overflow-hidden">
                    <div className="absolute inset-0 opacity-15" style={{ backgroundColor: brandingOverrides?.backgroundColor }} />
                    <div className="relative z-10 space-y-3 w-full">
                      <div className="h-1.5 w-16 bg-primary/40 rounded-full mx-auto" />
                      <h4 className="text-lg font-bold tracking-tight" style={{ color: brandingOverrides?.textColor, fontFamily: selectedTemplate.config.branding.fontHeadlines }}>
                        Rendu Typographique &amp; CTA
                      </h4>
                      <p className="text-[11px] opacity-70 max-w-[220px] mx-auto" style={{ color: brandingOverrides?.textColor }}>
                        Contraste calibré pour maximiser la rétention et l&apos;impact.
                      </p>
                      <div 
                        className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-sm mx-auto inline-block"
                        style={{ backgroundColor: brandingOverrides?.primaryColor, color: brandingOverrides?.backgroundColor }}
                      >
                        ACCÉDER À L&apos;OFFRE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'input' && (
            <motion.div 
              key="input-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1.5">Description de votre Offre</h1>
              <p className="text-sm text-muted-foreground mb-5">Détaillez le produit, la cible, et les éléments différenciateurs.</p>
              
              {error && (
                <div className="mb-5 p-3.5 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <textarea
                  className="w-full p-4 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-foreground text-sm min-h-[180px] mb-5 font-normal placeholder:text-muted-foreground/60"
                  placeholder="Ex: Je lance un service de conciergerie privée pour entrepreneurs et dirigeants à 1500€/mois. L'objectif est la prise de rendez-vous qualifié..."
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  disabled={loading}
                />
                
                <div className="flex justify-between items-center">
                  {selectedTemplate && (
                    <button
                      type="button"
                      onClick={() => setStep('customize')}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      ← Modifier le template ({selectedTemplate.name})
                    </button>
                  )}
                  <div className="ml-auto">
                    <GlitchButton
                      type="submit"
                      className={`px-6 py-3 rounded-xl font-bold text-xs tracking-wider shadow-md transition-all flex items-center gap-2 ${
                        loading 
                          ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none' 
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      }`}
                      disabled={loading || !request.trim()}
                    >
                      {loading ? 'ANALYSE DE L\'OFFRE...' : 'LANCER L\'ANALYSE'}
                      {!loading && <ArrowRight size={15} />}
                    </GlitchButton>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'review' && parsedIntent && (
            <motion.div 
              key="review-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1.5">Validation des Données Business</h1>
              <p className="text-sm text-muted-foreground mb-5">Affinez les paramètres identifiés par l&apos;agent avant l&apos;assemblage.</p>
              
              {error && (
                <div className="mb-5 p-3.5 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Produit / Offre</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                    value={parsedIntent.product_name || ''}
                    onChange={(e) => setParsedIntent({...parsedIntent, product_name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Tarif / Structure Prix</label>
                    <input 
                    type="text" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                    value={parsedIntent.price || ''}
                    onChange={(e) => setParsedIntent({...parsedIntent, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Audience Cible</label>
                    <input 
                    type="text" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                    value={parsedIntent.suspected_audience || ''}
                    onChange={(e) => setParsedIntent({...parsedIntent, suspected_audience: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Promesse &amp; Proposition de Valeur</label>
                  <textarea 
                    className="w-full p-3.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-20 text-foreground text-sm"
                    value={parsedIntent.core_promise || ''}
                    onChange={(e) => setParsedIntent({...parsedIntent, core_promise: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep('input')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  RETOUR
                </button>
                <GlitchButton
                  onClick={handleConfirmIntent}
                  className="px-6 py-3 rounded-xl font-bold text-xs tracking-wider shadow-md transition-all flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  GÉNÉRER LE TUNNEL COMPLET
                  <ArrowRight size={15} />
                </GlitchButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Animation */}
        <AnimatePresence>
          {loading && step === 'generating' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border w-full overflow-hidden space-y-4"
            >
              <div className="flex justify-between items-center text-xs font-bold text-foreground uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Activity size={14} className="text-primary animate-pulse" />
                  Orchestration de l&apos;Essaim IA (13 Agents)
                </span>
                <span className="text-primary font-mono flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                  <Loader2 size={12} className="animate-spin" />
                  {activeAgentName || 'Génération active...'}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden relative border border-border/40">
                <motion.div
                  className="absolute top-0 bottom-0 w-1/3 bg-primary rounded-full shadow-[0_0_12px_var(--color-primary)]"
                  animate={{ 
                    left: ["-30%", "100%", "-30%"] 
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping inline-block" />
                {activeAgentName ? `Agent en cours d'exécution : ${activeAgentName}` : 'Synchronisation des agents cognitifs en cours...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Area */}
        {step === 'result' && result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Tunnel de Vente Prêt</h2>
                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">Code HTML5, Tailwind CSS &amp; interactions générés.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={generateHeroImage} 
                  disabled={isGeneratingImage}
                  className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2.5 rounded-xl text-xs font-bold border border-border transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <ImageIcon size={15} />
                  {isGeneratingImage ? 'CRÉATION IMAGE...' : 'VISUEL HERO IA'}
                </button>
                <button 
                  onClick={() => setPreview({ ...result.frontend.data, heroImage: result.heroImage })} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Maximize2 size={15} />
                  PRÉVISUALISER
                </button>
              </div>
            </div>
            
            {projects.find(p => p.id === currentProjectId)?.heroImage && (
              <div className="rounded-xl overflow-hidden border border-border shadow-xs relative h-72">
                <Image src={projects.find(p => p.id === currentProjectId)?.heroImage as string} alt="Hero" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            <details className="group">
              <summary className="flex items-center justify-between bg-muted/30 p-3.5 rounded-xl cursor-pointer list-none border border-border hover:bg-muted/60 transition-colors">
                <div className="flex items-center gap-2.5 font-semibold text-xs text-foreground">
                  <FileJson size={16} className="text-primary" />
                  Inspection Détaillée des Données Agents (Architecture)
                </div>
                <div className="w-6 h-6 rounded-lg bg-card flex items-center justify-center border border-border group-open:rotate-180 transition-transform">
                  <ArrowRight size={13} className="text-muted-foreground rotate-90" />
                </div>
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {Object.entries(result).map(([key, val]) => (
                  <div key={key} className="bg-muted/20 p-3.5 rounded-xl overflow-hidden border border-border">
                    <h3 className="font-bold mb-2 capitalize text-foreground text-xs tracking-wider flex items-center gap-2 border-b border-border pb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {key}
                    </h3>
                    <div className="h-48 overflow-auto custom-scrollbar">
                      <pre className="text-muted-foreground font-mono text-[11px] leading-relaxed">{JSON.stringify(val, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </motion.div>
        )}
      </div>

      {/* Right Column: Status & Info Panels */}
      <div className="space-y-6">
        <AgentStatusPanel 
          step={step}
          loading={loading}
          getAgentStatus={getAgentStatus}
        />
        <ExportPanel />
      </div>
    </motion.div>
  );
};
