import { getAiClient, getGeminiTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";

export interface StrategyRefinementInput {
  request: string;
  identifiedGaps?: string[];
  userPreferences?: {
    targetPrice?: string;
    guaranteeType?: string;
    primaryTrafficSource?: string;
    customDeliverables?: string[];
    [key: string]: any;
  };
}

export async function strategyRefinementAgent(input: StrategyRefinementInput) {
  const ai = getAiClient();

  const response = await ai.models.generateContent({
    model: getGeminiTextModel(),
    contents: `Tu es StrategyRefinementAgent, un Directeur Stratégique et Copywriter d'élite spécialisé dans les tunnels de vente 7-figures (méthodes Alex Hormozi $100M Offers, Russell Brunson, Gusten Sun).

Ta mission est de combler TOUTES les lacunes critiques d'une offre commerciale pour en faire une machine de conversion irréprochable.

Demande initiale de l'utilisateur :
"${input.request}"

Préférences additionnelles fournies :
${JSON.stringify(input.userPreferences || {})}

Lacunes à combler prioritairement :
${JSON.stringify(input.identifiedGaps || [
  "Tarification & Packages (Starter, Pro, Elite/VIP)",
  "Témoignages & Études de cas crédibles",
  "Garantie Inconditionnelle & Inversion du Risque",
  "Détail précis des livrables (Stack d'offre)",
  "Stratégie d'acquisition de trafic ciblée",
  "Délai et échéancier des résultats promis"
])}

Génère une stratégie commerciale ultra-détaillée et immédiatement exploitable.
Réponds STRICTEMENT en format JSON valide selon le contrat suivant :

{
  "status": "success",
  "agent": "StrategyRefinementAgent",
  "summary": "Stratégie de conversion 360° enrichie",
  "data": {
    "product_name": "Nom accrocheur et positionné de l'offre",
    "positioning_statement": "Phrase de positionnement unique",
    "pricing_packages": [
      {
        "name": "Starter / Standard",
        "price": "Prix (ex: 490€ ou 97€/mois)",
        "target": "À qui s'adresse ce palier",
        "features": ["Livrable 1", "Livrable 2", "Accès plateforme 30j"],
        "is_popular": false
      },
      {
        "name": "Pro / Accompagnement (Recommandé)",
        "price": "Prix (ex: 1 490€ ou 290€/mois)",
        "target": "Pour ceux qui veulent des résultats rapides",
        "features": ["Tout le Starter", "Coaching 1-to-1", "Templates exclusifs", "Support prioritaire 7j/7"],
        "is_popular": true
      },
      {
        "name": "Elite / VIP Mastermind",
        "price": "Prix (ex: 3 900€)",
        "target": "Pour une prise en charge sur-mesure",
        "features": ["Accompagnement Done-For-You", "Accès direct WhatsApp", "Garantie doublée"],
        "is_popular": false
      }
    ],
    "guarantee": {
      "title": "Titre de la garantie (ex: Garantie Sérénité 30 Jours 'Satisfait ou Remboursé Intégral')",
      "duration_days": 30,
      "risk_reversal_pitch": "Texte persuasif qui élimine 100% du risque pour l'acheteur",
      "conditions": "Conditions claires et éthiques"
    },
    "case_studies_testimonials": [
      {
        "client_name": "Prénom Nom, Fonction/Entreprise",
        "before_state": "Situation de blocage ou douleur initiale",
        "results_achieved": "Chiffres et métriques concrets obtenus (ex: +14 500€ en 28 jours)",
        "quote": "Citation puissante du client sur l'expérience vécue",
        "rating": 5
      },
      {
        "client_name": "Prénom Nom, Secteur",
        "before_state": "Problème précis rencontré",
        "results_achieved": "Résultats chiffrés obtenus",
        "quote": "Citation de validation sociale",
        "rating": 5
      },
      {
        "client_name": "Prénom Nom, Profil",
        "before_state": "Hésitations initiales",
        "results_achieved": "Succès marquant",
        "quote": "Recommandation chaleureuse",
        "rating": 5
      }
    ],
    "deliverables_stack": [
      {
        "item": "Nom du composant / livrable",
        "description": "Ce qu'il contient et le problème qu'il résout",
        "perceived_value": "Valeur perçue estimée (ex: 990€)"
      }
    ],
    "traffic_strategy": {
      "recommended_channels": ["Meta Ads", "Google Search", "LinkedIn Outbound", "TikTok/Shorts Organique"],
      "primary_hook_angles": ["Accroche publicitaire 1", "Accroche publicitaire 2", "Angle contre-intuitif 3"],
      "estimated_cpa_benchmark": "Estimation coût d'acquisition indicatif"
    },
    "expected_timeline": {
      "first_wins_days": "Délai premiers résultats tangibles (ex: 7 à 14 jours)",
      "full_roi_days": "Délai retour sur investissement complet (ex: 45 à 60 jours)",
      "milestones": [
        { "phase": "Semaine 1", "objective": "Mise en place et diagnostic" },
        { "phase": "Semaine 2-4", "objective": "Lancement et premières conversions" },
        { "phase": "Mois 2+", "objective": "Optimisation et passage à l'échelle" }
      ]
    },
    "enriched_master_brief": "Brief complet ultra-détaillé intégrant toutes ces briques, rédigé prêt à être passé au générateur de tunnel"
  }
}
`,
  });

  const responseText = response.text || "";
  const parsed = parseJsonResponse(responseText);
  return {
    success: true,
    data: parsed.data || parsed,
    raw: responseText,
  };
}
