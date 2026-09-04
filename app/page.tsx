'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { get, set } from 'idb-keyval';

// Types
import { Project, GeneratorStep, AppView } from '@/types/project';
import { Template } from '@/lib/templates';

// Agents
import { offerIntentAgent } from '@/agents/offer_intent_agent';
import { funnelStructureAgent } from '@/agents/funnel_structure_agent';
import { headlineCopyAgent } from '@/agents/headline_copy_agent';
import { layoutHierarchyAgent } from '@/agents/layout_hierarchy_agent';
import { spacingRhythmAgent } from '@/agents/spacing_rhythm_agent';
import { brandContrastAgent } from '@/agents/brand_contrast_agent';
import { imageDirectionAgent } from '@/agents/image_direction_agent';
import { proofNumbersAgent } from '@/agents/proof_numbers_agent';
import { interactionMotionAgent } from '@/agents/interaction_motion_agent';
import { frontendAssemblyAgent } from '@/agents/frontend_assembly_agent';
import { imageGenerationAgent } from '@/agents/image_generation_agent';
import { copywritingExpertAgent } from '@/agents/copywriting_expert_agent';
import { imagePromptAgent } from '@/agents/image_prompt_agent';

// Layout & UI Components
import { ScanlineOverlay } from '@/components/ui/overlays';
import { Sidebar } from '@/components/layout/sidebar';
import { TopHeader } from '@/components/layout/top-header';
import { PreviewModal } from '@/components/preview-modal';

// Views
import { DashboardView } from '@/components/views/dashboard-view';
import { GeneratorView } from '@/components/views/generator-view';
import { TunnelsView } from '@/components/views/tunnels-view';
import { SettingsView } from '@/components/views/settings-view';
import { IntegrationsView } from '@/components/views/integrations-view';

