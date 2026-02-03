import { z } from 'zod';

const categoryLabels = {
  hadith: 'Hadith',
  ramadan: 'Conseil ou invocation du Ramadan',
  'recherche-ia': 'Verset coranique recherché par IA',
  coran: 'Verset du Coran',
};

export const GenerateHadithInputSchema = z.object({
  category: z.string(),
  topic: z.string().optional(),
});
export type GenerateHadithInput = z.infer<typeof GenerateHadithInputSchema>;

export const GenerateHadithOutputSchema = z.object({
  content: z.string(),
  source: z.string(),
});
export type GenerateHadithOutput = z.infer<typeof GenerateHadithOutputSchema>;

export async function generateHadith(
  input: GenerateHadithInput
): Promise<GenerateHadithOutput> {
  const { category, topic } = input;
  const label = categoryLabels[category as keyof typeof categoryLabels] || category;

  // Use NEXT_PUBLIC_ for client-side access in static export
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey || apiKey === 'VOTRE_CLE_API_ICI') {
    throw new Error("Clé API Gemini manquante. Veuillez configurer NEXT_PUBLIC_GOOGLE_GENAI_API_KEY.");
  }

  // Prompts spécifiques par catégorie pour de meilleurs résultats
  const getPromptByCategory = () => {
    const baseRules = `### RÈGLES OBLIGATOIRES :
- Utilise TOUJOURS "Allah" (JAMAIS "Dieu").
- Après le Prophète Muhammad, ajoute "(ﷺ)".
- LANGUE : Français uniquement.
- Réponds UNIQUEMENT en JSON valide.`;

    if (category === 'hadith') {
      return `Tu es un spécialiste des hadiths authentiques. Donne-moi UN hadith CÉLÈBRE et AUTHENTIQUE.
${topic ? `Thème souhaité : ${topic}` : 'Choisis parmi les thèmes : bonté, patience, prière, parents, science, sincérité, frères en Islam.'}

${baseRules}

### EXEMPLES DE HADITHS AUTHENTIQUES À UTILISER :
- "Les actes ne valent que par les intentions..." (Boukhari 1, Muslim 1907)
- "Aucun de vous ne sera véritablement croyant tant qu'il n'aimera pas pour son frère ce qu'il aime pour lui-même." (Boukhari 13, Muslim 45)
- "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne." (Boukhari 5027)
- "Celui qui croit en Allah et au Jour Dernier, qu'il dise du bien ou qu'il se taise." (Boukhari 6018, Muslim 47)
- "Le Paradis se trouve sous les pieds des mères." (Nasa'i 3104)
- "La propreté fait partie de la foi." (Muslim 223)
- "Le sourire à ton frère est une aumône." (Tirmidhi 1956)

Choisis un hadith CONNU et donne sa référence exacte.

{
  "content": "Le hadith en français",
  "source": "Rapporté par Boukhari, n°XXXX"
}`;
    }

    if (category === 'ramadan') {
      return `Tu es un spécialiste du Ramadan. Donne-moi UN hadith ou UNE invocation AUTHENTIQUE sur le Ramadan.
${topic ? `Thème : ${topic}` : 'Choisis parmi : jeûne, iftar, suhur, Laylat al-Qadr, prière de nuit, récompenses du Ramadan.'}

${baseRules}

### EXEMPLES AUTHENTIQUES SUR LE RAMADAN :
- "Celui qui jeûne le Ramadan avec foi et en espérant la récompense d'Allah, ses péchés passés lui seront pardonnés." (Boukhari 38, Muslim 760)
- "Celui qui prie durant les nuits de Ramadan avec foi et espérance, ses péchés passés lui seront pardonnés." (Boukhari 37, Muslim 759)
- "Quand arrive le Ramadan, les portes du Paradis sont ouvertes, les portes de l'Enfer sont fermées et les démons sont enchaînés." (Boukhari 1899, Muslim 1079)
- "Celui qui donne à manger à un jeûneur pour rompre son jeûne aura la même récompense que lui." (Tirmidhi 807)
- Invocation de rupture du jeûne : "Dhahaba adh-dhama'u, wabtallatil-'urûqu, wa thabatal-ajru in shâ'Allâh" (La soif est partie, les veines sont humides, et la récompense est confirmée si Allah le veut) (Abu Dawud 2357)

{
  "content": "Le hadith ou l'invocation en français",
  "source": "Rapporté par Boukhari, n°XXXX"
}`;
    }

    if (category === 'coran' || category === 'recherche-ia') {
      return `Donne-moi UN verset du Coran en français.
${topic ? `Thème recherché : ${topic}` : 'Choisis un verset inspirant sur : foi, patience, miséricorde, gratitude, ou guidée.'}

${baseRules}

### FORMAT OBLIGATOIRE :
{
  "content": "Le verset traduit en français",
  "source": "Sourate Al-Nom (numéro), verset numéro"
}`;
    }

    return `Donne-moi une citation islamique authentique sur ${topic || 'un thème inspirant'}.
${baseRules}
{
  "content": "Le texte",
  "source": "La source"
}`;
  };

  const prompt = getPromptByCategory();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.7
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Détails erreur Gemini:", errorData);
      throw new Error(errorData.error?.message || "Erreur lors de l'appel à Gemini");
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Réponse vide de Gemini");

    // Nettoyage au cas où l'IA retourne des backticks markdown (```json ... ```)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(text);
      return GenerateHadithOutputSchema.parse(parsed);
    } catch (parseError) {
      console.error("Erreur de parsing JSON. Texte reçu:", text);
      throw new Error("Le format de réponse de l'IA est invalide.");
    }
  } catch (error) {
    console.error("Erreur AI détaillée:", error);
    throw error;
  }
}

