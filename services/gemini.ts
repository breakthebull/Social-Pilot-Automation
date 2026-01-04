
import { GoogleGenAI, Type } from "@google/genai";
import { Settings, Post, Campaign, Persona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const calculateAge = (birthday?: string) => {
  if (!birthday) return 'unknown';
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const generatePosts = async (
  settings: Settings, 
  recentPosts: Post[],
  campaigns: Campaign[] = [], 
  selectedPillars?: string[]
) => {
  const count = 5;
  
  const historyContext = recentPosts
    .slice(0, 10)
    .map(p => `- ${p.topic}: ${p.content.substring(0, 100)}...`)
    .join('\n');

  const pillarDetails = settings.contentPillars
    .map(p => `- ${p.name}: ${p.description}`)
    .join('\n');

  const focusPillarsStr = selectedPillars && selectedPillars.length > 0 
    ? `Focus ONLY on these specific pillars for this batch: ${selectedPillars.join(', ')}`
    : `Use these rotating pillars as the primary content themes:\n${pillarDetails}`;

  // Helper to get persona by ID
  const getPersona = (id: string) => settings.personas.find(p => p.id === id) || settings.personas[0];

  const campaignInstructions = campaigns.map((c, i) => {
    const p = getPersona(c.personaId);
    const age = calculateAge(p.birthday);
    return `POST #${i + 1}:
    - Persona: ${p.displayName} (Age: ${age}, MBTI: ${p.mbti}, Zodiac: ${p.zodiac}, Tone: ${p.tone})
    - Goal/Instruction: ${c.text}
    - This post must strictly reflect this persona's voice and this specific goal.`;
  }).join('\n\n');

  const prompt = `
    Act as a social media expert. Generate exactly ${count} posts for Facebook.
    Return the response ONLY as a JSON array of objects with "content", "topic", and "personaId" keys.
    
    BRAND CONTEXT:
    - Brand: ${settings.brandName}
    - Mission: ${settings.brandMission}
    - Audience: ${settings.targetAudience}
    - Style Guide: ${settings.styleGuide}

    CONTENT STRATEGY:
    ${focusPillarsStr}

    SPECIFIC BATCH INSTRUCTIONS:
    ${campaignInstructions || "Generate general high-engagement posts using the default persona: " + settings.personas[0].displayName}

    STRICT REPETITION AVOIDANCE:
    ${historyContext || "No previous history."}

    RULES:
    1. Max 400 characters per post.
    2. Strong scroll-stopping hook.
    3. Clear CTA.
    4. Exactly 5-7 hashtags.
    5. Ensure "personaId" in JSON matches the persona used for that post.
  `;

  if (settings.aiEngine === 'openrouter' && settings.openRouterKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${settings.openRouterKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "SocialPilot AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: settings.openRouterModel || "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error(`OpenRouter API error: ${response.statusText}`);
      const data = await response.json();
      const cleanJson = data.choices[0].message.content.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return Array.isArray(parsed) ? parsed : (parsed.posts || parsed.results || []);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              topic: { type: Type.STRING },
              personaId: { type: Type.STRING }
            },
            required: ["content", "topic", "personaId"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
