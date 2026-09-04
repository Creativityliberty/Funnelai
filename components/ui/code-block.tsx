'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Maximize2, Minimize2, FileCode2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  filename: string;
  language?: string;
}

export const CodeBlock = ({ code, filename }: CodeBlockProps) => {
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
