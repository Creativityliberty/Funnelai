'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import JSZip from 'jszip';
import { get, set } from 'idb-keyval';
import { Copy, Check, Maximize2, Minimize2, FileCode2, Download, ExternalLink, X, FileArchive, FileJson, Sparkles, LayoutDashboard, Rocket, FileText, Settings, Users, ArrowRight, Image as ImageIcon, Trash2, CreditCard, User, Mail, Lock, LogOut, Sun, Moon, Cpu, Terminal, Server, Globe, Code2, CheckCircle2, Eye, EyeOff, Key, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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

import { TEMPLATES, Template } from '@/lib/templates';

interface Project {
  id: string;
  name: string;
  date: string;
  request: string;
  result: any;
  heroImage?: string;
  templateId?: string;
}

const CodeBlock = ({ code, filename, language }: { code: string, filename: string, language: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-md flex flex-col w-full text-card-foreground"
    >
      <div className="flex justify-between items-center px-5 py-3.5 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground/90">
          <FileCode2 size={16} className="text-primary drop-shadow-[0_0_8px_var(--color-primary)]" />
          {filename}
        </div>
        <button 
          onClick={handleCopy} 
          className="text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 text-xs bg-background/80 hover:bg-background px-3.5 py-1.5 rounded-lg border border-border shadow-xs font-medium"
        >
          {copied ? <Check size={14} className="text-primary"/> : <Copy size={14} />}
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
      <div className={`relative ${expanded ? '' : 'max-h-96'} overflow-hidden bg-card/60`}>
        <pre className="p-6 text-foreground/85 font-mono text-sm overflow-x-auto leading-relaxed">
          {code}
        </pre>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs flex justify-center items-center gap-2 border-t border-border font-semibold tracking-wider uppercase"
      >
        {expanded ? <><Minimize2 size={14}/> Réduire</> : <><Maximize2 size={14}/> Développer</>}
      </button>
    </motion.div>
  );
};

const MiniChart = ({ color = 'var(--color-primary)', height = 24, width = 70 }: { color?: string, height?: number, width?: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[]>([10, 12, 8, 15, 11, 13, 9, 14, 10, 12, 8, 15]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), Math.random() * 10 + 5];
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 20]).range([height, 0]);

    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis);

    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1(d => y(d))
      .curve(d3.curveBasis);

    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "currentColor").attr("stop-opacity", 0.35);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "currentColor").attr("stop-opacity", 0);

    svg.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", `url(#${gradientId})`)
      .attr("class", "text-primary");

    svg.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("class", "text-primary drop-shadow-[0_0_6px_var(--color-primary)]");

  }, [data, color, height, width]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
  );
};

const GlitchButton = ({ children, onClick, className, disabled, variant = 'primary' }: any) => {
  return (
    <motion.button
      whileHover={!disabled ? { 
        scale: 1.015,
      } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden group cursor-pointer transition-all duration-300 font-semibold tracking-wide ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2.5">{children}</span>
      
      {!disabled && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
          <motion.div 
            className="absolute inset-0 bg-white/10"
            animate={{ 
              x: ["-100%", "100%"],
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          />
        </div>
      )}
    </motion.button>
  );
};

const GrainOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const ScanlineOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-50 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] animate-scanline"></div>
  </div>
);

