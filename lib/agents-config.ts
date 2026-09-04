import { 
  Target, 
  Layers, 
  FileText, 
  Type, 
  LayoutDashboard, 
  MoveVertical, 
  Palette, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Image as ImageIcon, 
  Code2,
  LucideIcon
} from 'lucide-react';

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  icon: LucideIcon;
  badgeColor: string;
}

export const AGENTS_LIST: AgentConfig[] = [
  {
    id: 'offer_intent',
    name: 'Offer Intent Agent',
    role: "Psychologie d'offre & USP",
    icon: Target,
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'funnel_structure',
    name: 'Funnel Structure Agent',
    role: 'Architecture CA.DA.CA & Flux',
    icon: Layers,
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'copywriting',
    name: 'Copywriting Expert Agent',
    role: '15 Étapes Persuasives Gusten Sun',
    icon: FileText,
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'headline_copy',
    name: 'Headline & Hook Agent',
    role: 'Accroches H1/H2 & Rétention',
    icon: Type,
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    id: 'layout_hierarchy',
    name: 'Layout Hierarchy Agent',
    role: 'Grille & Hiérarchie Visuelle',
    icon: LayoutDashboard,
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 'spacing_rhythm',
    name: 'Spacing Rhythm Agent',
    role: 'Respirations & Rythme UX',
    icon: MoveVertical,
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'brand_contrast',
    name: 'Brand & UX Contrast',
    role: 'Nuancier OKLCH & WCAG AAA',
    icon: Palette,
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'image_direction',
    name: 'Image Direction Agent',
    role: 'Direction Artistique & Cadres',
    icon: Eye,
    badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    id: 'image_prompt',
    name: 'Image Prompt Agent',
    role: 'Prompts Cinématiques Photoréalistes',
    icon: Sparkles,
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'proof_numbers',
    name: 'Proof & Numbers Agent',
    role: 'Preuves Sociales & Métriques',
    icon: ShieldCheck,
    badgeColor: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
  {
    id: 'interaction_motion',
    name: 'Interaction Motion Agent',
    role: 'Micro-animations & CSS',
    icon: Zap,
    badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  },
  {
    id: 'image_generation',
    name: 'Hero Image Generator',
    role: 'Synthèse Visuelle IA Photoréaliste',
    icon: ImageIcon,
    badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  },
  {
    id: 'frontend_assembly',
    name: 'Frontend Assembly Agent',
    role: 'Compilateur HTML & Tailwind v4',
    icon: Code2,
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  },
];
