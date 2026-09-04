'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ExternalLink, 
  X, 
  Download, 
  Image as ImageIcon, 
  FileCode2, 
  FileArchive 
} from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';

interface PreviewModalProps {
  preview: any;
  setPreview: (val: any) => void;
  previewMode: 'mobile' | 'desktop';
  setPreviewMode: (mode: 'mobile' | 'desktop') => void;
  previewTab: 'visual' | 'code';
  setPreviewTab: (tab: 'visual' | 'code') => void;
  openInNewTab: () => void;
  downloadFile: (filename: string, content: string) => void;
  downloadCombinedHtml: () => void;
  downloadZip: () => void;
  getSrcDoc: () => string;
}

export const PreviewModal = ({
  preview,
  setPreview,
  previewMode,
  setPreviewMode,
  previewTab,
  setPreviewTab,
  openInNewTab,
  downloadFile,
  downloadCombinedHtml,
  downloadZip,
  getSrcDoc,
}: PreviewModalProps) => {
  if (!preview) return null;

  return (
    <AnimatePresence>
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
    </AnimatePresence>
  );
};
