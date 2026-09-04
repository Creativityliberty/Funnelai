export interface ComponentDefinition {
  id: string;
  name: string;
  category: 'header' | 'hero' | 'social-proof' | 'problem' | 'solution' | 'how-it-works' | 'differentiation' | 'offer' | 'bonuses' | 'pricing' | 'testimonials' | 'guarantee' | 'about' | 'scarcity' | 'faq' | 'footer';
  html: string;
  description: string;
}

export const MARCEL_COMPONENT_LIBRARY: ComponentDefinition[] = [
  {
    id: 'header-minimal-luxe',
    name: 'Header Luxe Épuré',
    category: 'header',
    description: 'En-tête épuré avec logo de marque, badge de statut et lien de contact direct.',
    html: `
<header class="funnel-header">
  <div class="container header-container">
    <div class="logo-area">
      <span class="logo-mark">✦</span>
      <span class="logo-text">{{product_name}}</span>
    </div>
    <div class="header-action">
      <span class="spots-badge"><span class="pulse-dot"></span> Places Limitées</span>
      <a href="#offer" class="header-cta">Réserver Maintenant</a>
    </div>
  </div>
</header>`
  },
  {
    id: 'hero-split-luxury',
    name: 'Hero Split 7-Figures',
    category: 'hero',
    description: 'Hero section à conversion maximale avec pré-titre doré, H1 percutant, subheadline, double CTA et visuel Hero cadré.',
    html: `
<section class="section hero-section">
  <div class="container hero-grid">
    <div class="hero-content">
      <div class="preheadline-badge">{{hero.preheadline}}</div>
      <h1 class="hero-headline">{{hero.headline}}</h1>
      <p class="hero-subheadline">{{hero.subheadline}}</p>
      <div class="cta-group">
        <a href="#offer" class="btn btn-primary btn-glow">{{hero.cta}}</a>
        <a href="#how-it-works" class="btn btn-secondary">Découvrir le Système ↓</a>
      </div>
      <div class="hero-guarantee-note">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>{{hero.guarantee}}</span>
      </div>
    </div>
    <div class="hero-media">
      <div class="media-card-glass">
        <img id="hero-img" src="[heroImage]" alt="{{product_name}}" class="hero-img" />
        <div class="floating-badge">
          <span class="badge-icon">★</span>
          <div class="badge-text">
            <strong>Résultat Prouvé</strong>
            <small>Accompagnement Garanti</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'social-proof-logos',
    name: 'Bandeau Logos & Notoriété',
    category: 'social-proof',
    description: 'Bandeau de crédibilité avec cibles accompagnées et médias de référence.',
    html: `
<section class="section-logos">
  <div class="container text-center">
    <p class="logos-title">{{logos_section.title}}</p>
    <div class="logos-grid">
      <!-- Repetition of client profiles / authority badges -->
      <div class="logo-pill">Dirigeants & CEOs</div>
      <div class="logo-pill">Fondateurs de Startups</div>
      <div class="logo-pill">Entrepreneurs & Indépendants</div>
      <div class="logo-pill">Leaders de Divisions</div>
    </div>
  </div>
</section>`
  },
  {
    id: 'problem-agitation-cards',
    name: 'Agitation du Problème & Empathie',
    category: 'problem',
    description: 'Déconstruction des douleurs profondes, sentiment d isolement et blocages majeurs.',
    html: `
<section class="section problem-section" id="problem">
  <div class="container">
    <div class="section-header text-center">
      <span class="section-tag section-tag-warning">Le Constat Actuel</span>
      <h2 class="section-title">{{problem_section.headline}}</h2>
      <p class="section-subtitle">{{problem_section.subheadline}}</p>
    </div>
    <div class="empathy-card">
      <div class="empathy-quote-icon">“</div>
      <p class="empathy-text">{{problem_section.empathy_text}}</p>
    </div>
    <div class="pain-points-grid">
      <!-- Pain point cards with caution markers -->
      <div class="pain-card">
        <div class="pain-card-indicator">✕</div>
        <p class="pain-card-text">{{problem_section.pain_point_1}}</p>
      </div>
      <div class="pain-card">
        <div class="pain-card-indicator">✕</div>
        <p class="pain-card-text">{{problem_section.pain_point_2}}</p>
      </div>
      <div class="pain-card">
        <div class="pain-card-indicator">✕</div>
        <p class="pain-card-text">{{problem_section.pain_point_3}}</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'solution-comparison-reveal',
    name: 'Révélation Solution (Old vs New Way)',
    category: 'solution',
    description: 'Tableau comparatif radical entre les méthodes obsolètes et la nouvelle voie éprouvée.',
    html: `
<section class="section solution-section" id="solution">
  <div class="container">
    <div class="section-header text-center">
      <span class="section-tag section-tag-success">La Rupture Stratégique</span>
      <h2 class="section-title">{{solution_section.headline}}</h2>
    </div>
    <div class="comparison-grid">
      <div class="comparison-card card-old-way">
        <div class="comparison-header">
          <span class="comparison-badge badge-danger">L'Ancienne Voie</span>
          <h3>Pourquoi les approches classiques échouent</h3>
        </div>
        <p class="comparison-description">{{solution_section.old_way_fail}}</p>
        <ul class="comparison-list list-danger">
          <li>Théorie sans implémentation sur-mesure</li>
          <li>Temps et budget gaspillés sans garantie</li>
          <li>Isolement face aux blocages opérationnels</li>
        </ul>
      </div>
      <div class="comparison-card card-new-way">
        <div class="comparison-header">
          <span class="comparison-badge badge-success">Notre Nouvelle Méthode</span>
          <h3>Le Véhicule d'Accélération Supérieur</h3>
        </div>
        <p class="comparison-description">{{solution_section.new_way_success}}</p>
        <ul class="comparison-list list-success">
          <li>Stratégie chirurgicale adaptée à votre réalité</li>
          <li>Plan d'action orienté résultats concrets et ROI</li>
          <li>Accompagnement continu jusqu'au succès</li>
        </ul>
      </div>
    </div>
    <div class="dream-destination-banner">
      <p><strong>La Destination Finale :</strong> {{solution_section.dream_destination}}</p>
    </div>
  </div>
</section>`
  },
  {
    id: 'how-it-works-timeline',
    name: 'Processus en 3 Étapes (Timeline)',
    category: 'how-it-works',
    description: 'Roadmap étape par étape montrant la clarté et la rapidité d exécution.',
    html: `
<section class="section how-it-works-section" id="how-it-works">
  <div class="container">
    <div class="section-header text-center">
      <span class="section-tag">Feuille de Route</span>
      <h2 class="section-title">{{how_it_works.vehicle_name}}</h2>
      <p class="section-subtitle">Un plan de déploiement en 3 phases chronologiques pour garantir chaque étape.</p>
    </div>
    <div class="timeline-grid">
      <div class="timeline-card">
        <div class="step-number">01</div>
        <h3 class="step-title">Phase 1 : Diagnostic &amp; Alignement</h3>
        <p class="step-description">Audit complet, identification des leviers critiques et définition des objectifs chiffrés.</p>
      </div>
      <div class="timeline-card timeline-card-active">
        <div class="step-number">02</div>
        <h3 class="step-title">Phase 2 : Déploiement &amp; Optimisation</h3>
        <p class="step-description">Activation des leviers à fort impact, ajustements tactiques et premiers résultats tangibles.</p>
      </div>
      <div class="timeline-card">
        <div class="step-number">03</div>
        <h3 class="step-title">Phase 3 : Pérennisation &amp; Passage à l'Échelle</h3>
        <p class="step-description">Consolidation des gains, autonomisation des processus et expansion des rendements.</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'main-offer-value-stack',
    name: 'Stack d Offre & Valeur Décuplée',
    category: 'offer',
    description: 'Présentation de l offre maîtresse avec empilement de valeur irrésistible.',
    html: `
<section class="section offer-section" id="offer">
  <div class="container">
    <div class="offer-box-glow">
      <div class="offer-header text-center">
        <span class="offer-badge">Offre Clé en Main Exceptionnelle</span>
        <h2 class="offer-name">{{main_offer.name}}</h2>
        <p class="offer-description">{{main_offer.description}}</p>
      </div>
      <div class="value-stack-container">
        <h4 class="stack-title">Voici Tout Ce Qui Est Inclus Immédiatement :</h4>
        <div class="stack-list">
          <!-- Value stack items -->
          <div class="stack-item">
            <span class="check-icon">✓</span>
            <div class="stack-item-content">
              <strong>Accompagnement Stratégique Privé Complet</strong>
              <p>Chaque session est dédiée à débloquer vos points critiques.</p>
            </div>
          </div>
          <div class="stack-item">
            <span class="check-icon">✓</span>
            <div class="stack-item-content">
              <strong>Boîte à Outils &amp; Systèmes Clés en Main</strong>
              <p>Modèles, processus opérationnels et cadres d'exécution prêts à l'emploi.</p>
            </div>
          </div>
          <div class="stack-item">
            <span class="check-icon">✓</span>
            <div class="stack-item-content">
              <strong>Assistance Prioritaire &amp; Suivi Direct</strong>
              <p>Vos questions résolues sans attendre pour ne jamais perdre l'élan.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="pricing-summary-card text-center">
        <div class="price-strike-wrapper">
          <span class="label-normal">Valeur réelle totale :</span>
          <span class="price-strikethrough">{{main_offer.normal_price}}</span>
        </div>
        <div class="price-special-wrapper">
          <span class="label-special">Tarif Spécial Aujourd'hui :</span>
          <div class="price-number">{{main_offer.special_price}}</div>
        </div>
        <a href="#pricing" class="btn btn-primary btn-lg btn-glow">Valider Mon Inscription Maintenant →</a>
        <p class="price-disclaimer">Paiement sécurisé crypté SSL • Accès immédiat</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'bonuses-grid-cards',
    name: 'Grille de Bonus Offerts',
    category: 'bonuses',
    description: 'Grille de bonus à forte valeur perçue offerts pour accélérer la décision.',
    html: `
<section class="section bonuses-section">
  <div class="container">
    <div class="section-header text-center">
      <span class="section-tag section-tag-gold">Cadeaux Exclusifs</span>
      <h2 class="section-title">Bonus Inclus Si Vous Rejoignez Aujourd'hui</h2>
      <p class="section-subtitle">Ces ressources complémentaires sont offertes pour maximiser votre vitesse de progression.</p>
    </div>
    <div class="bonuses-grid">
      <div class="bonus-card">
        <div class="bonus-pill">Bonus Offert #1</div>
        <h3 class="bonus-title">Masterclass Stratégique &amp; Cas Pratiques</h3>
        <p class="bonus-desc">Étude pas à pas des meilleures implémentations réelles pour dupliquer les réussites.</p>
      </div>
      <div class="bonus-card">
        <div class="bonus-pill">Bonus Offert #2</div>
        <h3 class="bonus-title">Templates &amp; Scripts d'Exécution Immédiate</h3>
        <p class="bonus-desc">Gagnez des semaines de travail avec nos canevas prêts à personnaliser.</p>
      </div>
      <div class="bonus-card">
        <div class="bonus-pill">Bonus Offert #3</div>
        <h3 class="bonus-title">Accès Réseau Privé &amp; Veille Stratégique</h3>
        <p class="bonus-desc">Connectez-vous à un cercle d'ambitieux partageant les mêmes standards d'excellence.</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'testimonials-social-proof',
    name: 'Témoignages & Preuves Chiffrées',
    category: 'testimonials',
    description: 'Cartes de témoignages clients avec notes 5 étoiles, citations fortes et résultats concrets.',
    html: `
<section class="section testimonials-section" id="testimonials">
  <div class="container">
    <div class="section-header text-center">
      <span class="section-tag">Résultats Vérifiés</span>
      <h2 class="section-title">Ce Que Disent Ceux Qui L'Ont Vécu</h2>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <p class="testimonial-quote">« Un retour sur investissement multiplié en quelques semaines. La méthode est d'une clarté absolue et l'impact a été immédiat sur nos chiffres. »</p>
        <div class="testimonial-author">
          <strong>Marc D.</strong>
          <span>CEO &amp; Fondateur</span>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <p class="testimonial-quote">« Fini les approximations. Nous avons débloqué une sérénité et une rentabilité que nous cherchions depuis plus de 2 ans. »</p>
        <div class="testimonial-author">
          <strong>Sophie L.</strong>
          <span>Directrice Générale</span>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <p class="testimonial-quote">« Le niveau d'exigence et la pertinence des conseils font toute la différence. C'est l'investissement le plus rentable de mon année. »</p>
        <div class="testimonial-author">
          <strong>Alexandre B.</strong>
          <span>Entrepreneur</span>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'guarantee-risk-reversal',
    name: 'Sceau de Garantie Inconditionnelle',
    category: 'guarantee',
    description: 'Inversion totale du risque avec badge de confiance et engagement formel.',
    html: `
<section class="section guarantee-section">
  <div class="container">
    <div class="guarantee-box">
      <div class="guarantee-seal">
        <div class="seal-inner">100%<br>GARANTI</div>
      </div>
      <div class="guarantee-content">
        <span class="guarantee-tag">Zéro Risque Pour Vous</span>
        <h2 class="guarantee-headline">{{guarantee_section.headline}}</h2>
        <p class="guarantee-text">{{guarantee_section.text}}</p>
        <p class="guarantee-commitment">Si vous n'êtes pas absolument enthousiasmé par la valeur apportée, vous êtes intégralement remboursé sur simple demande. Tout le risque repose sur nos épaules.</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'scarcity-urgency-timer',
    name: 'Urgence & Compte à Rebours Interactif',
    category: 'scarcity',
    description: 'Compte à rebours animé en direct avec jauge de disponibilité des places.',
    html: `
<section class="section scarcity-section">
  <div class="container text-center">
    <span class="scarcity-pill">Disponibilité Strictement Limitée</span>
    <h2 class="scarcity-headline">{{scarcity_section.headline}}</h2>
    <p class="scarcity-text">{{scarcity_section.text}}</p>
    <div class="countdown-container">
      <div class="countdown-unit">
        <span class="countdown-number" id="timer-hours">02</span>
        <span class="countdown-label">Heures</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-unit">
        <span class="countdown-number" id="timer-minutes">45</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-unit">
        <span class="countdown-number" id="timer-seconds">12</span>
        <span class="countdown-label">Secondes</span>
      </div>
    </div>
    <div class="spots-counter-bar">
      <div class="progress-track"><div class="progress-fill" style="width: 82%;"></div></div>
      <p class="spots-text">Seulement <strong>3 places</strong> disponibles pour la prochaine session.</p>
    </div>
    <a href="#offer" class="btn btn-primary btn-glow">Sécuriser Ma Place Avant Clôture →</a>
  </div>
</section>`
  },
  {
    id: 'faq-interactive-accordion',
    name: 'Accordéon FAQ Intelligent',
    category: 'faq',
    description: 'Accordéon interactif qui élimine les objections majeures avec animation fluide.',
    html: `
<section class="section faq-section" id="faq">
  <div class="container max-w-narrow">
    <div class="section-header text-center">
      <span class="section-tag">Transparence Totale</span>
      <h2 class="section-title">Foire Aux Questions</h2>
      <p class="section-subtitle">Toutes les réponses à vos questions légitimes avant de démarrer.</p>
    </div>
    <div class="faq-accordion">
      <div class="faq-item">
        <button class="faq-question">
          <span>À qui s'adresse précisément ce programme ?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>Ce programme s'adresse aux personnes et entreprises motivées qui souhaitent des résultats rapides, mesurables et durables sans perdre de temps avec des théories inutiles.</p>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question">
          <span>Combien de temps faut-il consacrer par semaine ?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>Comptez environ 2 à 3 heures par semaine pour appliquer les étapes méthodiques sans surcharger votre emploi du temps habituel.</p>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question">
          <span>Que se passe-t-il après la validation de ma commande ?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>Vous recevez instantanément vos identifiants d'accès, votre feuille de route de démarrage ainsi que la confirmation de votre première session d'alignement.</p>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question">
          <span>Comment fonctionne la garantie de remboursement ?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>Notre garantie est inconditionnelle : si après avoir suivi les premières étapes vous n'êtes pas satisfait, un simple e-mail suffit pour être intégralement remboursé.</p>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: 'footer-luxury-trust',
    name: 'Pied de Page Haute Conversion & Sécurité',
    category: 'footer',
    description: 'Footer de confiance avec garanties légales, badges SSL et copyright.',
    html: `
<footer class="funnel-footer">
  <div class="container footer-container text-center">
    <div class="footer-trust-badges">
      <span class="trust-badge">🔒 Paiement Sécurisé 256-Bit SSL</span>
      <span class="trust-badge">⚡ Accès Instantané</span>
      <span class="trust-badge">🛡️ Garantie Sérénité</span>
    </div>
    <div class="footer-links">
      <a href="#">Mentions Légales</a>
      <a href="#">Politique de Confidentialité</a>
      <a href="#">Conditions Générales de Vente</a>
      <a href="#">Support Client</a>
    </div>
    <p class="footer-copyright">{{footer.copyright}}</p>
    <p class="footer-disclaimer">Les résultats présentés sont basés sur des retours d'expérience vérifiés. Les performances individuelles dépendent de l'application rigoureuse des méthodes transmises.</p>
  </div>
</footer>`
  }
];