export default function Page() {
  const [request, setRequest] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'template-selection' | 'customize' | 'input' | 'review' | 'generating' | 'result'>('template-selection');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [brandingOverrides, setBrandingOverrides] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedIntent, setParsedIntent] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [previewTab, setPreviewTab] = useState<'visual' | 'code'>('visual');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<'generator' | 'tunnels' | 'dashboard' | 'settings' | 'integrations'>('generator');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // AI Models and API Key state for Settings
  const [selectedTextModel, setSelectedTextModel] = useState<string>('gemini-3-flash-preview');
  const [selectedImageModel, setSelectedImageModel] = useState<string>('gemini-2.5-flash-image');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('funnel_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const savedSidebar = localStorage.getItem('funnel_sidebar_collapsed');
    if (savedSidebar === 'true') {
      setIsSidebarCollapsed(true);
    }

    const savedTextModel = localStorage.getItem('gemini_text_model');
    if (savedTextModel) setSelectedTextModel(savedTextModel);

    const savedImageModel = localStorage.getItem('gemini_image_model');
    if (savedImageModel) setSelectedImageModel(savedImageModel);

    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKeyInput(savedKey);
    } else if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setApiKeyInput(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('funnel_sidebar_collapsed', String(next));
      return next;
    });
  };

  const saveAiSettings = () => {
    localStorage.setItem('gemini_text_model', selectedTextModel);
    localStorage.setItem('gemini_image_model', selectedImageModel);
    if (apiKeyInput.trim()) {
      localStorage.setItem('gemini_api_key', apiKeyInput.trim());
    }
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
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

  useEffect(() => {
    const loadProjects = async () => {
      try {
        let savedProjects = await get('ai_funnel_projects');
        if (!savedProjects) {
          // Try to migrate from localStorage
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
    }
  };

  const loadProject = (project: Project) => {
    setCurrentProjectId(project.id);
    setResult(project.result);
    setRequest(project.request);
    setStep('result');
    setCurrentView('generator');
  };

  const generateHeroImage = async () => {
    if (!result || !currentProjectId) return;
    
    setIsGeneratingImage(true);
    try {
      const res = await imageGenerationAgent({ intent: result.intent.data, branding: result.branding.data });
      if (res.success && res.data?.imageUrl) {
        const updatedProjects = projects.map(p => {
          if (p.id === currentProjectId) {
            return { ...p, heroImage: res.data.imageUrl || undefined };
          }
          return p;
        });
        setProjects(updatedProjects);
        await set('ai_funnel_projects', updatedProjects);
        
        // Update current result with the new image
        const updatedResult = { ...result, heroImage: res.data.imageUrl };
        setResult(updatedResult);
        
        // If preview is open, update it too
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

  const startNewProject = () => {
    setCurrentProjectId(null);
    setResult(null);
    setRequest('');
    setStep('template-selection');
    setSelectedTemplate(null);
    setBrandingOverrides(null);
    setParsedIntent(null);
    setCurrentView('generator');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const intentRes = await offerIntentAgent(request, selectedTemplate);
      setParsedIntent(intentRes.data);
      setStep('review');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('403') || err.message?.includes('leaked') || err.message?.includes('API key')) {
        setError("Clé API invalide ou quota de génération expiré. Veuillez vérifier votre clé API dans les Paramètres.");
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
      const structureRes = await funnelStructureAgent(intentRes.data);
      const copyRes = await copywritingExpertAgent(intentRes.data);
      const imagePromptsRes = await imagePromptAgent({ intent: intentRes.data, copy: copyRes.data });
      const headlineRes = await headlineCopyAgent(structureRes.data);
      const layoutRes = await layoutHierarchyAgent(structureRes.data);
      const spacingRes = await spacingRhythmAgent(layoutRes.data);
      const brandRes = await brandContrastAgent(intentRes.data);
      const imageRes = await imageDirectionAgent(intentRes.data);
      const proofRes = await proofNumbersAgent(intentRes.data);
      const interactionRes = await interactionMotionAgent(layoutRes.data);
      
      // Generate Hero Image
      let heroImageUrl = undefined;
      try {
        const imgRes = await imageGenerationAgent({ intent: intentRes.data, branding: brandRes.data });
        if (imgRes.success && imgRes.data?.imageUrl) {
          heroImageUrl = imgRes.data.imageUrl;
        }
      } catch (e) {
        console.error("Hero image generation failed", e);
      }

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
        // Update existing project
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
      if (err.message?.includes('403') || err.message?.includes('leaked') || err.message?.includes('API key')) {
        setError("Clé API invalide ou quota de génération expiré. Veuillez vérifier votre clé API dans les Paramètres.");
      } else {
        setError("Une erreur est survenue lors de la génération du tunnel. Veuillez réessayer.");
      }
      setStep('review');
    } finally {
      setLoading(false);
    }
  };

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
    
    // Add hero image if it exists
    if (preview.heroImage) {
      const base64Data = preview.heroImage.split(',')[1];
      if (base64Data) {
        zip.file("hero.png", base64Data, { base64: true });
        // Update index.html to point to the local file in the ZIP
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
      indexHtml = indexHtml.replace(/\[heroImage\]/g, preview.heroImage);
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
      
      {/* Sidebar */}
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
          <div className="p-3 border-t border-sidebar-border flex flex-col items-center justify-center relative z-10" title="10 Agents IA Synchronisés">
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
               <span className="text-primary font-bold">10/10 Online</span>
             </div>

              <div className="bg-card/70 rounded-xl p-2.5 font-mono text-[9px] border border-border/60 shadow-inner">
                <div className="space-y-1">
                  <div className="flex gap-2 items-center">
                    <span className="text-primary font-bold">SYS</span>
                    <span className="text-muted-foreground">10 Agents IA Synchronisés</span>
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top Bar */}
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

          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
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
                  { label: 'Agents IA Actifs', value: '10', icon: Users, color: 'text-accent' },
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
          )}

          {currentView === 'generator' && (
            <motion.div 
              key="generator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              
              {/* Left Column: Input Form */}
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
                            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-card/80 transition-all text-center bg-card"
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
                              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border hover:border-primary transition-all text-left bg-card shadow-xs hover:shadow-md"
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
                              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                                  <div className="w-7 h-7 rounded-lg border border-border" style={{ backgroundColor: brandingOverrides.primaryColor }} />
                                  <span className="text-xs font-medium text-foreground">Couleur Primaire (Accents)</span>
                                </div>
                                <input 
                                  type="color" 
                                  value={brandingOverrides.primaryColor}
                                  onChange={(e) => setBrandingOverrides({ ...brandingOverrides, primaryColor: e.target.value, accentColor: e.target.value })}
                                  className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                                />
                              </div>

                              <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg border border-border" style={{ backgroundColor: brandingOverrides.backgroundColor }} />
                                  <span className="text-xs font-medium text-foreground">Fond de Page</span>
                                </div>
                                <input 
                                  type="color" 
                                  value={brandingOverrides.backgroundColor}
                                  onChange={(e) => setBrandingOverrides({ ...brandingOverrides, backgroundColor: e.target.value })}
                                  className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                                />
                              </div>

                              <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg border border-border" style={{ backgroundColor: brandingOverrides.textColor }} />
                                  <span className="text-xs font-medium text-foreground">Typographie &amp; Titres</span>
                                </div>
                                <input 
                                  type="color" 
                                  value={brandingOverrides.textColor}
                                  onChange={(e) => setBrandingOverrides({ ...brandingOverrides, textColor: e.target.value })}
                                  className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-card rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 border border-border shadow-xs relative overflow-hidden">
                            <div className="absolute inset-0 opacity-15" style={{ backgroundColor: brandingOverrides.backgroundColor }} />
                            <div className="relative z-10 space-y-3 w-full">
                              <div className="h-1.5 w-16 bg-primary/40 rounded-full mx-auto" />
                              <h4 className="text-lg font-bold tracking-tight" style={{ color: brandingOverrides.textColor, fontFamily: selectedTemplate.config.branding.fontHeadlines }}>
                                Rendu Typographique &amp; CTA
                              </h4>
                              <p className="text-[11px] opacity-70 max-w-[220px] mx-auto" style={{ color: brandingOverrides.textColor }}>
                                Contraste calibré pour maximiser la rétention et l&apos;impact.
                              </p>
                              <div 
                                className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-sm mx-auto inline-block"
                                style={{ backgroundColor: brandingOverrides.primaryColor, color: brandingOverrides.backgroundColor }}
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
                              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
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
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
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
                      className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border w-full overflow-hidden space-y-3"
                    >
                      <div className="flex justify-between text-xs font-bold text-foreground uppercase tracking-wider">
                        <span>Orchestration des Agents IA</span>
                        <span className="text-primary font-mono">Génération active...</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden relative border border-border/40">
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
                          className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2.5 rounded-xl text-xs font-bold border border-border transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <ImageIcon size={15} />
                          {isGeneratingImage ? 'CRÉATION IMAGE...' : 'VISUEL HERO IA'}
                        </button>
                        <button 
                          onClick={() => setPreview({ ...result.frontend.data, heroImage: result.heroImage })} 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
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

              {/* Right Column: Status / Info Panel */}
              <div className="space-y-6">
                <div className="bg-card rounded-2xl p-6 shadow-xs border border-border text-foreground relative overflow-hidden">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Statut des 10 Agents
                  </h3>
                  <div className="space-y-2.5 relative z-10">
                    {[
                      { name: 'Offer Intent Agent', status: step === 'review' || step === 'generating' || step === 'result' ? 'Terminé' : (loading && step === 'input' ? 'En cours' : 'Prêt') },
                      { name: 'Funnel Structure Agent', status: step === 'result' ? 'Terminé' : (loading && step === 'generating' ? 'En cours' : 'Prêt') },
                      { name: 'Copywriting Agent', status: step === 'result' ? 'Terminé' : (loading && step === 'generating' ? 'En cours' : 'Prêt') },
                      { name: 'Brand & UX Contrast', status: step === 'result' ? 'Terminé' : (loading && step === 'generating' ? 'En cours' : 'Prêt') },
                      { name: 'Frontend Assembly Agent', status: step === 'result' ? 'Terminé' : (loading && step === 'generating' ? 'En cours' : 'Prêt') },
                    ].map((agent, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                        <span className="text-xs text-muted-foreground">{agent.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          agent.status === 'Terminé' ? 'bg-primary/15 text-primary border border-primary/20' :
                          agent.status === 'En cours' ? 'bg-accent/15 text-accent border border-accent/20 animate-pulse' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

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
              </div>

            </motion.div>
          )}

          {currentView === 'tunnels' && (
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
          )}

          {currentView === 'settings' && (
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
                      10 Agents Connectés
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Text/Reasoning Model */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                        Modèle Raisonnement, Copywriting &amp; Code (10 Agents)
                      </label>
                      <select
                        value={selectedTextModel}
                        onChange={(e) => setSelectedTextModel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-mono font-medium"
                      >
                        <option value="gemini-3-flash-preview">gemini-3-flash-preview (Recommandé • Raisonnement Avancé &amp; Contexte 1M)</option>
                        <option value="gemini-2.5-flash">gemini-2.5-flash (Ultra-rapide • Hybride)</option>
                        <option value="gemini-2.0-flash">gemini-2.0-flash (Production Standard)</option>
                      </select>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Utilisé pour l&apos;analyse d&apos;offre, la structure de vente, le copywriting 15 étapes et la génération frontend.
                      </p>
                    </div>

                    {/* Image Model */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                        Modèle Génération d&apos;Images Hero
                      </label>
                      <select
                        value={selectedImageModel}
                        onChange={(e) => setSelectedImageModel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-xs font-mono font-medium"
                      >
                        <option value="gemini-2.5-flash-image">gemini-2.5-flash-image (Recommandé • Rendu Photoréaliste Haute Définition)</option>
                      </select>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Génère l&apos;image Hero photoréaliste encodée directement dans le tunnel.
                      </p>
                    </div>

                    {/* API Key BYOK */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                          <Key size={12} className="text-primary" />
                          Clé API Gemini (BYOK - Bring Your Own Key)
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
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                        <p className="text-[11px] text-muted-foreground">
                          Sauvegardée localement dans votre navigateur pour une utilisation autonome.
                        </p>
                        <button
                          onClick={saveAiSettings}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          {settingsSaved ? <Check size={14} /> : <Cpu size={14} />}
                          {settingsSaved ? "ENREGISTRÉ !" : "SAUVEGARDER LE MOTEUR"}
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
          )}

          {currentView === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
                    <Cpu className="text-primary drop-shadow-[0_0_8px_var(--color-primary)]" size={26} />
                    API Headless &amp; Serveur MCP Universel
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connectez Funnel AI Studio à ChatGPT, Claude Desktop, Antigravity, Cursor ou vos scripts automatiques.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/openapi.json"
                    download="openapi.json"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted text-foreground border border-border rounded-xl text-xs font-bold tracking-wider transition-colors shadow-xs"
                  >
                    <Download size={14} className="text-primary" />
                    TÉLÉCHARGER OPENAPI (JSON)
                  </a>
                </div>
              </div>

              {/* Grid Cards: MCP + REST API + ChatGPT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MCP Server Card */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="text-primary" size={20} />
                        <h3 className="font-bold text-base text-foreground">Serveur MCP (Model Context Protocol)</h3>
                      </div>
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase rounded-lg border border-primary/20">
                        Stdio Ready
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      Permet à Claude Desktop, Cursor et Antigravity d&apos;invoquer directement les 10 agents IA pour créer des tunnels complets via des outils natifs (Tool Calling).
                    </p>

                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                        <Sparkles size={12} className="text-primary" />
                        Outils Exposés (Tools)
                      </div>
                      <ul className="text-xs space-y-1.5 text-muted-foreground font-mono bg-muted/40 p-3 rounded-xl border border-border">
                        <li className="flex items-center justify-between">
                          <span className="text-foreground font-semibold">funnel_create_complete</span>
                          <span className="text-[10px] text-primary">Génération 100% autonome</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-foreground font-semibold">funnel_analyze_offer</span>
                          <span className="text-[10px] text-muted-foreground">Analyse &amp; Promesse</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-foreground font-semibold">funnel_list_templates</span>
                          <span className="text-[10px] text-muted-foreground">Catalogue Templates</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-foreground font-semibold">funnel_engine_health</span>
                          <span className="text-[10px] text-muted-foreground">Statut moteur</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-2">Commande de lancement :</p>
                    <div className="bg-muted/80 p-3 rounded-xl border border-border font-mono text-xs text-primary flex items-center justify-between">
                      <code>npm run mcp</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('npm run mcp');
                        }}
                        className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                        title="Copier"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ChatGPT Actions Card */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="text-accent" size={20} />
                        <h3 className="font-bold text-base text-foreground">ChatGPT Custom GPTs Actions</h3>
                      </div>
                      <span className="px-2.5 py-1 bg-accent/10 text-accent text-[10px] font-bold tracking-widest uppercase rounded-lg border border-accent/20">
                        OpenAPI 3.1
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      Permet à ChatGPT d&apos;agir comme un concepteur de tunnels de vente en branchant l&apos;API via une Action Custom GPT sans une seule ligne de code.
                    </p>

                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-accent" />
                        Guide Rapide de Configuration
                      </div>
                      <ol className="text-xs space-y-2 text-muted-foreground bg-muted/40 p-3.5 rounded-xl border border-border list-decimal list-inside">
                        <li>Allez dans ChatGPT &gt; <strong>Explore GPTs</strong> &gt; <strong>Create a GPT</strong>.</li>
                        <li>Dans l&apos;onglet <strong>Configure</strong>, cliquez sur <strong>Create new action</strong>.</li>
                        <li>Dans <em>Import from URL</em>, collez l&apos;URL ci-dessous ou importez le fichier <code className="text-foreground">openapi.json</code>.</li>
                        <li>ChatGPT découvre automatiquement toutes les routes et peut générer des tunnels pour vos clients !</li>
                      </ol>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-2">URL du Schéma OpenAPI :</p>
                    <div className="bg-muted/80 p-3 rounded-xl border border-border font-mono text-xs text-accent flex items-center justify-between">
                      <code>http://localhost:3000/api/v1/openapi</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('http://localhost:3000/api/v1/openapi');
                        }}
                        className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                        title="Copier"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Configuration Snippets */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Code2 className="text-primary" size={18} />
                  Snippets de Configuration &amp; Documentation API
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CodeBlock
                    filename="claude_desktop_config.json"
                    language="json"
                    code={`{
  "mcpServers": {
    "funnel-ai-studio": {
      "command": "node",
      "args": ["/chemin/absolu/vers/mcp-server/index.mjs"],
      "env": {
        "FUNNEL_API_URL": "http://localhost:3000/api/v1"
      }
    }
  }
}`}
                  />

                  <CodeBlock
                    filename="curl-generate-funnel.sh"
                    language="bash"
                    code={`curl -X POST http://localhost:3000/api/v1/funnels/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "request": "Coaching privé High-Ticket pour dirigeants d entreprise, 3500€, promesse: doubler sa rentabilité en 90 jours",
    "templateId": "coaching-high-ticket",
    "generateHeroImage": true
  }'`}
                  />
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", bounce: 0, duration: 0.25 }}
            className="fixed inset-0 bg-background/85 backdrop-blur-md z-50 flex flex-col p-3 sm:p-6"
          >
            <div className="bg-card rounded-2xl w-full h-full flex flex-col overflow-hidden shadow-2xl border border-border">
              
              {/* Header */}
              <div className="bg-card px-6 py-3.5 flex justify-between items-center border-b border-border">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <LayoutDashboard size={20} className="text-primary" />
                    Aperçu Live &amp; Code
                  </h2>
                  <div className="flex bg-muted/60 rounded-xl p-1 border border-border">
                    <button 
                      onClick={() => setPreviewTab('visual')} 
                      className={`px-4 py-1.5 rounded-lg transition-all font-bold text-xs tracking-wider uppercase ${previewTab === 'visual' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Visuel
                    </button>
                    <button 
                      onClick={() => setPreviewTab('code')} 
                      className={`px-4 py-1.5 rounded-lg transition-all font-bold text-xs tracking-wider uppercase ${previewTab === 'code' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Code Source
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {previewTab === 'visual' && (
                    <div className="flex bg-muted/60 rounded-xl p-1 border border-border">
                      <button onClick={() => setPreviewMode('mobile')} className={`px-3 py-1 rounded-lg font-bold text-[11px] tracking-wider uppercase transition-all ${previewMode === 'mobile' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}>Mobile</button>
                      <button onClick={() => setPreviewMode('desktop')} className={`px-3 py-1 rounded-lg font-bold text-[11px] tracking-wider uppercase transition-all ${previewMode === 'desktop' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}>Desktop</button>
                    </div>
                  )}
                  <button onClick={openInNewTab} className="text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-4 py-2 rounded-xl font-semibold text-xs tracking-wider transition-colors flex items-center gap-1.5 border border-border">
                    <ExternalLink size={14} />
                    OUVRIR
                  </button>
                  <button onClick={() => setPreview(null)} className="text-destructive-foreground bg-destructive hover:bg-destructive/90 px-4 py-2 rounded-xl font-semibold text-xs tracking-wider transition-colors flex items-center gap-1.5 shadow-xs">
                    <X size={14} />
                    FERMER
                  </button>
                </div>
              </div>
              
              {/* Actions Bar */}
              <div className="flex gap-2.5 px-6 py-2.5 bg-muted/30 border-b border-border justify-center flex-wrap">
                <button onClick={() => downloadFile('index.html', preview.index_html)} className="bg-card hover:bg-muted border border-border text-foreground px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shadow-2xs"><Download size={14}/> HTML</button>
                <button onClick={() => downloadFile('styles.css', preview.styles_css)} className="bg-card hover:bg-muted border border-border text-foreground px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shadow-2xs"><Download size={14}/> CSS</button>
                <button onClick={() => downloadFile('script.js', preview.script_js)} className="bg-card hover:bg-muted border border-border text-foreground px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shadow-2xs"><Download size={14}/> JS</button>
                
                {preview.heroImage && (
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = preview.heroImage;
                      link.download = 'hero-image.png';
                      link.click();
                    }} 
                    className="bg-card hover:bg-muted border border-border text-primary px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <ImageIcon size={14}/> IMAGE HERO
                  </button>
                )}

                <div className="hidden sm:block w-px h-6 bg-border self-center mx-1"></div>
                <button onClick={downloadCombinedHtml} className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5"><FileCode2 size={14}/> HTML COMBINÉ</button>
                <button onClick={downloadZip} className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shadow-xs"><FileArchive size={14}/> EXPORT ZIP</button>
              </div>

              {/* Content Area */}
              <div className="flex-1 min-h-0 bg-background flex justify-center overflow-hidden relative">
                {previewTab === 'visual' ? (
                  <div className={`h-full transition-all duration-300 ease-in-out flex justify-center items-center ${previewMode === 'mobile' ? 'p-4 w-full max-w-[420px]' : 'w-full'}`}>
                    <div className={`w-full h-full bg-white overflow-hidden shadow-xl ${previewMode === 'mobile' ? 'rounded-[2rem] border-[10px] border-sidebar' : ''}`}>
                      <iframe 
                        srcDoc={getSrcDoc()} 
                        className="w-full h-full bg-white border-0"
                        title="Preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full overflow-auto p-4 sm:p-6 flex flex-col gap-6">
                    <CodeBlock filename="index.html" language="html" code={preview.index_html} />
                    <CodeBlock filename="styles.css" language="css" code={preview.styles_css} />
                    <CodeBlock filename="script.js" language="javascript" code={preview.script_js} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
