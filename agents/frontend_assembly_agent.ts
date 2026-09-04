import { getAiClient, getActiveTextModel } from "@/lib/ai-client";
import { parseJsonResponse } from "@/lib/json-utils";
import { MARCEL_COMPONENT_LIBRARY } from "@/lib/components-library";

export async function frontendAssemblyAgent(data: any) {
  const ai = getAiClient();
  const template = data.template;
  const branding = data.brandingOverrides || (template ? template.config.branding : {
    primaryColor: '#D4AF37', // Or luxe
    secondaryColor: '#1A1A1A',
    backgroundColor: '#0A0A0A',
    textColor: '#FFFFFF',
    accentColor: '#FFD700',
    fontHeadlines: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans'
  });

  const primaryColor = branding.primaryColor || '#D4AF37';
  const backgroundColor = branding.backgroundColor || '#0A0A0A';
  const textColor = branding.textColor || '#FFFFFF';
  const fontHeadlines = template?.config?.branding?.fontHeadlines || 'Plus Jakarta Sans, sans-serif';
  const fontBody = template?.config?.branding?.fontBody || 'Plus Jakarta Sans, sans-serif';

  const copy = data.copy?.data || data.copy || {};
  const intent = data.intent?.data || data.intent || {};

  const response = await ai.models.generateContent({
    model: getActiveTextModel(),
    contents: `Tu es Senior Frontend Funnel Architect & Luxury UI Designer.
Ta mission absolue est de produire le code HTML, CSS et JS complet d'une page de vente HAUTE CONVERSION (7-Figures Luxe) sans AUCUN raccourci, sans placeholder "..." et avec un niveau de finition irréprochable.

DONNÉES DU PROJET :
- Nom du Produit : "${intent.product_name || 'Offre Exclusive'}"
- Promesse Centrale : "${intent.core_promise || ''}"
- Cible : "${intent.suspected_audience || ''}"
- Couleurs : Primaire ${primaryColor}, Fond ${backgroundColor}, Texte ${textColor}
- Polices : Titres "${fontHeadlines}", Corps "${fontBody}"
- Image Hero disponible : ${data.hasHeroImage ? 'OUI (utilise impérativement src="[heroImage]" avec id="hero-img")' : 'NON'}

COPYWRITING 15 ÉTAPES À INCLURE INTÉGRALEMENT :
${JSON.stringify(copy)}

BIBLIOTHÈQUE DE STRUCTURES DE COMPOSANTS MARCEL (Modèles d'inspiration obligatoire) :
${JSON.stringify(MARCEL_COMPONENT_LIBRARY)}

EXIGENCES TECHNIQUES IMPÉRATIVES :

1. HTML (index_html) :
- Structure sémantique complète et articulée :
  1. <header class="funnel-header"> : Logo et bouton d'action rapide.
  2. <section class="hero-section"> : Pré-titre, H1 percutant, subheadline, double CTA, note de garantie, et l'image Hero <img id="hero-img" src="${data.hasHeroImage ? '[heroImage]' : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80'}" />.
  3. <section class="section-logos"> : Bandeau de crédibilité avec profils ou médias.
  4. <section class="problem-section" id="problem"> : Empathie + 3 cartes de douleurs explicites.
  5. <section class="solution-section" id="solution"> : Comparatif côte-à-côte Old Way vs New Way + destination finale.
  6. <section class="how-it-works-section" id="how-it-works"> : Roadmap en 3 étapes chronologiques avec numéros '01', '02', '03'.
  7. <section class="offer-section" id="offer"> : Stack d'offre complet avec liste à puces '✓', prix barré, prix spécial et CTA principal.
  8. <section class="bonuses-section"> : 3 cartes de bonus offerts avec pastilles "Valeur Offerte".
  9. <section class="testimonials-section" id="testimonials"> : 3 à 4 cartes de témoignages avec 5 étoiles ★★★★★, citation forte et auteur.
  10. <section class="guarantee-section"> : Sceau 100% garanti avec texte d'inversion du risque.
  11. <section class="scarcity-section"> : Compte à rebours (#timer-hours, #timer-minutes, #timer-seconds) et jauge de places restantes.
  12. <section class="faq-section" id="faq"> : 4 à 5 questions/réponses en accordéon interactif (<div class="faq-item"><button class="faq-question">...<span class="faq-icon">+</span></button><div class="faq-answer"><p>...</p></div></div>).
  13. <footer class="funnel-footer"> : Badges de sécurité SSL, liens et copyright.
- Remplis CHAQUE section avec le texte réel du copywriting fourni. Ne laisse aucun lorem ipsum ni champ vide.

2. CSS (styles_css) :
- Variables :root :
  :root {
    --primary: ${primaryColor};
    --primary-glow: ${primaryColor}40;
    --bg-color: ${backgroundColor};
    --surface: #141416;
    --surface-border: rgba(255, 255, 255, 0.08);
    --text: ${textColor};
    --text-muted: #9E9E9E;
    --font-heading: '${fontHeadlines}', sans-serif;
    --font-body: '${fontBody}', sans-serif;
    --radius-lg: 20px;
    --radius-md: 12px;
  }
- Typographie responsive avec clamp() (H1: clamp(2.2rem, 5vw, 3.8rem), H2: clamp(1.8rem, 3.5vw, 2.6rem)).
- Glassmorphism sur les cartes (background: rgba(20, 20, 22, 0.75); backdrop-filter: blur(16px); border: 1px solid var(--surface-border)).
- Boutons .btn-primary avec transition douce, effet de survol lumineux et animation @keyframes pulse subtile.
- Grilles responsives auto-fit (grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))).
- Media queries propres pour mobile (@media (max-width: 768px)).

3. JAVASCRIPT (script_js) :
- FAQ Accordion : interaction au clic sur .faq-question pour ouvrir/fermer avec transition fluide (seule 1 question ouverte à la fois).
- Countdown Timer : compte à rebours dynamique qui décrémente chaque seconde sur #timer-hours, #timer-minutes, #timer-seconds.
- Smooth Scroll : défilement doux vers les ancres #offer, #how-it-works, #faq.
- Scroll Reveal : animation d'apparition progressive via IntersectionObserver sur les classes .reveal.

Réponds STRICTEMENT en format JSON valide selon le contrat :
{
  "status": "success",
  "agent": "FrontendAssemblyAgent",
  "data": {
    "index_html": "CODE_HTML_COMPLET",
    "styles_css": "CODE_CSS_COMPLET",
    "script_js": "CODE_JS_COMPLET"
  }
}
`,
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });

  return parseJsonResponse(response.text);
}