export default function Page() {
  // Generation & Pipeline State
  const [request, setRequest] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<GeneratorStep>('template-selection');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [brandingOverrides, setBrandingOverrides] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedIntent, setParsedIntent] = useState<any>(null);

  // Multi-Agent Swarm Live State
  const [agentStatuses, setAgentStatuses] = useState<Record<string, 'idle' | 'running' | 'done'>>({});
  const [activeAgentName, setActiveAgentName] = useState<string | null>(null);

  // Preview & Modal State
  const [preview, setPreview] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [previewTab, setPreviewTab] = useState<'visual' | 'code'>('visual');

  // App & Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('generator');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // AI Models and API Key state for Settings
  const [selectedTextModel, setSelectedTextModel] = useState<string>('deepseek-chat');
  const [selectedImageModel, setSelectedImageModel] = useState<string>('Flux1schnell');
  const [deepSeekApiKeyInput, setDeepSeekApiKeyInput] = useState<string>('');
  const [showDeepSeekApiKey, setShowDeepSeekApiKey] = useState<boolean>(false);
  const [deApiKeyInput, setDeApiKeyInput] = useState<string>('');
  const [showDeApiKey, setShowDeApiKey] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // API & MCP Integrations State
  const [apiOrigin, setApiOrigin] = useState<string>('https://funnelai.coolify.dallico.com');
  const [apiTestStatus, setApiTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Initialize Theme, Sidebar, API Keys & Projects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiOrigin(window.location.origin);
    }

    const savedTheme = localStorage.getItem('funnel_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const savedCollapsed = localStorage.getItem('funnel_sidebar_collapsed');
    if (savedCollapsed === 'true') {
      setIsSidebarCollapsed(true);
    }

    const savedTextModel = localStorage.getItem('active_text_model');
    if (savedTextModel && savedTextModel.startsWith('deepseek')) {
      setSelectedTextModel(savedTextModel);
    } else {
      setSelectedTextModel('deepseek-chat');
      localStorage.setItem('active_text_model', 'deepseek-chat');
    }

    const savedImageModel = localStorage.getItem('image_model') || localStorage.getItem('gemini_image_model');
    if (savedImageModel && (savedImageModel.startsWith('Flux') || savedImageModel.startsWith('ZImage'))) {
      setSelectedImageModel(savedImageModel);
    } else {
      setSelectedImageModel('Flux1schnell');
      localStorage.setItem('image_model', 'Flux1schnell');
    }

    const savedDeepSeekKey = localStorage.getItem('deepseek_api_key');
    if (savedDeepSeekKey) {
      setDeepSeekApiKeyInput(savedDeepSeekKey);
    } else if (process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      setDeepSeekApiKeyInput(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY);
    }

    const savedDeApiKey = localStorage.getItem('deapi_api_key');
    if (savedDeApiKey) {
      setDeApiKeyInput(savedDeApiKey);
    } else if (process.env.NEXT_PUBLIC_DEAPI_API_KEY) {
      setDeApiKeyInput(process.env.NEXT_PUBLIC_DEAPI_API_KEY);
    }

    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKeyInput(savedKey);
    } else if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setApiKeyInput(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    }

    const loadProjects = async () => {
      try {
        let savedProjects = await get('ai_funnel_projects');
        if (!savedProjects) {
          const local = localStorage.getItem('ai_funnel_projects');
          if (local) {
            savedProjects = JSON.parse(local);
            await set('ai_funnel_projects', savedProjects);
            localStorage.removeItem('ai_funnel_projects');
          }
        }
        if (savedProjects) {
          setProjects(savedProjects);
        }
      } catch (e) {
        console.error("Failed to load projects from IndexedDB", e);
      }
    };
    loadProjects();
  }, []);

  // Agent Status helper
  const getAgentStatus = (id: string): 'Prêt' | 'En cours' | 'Terminé' => {
    if (step === 'result') return 'Terminé';
    const state = agentStatuses[id];
    if (state === 'running') return 'En cours';
    if (state === 'done') return 'Terminé';
    if (id === 'offer_intent' && (step === 'review' || step === 'generating')) return 'Terminé';
    return 'Prêt';
  };

  // UI Handlers
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('funnel_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('funnel_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('funnel_theme', 'light');
      }
      return next;
    });
  };

  const saveAiSettings = () => {
    localStorage.setItem('active_text_model', selectedTextModel);
    localStorage.setItem('deepseek_text_model', selectedTextModel);
    localStorage.setItem('image_model', selectedImageModel);
    localStorage.setItem('gemini_image_model', selectedImageModel);
    if (deepSeekApiKeyInput.trim()) {
      localStorage.setItem('deepseek_api_key', deepSeekApiKeyInput.trim());
    }
    if (deApiKeyInput.trim()) {
      localStorage.setItem('deapi_api_key', deApiKeyInput.trim());
    }
    if (apiKeyInput.trim()) {
      localStorage.setItem('gemini_api_key', apiKeyInput.trim());
    }
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleTestApi = async () => {
    setApiTestStatus('testing');
    try {
      const startTime = performance.now();
      const res = await fetch('/api/v1/health');
      const data = await res.json();
      const duration = Math.round(performance.now() - startTime);
      setApiTestResult({ ...data, latencyMs: `${duration}ms` });
      setApiTestStatus('success');
    } catch (err: any) {
      setApiTestResult({ error: err.message || 'Erreur de connexion' });
      setApiTestStatus('error');
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Project Management Handlers
  const saveProject = async (newResult: any, req: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: req.substring(0, 30) + (req.length > 30 ? '...' : ''),
      date: new Date().toISOString(),
      request: req,
      result: newResult,
      templateId: selectedTemplate?.id
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    setCurrentProjectId(newProject.id);
    try {
      await set('ai_funnel_projects', updatedProjects);
    } catch (e) {
      console.error("Failed to save project to IndexedDB", e);
    }
  };

  const deleteProject = async (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    try {
      await set('ai_funnel_projects', updatedProjects);
    } catch (e) {
      console.error("Failed to delete project from IndexedDB", e);
    }
    if (currentProjectId === id) {
      setCurrentProjectId(null);
      setResult(null);
      setRequest('');
      setStep('input');
      setAgentStatuses({});
      setActiveAgentName(null);
    }
  };

  const loadProject = (project: Project) => {
    setCurrentProjectId(project.id);
    setResult(project.result);
    setRequest(project.request);
    setStep('result');
    setCurrentView('generator');
  };

  const startNewProject = () => {
    setCurrentProjectId(null);
    setResult(null);
    setRequest('');
    setStep('template-selection');
    setSelectedTemplate(null);
    setBrandingOverrides(null);
    setParsedIntent(null);
    setAgentStatuses({});
    setActiveAgentName(null);
    setCurrentView('generator');
  };

  // AI Pipeline Execution Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setAgentStatuses({ offer_intent: 'running' });
    setActiveAgentName('Offer Intent Agent');
    try {
      const intentRes = await offerIntentAgent(request, selectedTemplate);
      setParsedIntent(intentRes.data);
      setAgentStatuses({ offer_intent: 'done' });
      setActiveAgentName(null);
      setStep('review');
    } catch (err: any) {
      console.error(err);
      setAgentStatuses({ offer_intent: 'idle' });
      setActiveAgentName(null);
      if (err.message?.includes('403') || err.message?.includes('leaked') || err.message?.includes('API key')) {
        setError("Clé API invalide ou quota de génération expiré. Veuillez vérifier votre clé API dans les Paramètres.");
      } else if (err.message?.includes('503') || err.message?.includes('demand') || err.message?.includes('UNAVAILABLE')) {
        setError("Le service d'IA subit une forte affluence momentanée sur ce modèle. Le moteur réessaie automatiquement sur nos modèles haute disponibilité.");
      } else {
        setError("Une erreur est survenue lors de l'analyse de l'offre. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmIntent = async () => {
    setLoading(true);
    setStep('generating');
    setError(null);
    try {
      const intentRes = { data: parsedIntent };

      // 1. Funnel Structure
      setActiveAgentName('Funnel Structure Agent');
      setAgentStatuses(prev => ({ ...prev, offer_intent: 'done', funnel_structure: 'running' }));
      const structureRes = await funnelStructureAgent(intentRes.data);

      // 2. Copywriting Expert
      setActiveAgentName('Copywriting Expert Agent');
      setAgentStatuses(prev => ({ ...prev, funnel_structure: 'done', copywriting: 'running' }));
      const copyRes = await copywritingExpertAgent(intentRes.data);

      // 3. Image Prompts
      setActiveAgentName('Image Prompt Agent');
      setAgentStatuses(prev => ({ ...prev, copywriting: 'done', image_prompt: 'running' }));
      const imagePromptsRes = await imagePromptAgent({ intent: intentRes.data, copy: copyRes.data });

      // 4. Headline & Hook
      setActiveAgentName('Headline & Hook Agent');
      setAgentStatuses(prev => ({ ...prev, image_prompt: 'done', headline_copy: 'running' }));
      const headlineRes = await headlineCopyAgent(structureRes.data);

      // 5. Layout Hierarchy
      setActiveAgentName('Layout Hierarchy Agent');
      setAgentStatuses(prev => ({ ...prev, headline_copy: 'done', layout_hierarchy: 'running' }));
      const layoutRes = await layoutHierarchyAgent(structureRes.data);

      // 6. Spacing Rhythm
      setActiveAgentName('Spacing Rhythm Agent');
      setAgentStatuses(prev => ({ ...prev, layout_hierarchy: 'done', spacing_rhythm: 'running' }));
      const spacingRes = await spacingRhythmAgent(layoutRes.data);

      // 7. Brand & UX Contrast
      setActiveAgentName('Brand & UX Contrast');
      setAgentStatuses(prev => ({ ...prev, spacing_rhythm: 'done', brand_contrast: 'running' }));
      const brandRes = await brandContrastAgent(intentRes.data);

      // 8. Image Direction
      setActiveAgentName('Image Direction Agent');
      setAgentStatuses(prev => ({ ...prev, brand_contrast: 'done', image_direction: 'running' }));
      const imageRes = await imageDirectionAgent(intentRes.data);

      // 9. Proof & Numbers
      setActiveAgentName('Proof & Numbers Agent');
      setAgentStatuses(prev => ({ ...prev, image_direction: 'done', proof_numbers: 'running' }));
      const proofRes = await proofNumbersAgent(intentRes.data);

      // 10. Interaction Motion
      setActiveAgentName('Interaction Motion Agent');
      setAgentStatuses(prev => ({ ...prev, proof_numbers: 'done', interaction_motion: 'running' }));
      const interactionRes = await interactionMotionAgent(layoutRes.data);
      
      // 11. Hero Image Generation
      setActiveAgentName('Hero Image Generator');
      setAgentStatuses(prev => ({ ...prev, interaction_motion: 'done', image_generation: 'running' }));
      let heroImageUrl = undefined;
      try {
        const heroPrompt = imagePromptsRes?.data?.hero_image?.prompt;
        const imgRes = await imageGenerationAgent({
          prompt: heroPrompt,
          intent: intentRes.data,
          branding: brandRes.data,
          style: imagePromptsRes?.data?.hero_image?.style,
        });
        if (imgRes.success && imgRes.data?.imageUrl) {
          heroImageUrl = imgRes.data.imageUrl;
        }
      } catch (e) {
        console.error("Hero image generation failed", e);
      }

      // 12. Frontend Assembly
      setActiveAgentName('Frontend Assembly Agent');
      setAgentStatuses(prev => ({ ...prev, image_generation: 'done', frontend_assembly: 'running' }));
      const frontendRes = await frontendAssemblyAgent({
        intent: intentRes.data,
        structure: structureRes.data,
        copy: copyRes.data,
        imagePrompts: imagePromptsRes.data,
        headline: headlineRes.data,
        layout: layoutRes.data,
        spacing: spacingRes.data,
        branding: brandRes.data,
        images: imageRes.data,
        proof: proofRes.data,
        interaction: interactionRes.data,
        hasHeroImage: !!heroImageUrl,
        template: selectedTemplate,
        brandingOverrides: brandingOverrides
      });

      setAgentStatuses(prev => ({ ...prev, frontend_assembly: 'done' }));
      setActiveAgentName(null);

      const finalResult = { 
        intent: intentRes, 
        structure: structureRes, 
        copy: copyRes, 
        imagePrompts: imagePromptsRes, 
        headline: headlineRes, 
        layout: layoutRes, 
        spacing: spacingRes, 
        branding: brandRes, 
        images: imageRes, 
        proof: proofRes, 
        interaction: interactionRes, 
        frontend: frontendRes, 
        heroImage: heroImageUrl 
      };
      setResult(finalResult);
      setStep('result');
      if (!currentProjectId) {
        saveProject(finalResult, request);
      } else {
        const updatedProjects = projects.map(p => {
          if (p.id === currentProjectId) {
            return { ...p, result: finalResult, request };
          }
          return p;
        });
        setProjects(updatedProjects);
        await set('ai_funnel_projects', updatedProjects);
      }
    } catch (err: any) {
      console.error(err);
      setActiveAgentName(null);
      if (err.message?.includes('403') || err.message?.includes('leaked') || err.message?.includes('API key')) {
        setError("Clé API invalide ou quota de génération expiré. Veuillez vérifier votre clé API dans les Paramètres.");
      } else if (err.message?.includes('503') || err.message?.includes('demand') || err.message?.includes('UNAVAILABLE')) {
        setError("Le service d'IA subit une forte affluence momentanée sur ce modèle. Le moteur réessaie automatiquement sur nos modèles haute disponibilité.");
      } else {
        setError("Une erreur est survenue lors de la génération du tunnel. Veuillez réessayer.");
      }
      setStep('review');
    } finally {
      setLoading(false);
      setActiveAgentName(null);
    }
  };

  const generateHeroImage = async () => {
    if (!result || !currentProjectId) return;
    
    setIsGeneratingImage(true);
    try {
      const heroPrompt = result.imagePrompts?.data?.hero_image?.prompt;
      const res = await imageGenerationAgent({
        prompt: heroPrompt,
        intent: result.intent?.data,
        branding: result.branding?.data,
        style: result.imagePrompts?.data?.hero_image?.style,
      });
      if (res.success && res.data?.imageUrl) {
        const updatedProjects = projects.map(p => {
          if (p.id === currentProjectId) {
            return { ...p, heroImage: res.data.imageUrl || undefined };
          }
          return p;
        });
        setProjects(updatedProjects);
        await set('ai_funnel_projects', updatedProjects);
        
        const updatedResult = { ...result, heroImage: res.data.imageUrl };
        setResult(updatedResult);
        
        if (preview) {
          setPreview({ ...preview, heroImage: res.data.imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Preview & Export Handlers
  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadCombinedHtml = () => {
    if (!preview) return;
    let indexHtml = preview.index_html;
    if (preview.heroImage) {
      indexHtml = indexHtml.replace(/\[heroImage\]/g, preview.heroImage);
    }
    const combined = indexHtml
      .replace('</head>', `<style>${preview.styles_css}</style></head>`)
      .replace('</body>', `<script>${preview.script_js}</script></body>`);
    downloadFile('funnel-combined.html', combined);
  };

  const downloadZip = async () => {
    if (!preview) return;
    const zip = new JSZip();
    let indexHtml = preview.index_html;
    
    if (preview.heroImage) {
      const base64Data = preview.heroImage.split(',')[1];
      if (base64Data) {
        zip.file("hero.png", base64Data, { base64: true });
        indexHtml = indexHtml.replace(/\[heroImage\]/g, "hero.png");
      }
    }
    
    zip.file("index.html", indexHtml);
    zip.file("styles.css", preview.styles_css);
    zip.file("script.js", preview.script_js);
    
    const content = await zip.generateAsync({ type: "blob" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(content);
    element.download = "funnel-export.zip";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getSrcDoc = () => {
    if (!preview) return '';
    let indexHtml = preview.index_html;
    if (preview.heroImage) {
      indexHtml = indexHtml.replaceAll('[heroImage]', preview.heroImage);
      indexHtml = indexHtml.replace(/(<img[^>]*id=["']hero-img["'][^>]*src=)["'][^"']*["']/i, `$1"${preview.heroImage}"`);
      indexHtml = indexHtml.replace(/(<img[^>]*src=)["'][^"']*["']([^>]*id=["']hero-img["'])/i, `$1"${preview.heroImage}"$2`);
    }
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${preview.styles_css}</style>
        </head>
        <body>
          ${indexHtml}
          <script>${preview.script_js}</script>
        </body>
      </html>
    `;
  };

  const openInNewTab = () => {
    if (!preview) return;
    const blob = new Blob([getSrcDoc()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden relative">
      <ScanlineOverlay />
      
      {/* Ambient Glow Blobs */}
      <div className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] bg-primary/10 blur-[140px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-[15%] -right-[10%] w-[45%] h-[45%] bg-accent/10 blur-[140px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top Bar Header */}
          <TopHeader 
            isSidebarCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            startNewProject={startNewProject}
          />

          {/* Dynamic Views */}
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <DashboardView 
                projects={projects}
                setCurrentView={setCurrentView}
                loadProject={loadProject}
              />
            )}

            {currentView === 'generator' && (
              <GeneratorView 
                step={step}
                setStep={setStep}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                brandingOverrides={brandingOverrides}
                setBrandingOverrides={setBrandingOverrides}
                request={request}
                setRequest={setRequest}
                loading={loading}
                error={error}
                handleSubmit={handleSubmit}
                parsedIntent={parsedIntent}
                setParsedIntent={setParsedIntent}
                handleConfirmIntent={handleConfirmIntent}
                result={result}
                activeAgentName={activeAgentName}
                getAgentStatus={getAgentStatus}
                generateHeroImage={generateHeroImage}
                isGeneratingImage={isGeneratingImage}
                setPreview={setPreview}
                projects={projects}
                currentProjectId={currentProjectId}
              />
            )}

            {currentView === 'tunnels' && (
              <TunnelsView 
                projects={projects}
                startNewProject={startNewProject}
                loadProject={loadProject}
                deleteProject={deleteProject}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView 
                selectedTextModel={selectedTextModel}
                setSelectedTextModel={setSelectedTextModel}
                selectedImageModel={selectedImageModel}
                setSelectedImageModel={setSelectedImageModel}
                deepSeekApiKeyInput={deepSeekApiKeyInput}
                setDeepSeekApiKeyInput={setDeepSeekApiKeyInput}
                showDeepSeekApiKey={showDeepSeekApiKey}
                setShowDeepSeekApiKey={setShowDeepSeekApiKey}
                deApiKeyInput={deApiKeyInput}
                setDeApiKeyInput={setDeApiKeyInput}
                showDeApiKey={showDeApiKey}
                setShowDeApiKey={setShowDeApiKey}
                apiKeyInput={apiKeyInput}
                setApiKeyInput={setApiKeyInput}
                showApiKey={showApiKey}
                setShowApiKey={setShowApiKey}
                settingsSaved={settingsSaved}
                saveAiSettings={saveAiSettings}
              />
            )}

            {currentView === 'integrations' && (
              <IntegrationsView 
                apiOrigin={apiOrigin}
                copiedField={copiedField}
                copyToClipboard={copyToClipboard}
                apiTestStatus={apiTestStatus}
                apiTestResult={apiTestResult}
                handleTestApi={handleTestApi}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Fullscreen Live Preview Modal */}
      <PreviewModal 
        preview={preview}
        setPreview={setPreview}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        previewTab={previewTab}
        setPreviewTab={setPreviewTab}
        openInNewTab={openInNewTab}
        downloadFile={downloadFile}
        downloadCombinedHtml={downloadCombinedHtml}
        downloadZip={downloadZip}
        getSrcDoc={getSrcDoc}
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}} />
    </div>
  );
}
