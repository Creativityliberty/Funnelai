'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Cpu, 
  Lock, 
  CreditCard, 
  Trash2, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Check,
  Image as ImageIcon
} from 'lucide-react';

interface SettingsViewProps {
  selectedTextModel: string;
  setSelectedTextModel: (val: string) => void;
  selectedImageModel: string;
  setSelectedImageModel: (val: string) => void;
  deepSeekApiKeyInput: string;
  setDeepSeekApiKeyInput: (val: string) => void;
  showDeepSeekApiKey: boolean;
  setShowDeepSeekApiKey: (val: boolean) => void;
  deApiKeyInput: string;
  setDeApiKeyInput: (val: string) => void;
  showDeApiKey: boolean;
  setShowDeApiKey: (val: boolean) => void;
  apiKeyInput: string;
  setApiKeyInput: (val: string) => void;
  showApiKey: boolean;
  setShowApiKey: (val: boolean) => void;
  settingsSaved: boolean;
  saveAiSettings: () => void;
}

export const SettingsView = ({
  selectedTextModel,
  setSelectedTextModel,
  selectedImageModel,
  setSelectedImageModel,
  deepSeekApiKeyInput,
  setDeepSeekApiKeyInput,
  showDeepSeekApiKey,
  setShowDeepSeekApiKey,
  deApiKeyInput,
  setDeApiKeyInput,
  showDeApiKey,
  setShowDeApiKey,
  apiKeyInput,
  setApiKeyInput,
  showApiKey,
  setShowApiKey,
  settingsSaved,
  saveAiSettings,
}: SettingsViewProps) => {
  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border">
          <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
            <User size={20} className="text-primary" />
            Profil &amp; Identité
          </h3>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-muted/60 flex items-center justify-center border border-border shadow-xs overflow-hidden">
                <User size={44} className="text-muted-foreground" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-lg shadow-sm flex items-center justify-center hover:bg-primary/90 transition-colors">
                <ImageIcon size={15} />
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Nom Complet</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="text" defaultValue="Utilisateur Studio" className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="email" defaultValue="numtemadigitalmarketingagency@gmail.com" className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-medium" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cognitive Engine & Models Card */}
        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Cpu size={20} className="text-primary" />
              Moteur IA &amp; Modèles Actifs
            </h3>
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase rounded-lg border border-primary/20 flex items-center gap-1.5 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
              13 Agents Connectés
            </span>
          </div>

          <div className="space-y-4">
            {/* Text/Reasoning Model */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                Modèle Raisonnement, Copywriting &amp; Code (13 Agents)
              </label>
              <select
                value={selectedTextModel}
                onChange={(e) => setSelectedTextModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-mono font-medium"
              >
                <option value="deepseek-chat">deepseek-chat (Recommandé • V4 Flash / Chat • Puissant, Économique &amp; Précis)</option>
                <option value="deepseek-reasoner">deepseek-reasoner (DeepSeek-R1 • Raisonnement Stratégique 7-Figures)</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash (Google • Secours &amp; Vitesse)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Google Stable)</option>
              </select>
              <p className="text-[11px] text-muted-foreground mt-1">
                DeepSeek pilote l&apos;intention, la psychologie de conversion, le copywriting 15 étapes et la génération frontend.
              </p>
            </div>

            {/* Image Model */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                Modèle Génération d&apos;Images Hero (deAPI / Google)
              </label>
              <select
                value={selectedImageModel}
                onChange={(e) => setSelectedImageModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-mono font-medium"
              >
                <option value="Flux1schnell">Flux1schnell (Recommandé deAPI • FLUX.1 Schnell 12B • 0.002$/img • Ultra-Rapide &amp; Photoréaliste)</option>
                <option value="ZImageTurbo_INT8">ZImageTurbo_INT8 (deAPI • Z-Image Turbo 8-Steps • 0.009$/img)</option>
                <option value="Flux_2_Klein_4B_BF16">Flux_2_Klein_4B_BF16 (deAPI • FLUX.2 Klein 4B)</option>
                <option value="gemini-2.5-flash-image">gemini-2.5-flash-image (Google Imagen 3)</option>
              </select>
              <p className="text-[11px] text-muted-foreground mt-1">
                deAPI FLUX.1 Schnell génère des visuels hero 8K ultra-détaillés à prix mini (~0,002$/image) avec le prompt booster intégré.
              </p>
            </div>

            {/* API Keys BYOK */}
            <div className="pt-3 border-t border-border space-y-4">
              {/* DeepSeek API Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Key size={12} className="text-primary" />
                    Clé API DeepSeek (Texte, Code, Copywriting 13 Agents)
                  </label>
                  {deepSeekApiKeyInput && (
                    <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Configurée
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showDeepSeekApiKey ? "text" : "password"}
                    value={deepSeekApiKeyInput}
                    onChange={(e) => setDeepSeekApiKeyInput(e.target.value)}
                    placeholder="sk-..."
                    className="w-full pl-3.5 pr-24 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeepSeekApiKey(!showDeepSeekApiKey)}
                    className="absolute right-2 px-2.5 py-1 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    {showDeepSeekApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showDeepSeekApiKey ? "Cacher" : "Voir"}
                  </button>
                </div>
              </div>

              {/* deAPI Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <ImageIcon size={12} className="text-primary" />
                    Clé API deAPI (Génération d&apos;Images Ultra Économique FLUX.1 Schnell)
                  </label>
                  {deApiKeyInput && (
                    <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Configurée
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showDeApiKey ? "text" : "password"}
                    value={deApiKeyInput}
                    onChange={(e) => setDeApiKeyInput(e.target.value)}
                    placeholder="18179|..."
                    className="w-full pl-3.5 pr-24 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeApiKey(!showDeApiKey)}
                    className="absolute right-2 px-2.5 py-1 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    {showDeApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showDeApiKey ? "Cacher" : "Voir"}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Obtenez votre clé sur <a href="https://app.deapi.ai/dashboard/api-keys" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">app.deapi.ai</a> ($5 de crédits offerts).
                </p>
              </div>

              {/* Gemini API Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className="text-primary" />
                    Clé API Gemini (Secours &amp; Imagen Optionnel)
                  </label>
                  {apiKeyInput && (
                    <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Configurée
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-3.5 pr-24 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 px-2.5 py-1 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showApiKey ? "Cacher" : "Voir"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-muted-foreground">
                  Clés sauvegardées de façon sécurisée dans votre navigateur local.
                </p>
                <button
                  onClick={saveAiSettings}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  {settingsSaved ? <Check size={14} /> : <Cpu size={14} />}
                  {settingsSaved ? "ENREGISTRÉ !" : "SAUVEGARDER LES PARAMÈTRES IA"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border">
          <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Sécurité du Compte
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Mot de passe actuel</label>
              <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Confirmation</label>
                <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs" />
              </div>
            </div>
            <div className="pt-2">
              <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-colors border border-border">
                METTRE À JOUR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card p-6 rounded-2xl shadow-xs border border-border text-foreground relative overflow-hidden">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-primary" />
            Plan Studio Luxe
          </h3>
          <div className="p-4 bg-muted/40 rounded-xl border border-border mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quota IA</span>
              <span className="text-xs font-bold text-primary">85%</span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-primary shadow-[0_0_8px_var(--color-primary)]"></div>
            </div>
          </div>
          <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs tracking-wider hover:bg-primary/90 transition-colors shadow-xs">
            AUGMENTER LES QUOTAS
          </button>
        </div>

        <div className="bg-destructive/10 p-6 rounded-2xl border border-destructive/20">
          <h3 className="text-sm font-bold text-destructive mb-2 flex items-center gap-2">
            <Trash2 size={16} />
            Zone Critique
          </h3>
          <p className="text-xs text-muted-foreground mb-4">La suppression de votre compte efface définitivement tous vos tunnels et clés API.</p>
          <button className="w-full py-2 border border-destructive/40 text-destructive rounded-xl font-bold text-xs tracking-wider hover:bg-destructive hover:text-destructive-foreground transition-all">
            SUPPRIMER LE COMPTE
          </button>
        </div>
      </div>
    </motion.div>
  );
};
