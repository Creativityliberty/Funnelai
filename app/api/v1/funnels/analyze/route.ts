import { NextRequest, NextResponse } from "next/server";
import { analyzeOfferIntent } from "@/lib/services/funnel-orchestrator";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, templateId } = body;

    if (!request || typeof request !== "string" || !request.trim()) {
      return NextResponse.json(
        { success: false, error: "Le champ 'request' (description de l'offre) est obligatoire." },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await analyzeOfferIntent(request, templateId);
    const d = result.data || {};

    const analysis = {
      productName: d.product_name || "Offre commerciale",
      targetAudience: d.suspected_audience || "Prospects qualifiés",
      coreOffer: d.product_name ? `${d.product_name} (${d.price || "Sur devis"})` : request,
      valueProposition: d.core_promise || "Transformation et résultats à fort impact",
      positioning: d.market_category || d.offer_type || "Positionnement haut de gamme",
      painPoints: [
        "Manque de clarté dans le processus d'acquisition actuel",
        "Taux de conversion insuffisant sur les offres classiques",
        "Difficulté à susciter l'urgence et la confiance immédiate",
      ],
      desires: [
        d.core_promise || "Atteindre des résultats prévisibles et rentables",
        "Automatiser la conversion avec une expérience client Luxe",
        "Décupler la valeur perçue de l'offre auprès de la cible",
      ],
      objections: [
        "Est-ce adapté à mon niveau ou secteur d'activité ?",
        "Quel est le délai pour observer un retour sur investissement ?",
        "Existe-t-il une garantie de résultat ou de satisfaction ?",
      ],
      benefits: [
        "Architecture narrative en 15 étapes de conversion psychologique",
        "Design System Luxe et ergonomie responsive sans compromis",
        "Copywriting persuasif orienté action et levée d'objections",
      ],
      conversionStrategy: `Tunnel de type ${d.funnel_type || "sales_page"} calibré pour ${d.primary_goal || "la conversion directe"} avec appel à l'action "${d.cta_goal || "Obtenir un accès prioritaire"}"`,
      funnelType: d.funnel_type || "sales_page",
      recommendedTemplate: result.template?.id || templateId || "coaching-high-ticket",
    };

    return NextResponse.json(
      {
        success: true,
        analysis,
        data: d,
        template: result.template,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("API /api/v1/funnels/analyze error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Erreur interne lors de l'analyse de l'offre.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
