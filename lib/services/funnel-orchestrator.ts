import { offerIntentAgent } from "@/agents/offer_intent_agent";
import { funnelStructureAgent } from "@/agents/funnel_structure_agent";
import { copywritingExpertAgent } from "@/agents/copywriting_expert_agent";
import { imagePromptAgent } from "@/agents/image_prompt_agent";
import { headlineCopyAgent } from "@/agents/headline_copy_agent";
import { layoutHierarchyAgent } from "@/agents/layout_hierarchy_agent";
import { spacingRhythmAgent } from "@/agents/spacing_rhythm_agent";
import { brandContrastAgent } from "@/agents/brand_contrast_agent";
import { imageDirectionAgent } from "@/agents/image_direction_agent";
import { proofNumbersAgent } from "@/agents/proof_numbers_agent";
import { interactionMotionAgent } from "@/agents/interaction_motion_agent";
import { frontendAssemblyAgent } from "@/agents/frontend_assembly_agent";
import { imageGenerationAgent } from "@/agents/image_generation_agent";
import { strategyRefinementAgent, StrategyRefinementInput } from "@/agents/strategy_refinement_agent";
import { sandboxModifierAgent, SandboxModifierInput } from "@/agents/sandbox_modifier_agent";
import { TEMPLATES, Template } from "@/lib/templates";

export interface FunnelGenerationOptions {
  request: string;
  templateId?: string;
  brandingOverrides?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  generateHeroImage?: boolean;
}

export interface FunnelGenerationResult {
  intent: any;
  structure: any;
  copy: any;
  imagePrompts: any;
  headline: any;
  layout: any;
  spacing: any;
  branding: any;
  images: any;
  proof: any;
  interaction: any;
  frontend: any;
  heroImage?: string;
  template?: Template | null;
}

export async function analyzeOfferIntent(request: string, templateId?: string) {
  const template = templateId ? TEMPLATES.find((t) => t.id === templateId) || null : null;
  const intentRes = await offerIntentAgent(request, template);
  return {
    success: true,
    data: intentRes.data || intentRes,
    template,
  };
}

export async function refineFunnelStrategy(input: StrategyRefinementInput) {
  return await strategyRefinementAgent(input);
}

export async function generateCustomImage(options: {
  prompt?: string;
  style?: string;
  aspectRatio?: string;
  intent?: any;
  branding?: any;
}) {
  return await imageGenerationAgent(options);
}

export async function modifyFunnelSandbox(input: SandboxModifierInput) {
  return await sandboxModifierAgent(input);
}

export async function generateFullFunnel(options: FunnelGenerationOptions): Promise<FunnelGenerationResult> {
  const { request, templateId, brandingOverrides, generateHeroImage = true } = options;
  const template = templateId ? TEMPLATES.find((t) => t.id === templateId) || null : null;

  // 1. Offer Intent
  const intentRes = await offerIntentAgent(request, template);
  const intentData = intentRes.data || intentRes;

  // 2. Funnel Structure
  const structureRes = await funnelStructureAgent(intentData);
  const structureData = structureRes.data || structureRes;

  // 3. Copywriting (Gusten Sun 15 steps)
  const copyRes = await copywritingExpertAgent(intentData);
  const copyData = copyRes.data || copyRes;

  // 4. Prompts & Copy Details
  const imagePromptsRes = await imagePromptAgent({ intent: intentData, copy: copyData });
  const headlineRes = await headlineCopyAgent(structureData);
  const layoutRes = await layoutHierarchyAgent(structureData);
  const spacingRes = await spacingRhythmAgent(layoutRes.data || layoutRes);
  const brandRes = await brandContrastAgent(intentData);
  const imageRes = await imageDirectionAgent(intentData);
  const proofRes = await proofNumbersAgent(intentData);
  const interactionRes = await interactionMotionAgent(layoutRes.data || layoutRes);

  // 5. Image Hero Generation (Optional)
  let heroImageUrl: string | undefined = undefined;
  if (generateHeroImage) {
    try {
      const heroPrompt = imagePromptsRes?.data?.hero_image?.prompt;
      const imgRes = await imageGenerationAgent({
        prompt: heroPrompt,
        intent: intentData,
        branding: brandRes.data || brandRes,
        style: imagePromptsRes?.data?.hero_image?.style,
      });
      if (imgRes.success && imgRes.data?.imageUrl) {
        heroImageUrl = imgRes.data.imageUrl;
      }
    } catch (err) {
      console.warn("Hero image generation skipped or failed:", err);
    }
  }

  // 6. Frontend Assembly
  const frontendRes = await frontendAssemblyAgent({
    intent: intentData,
    structure: structureData,
    copy: copyData,
    imagePrompts: imagePromptsRes.data || imagePromptsRes,
    headline: headlineRes.data || headlineRes,
    layout: layoutRes.data || layoutRes,
    spacing: spacingRes.data || spacingRes,
    branding: brandRes.data || brandRes,
    images: imageRes.data || imageRes,
    proof: proofRes.data || proofRes,
    interaction: interactionRes.data || interactionRes,
    hasHeroImage: !!heroImageUrl,
    template: template,
    brandingOverrides: brandingOverrides,
  });

  return {
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
    heroImage: heroImageUrl,
    template,
  };
}
