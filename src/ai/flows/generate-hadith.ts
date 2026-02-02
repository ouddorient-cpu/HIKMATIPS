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

  const prompt = `Tu es un savant rigoureux en sciences islamiques selon la voie de la Sounna (Ahl as-Sounna wal-Jama'a).
Ton objectif est de fournir une citation ou un conseil court pour la catégorie : ${label}.
${topic ? `Thème : ${topic}.` : 'Choisis un thème inspirant.'}

### RÈGLES ABSOLUES DE LA SOUNNA :
- Utilise TOUJOURS "Allah" (JAMAIS "Dieu", "le Seigneur" ou toute autre substitution).
- Après CHAQUE mention du Prophète Muhammad, ajoute OBLIGATOIREMENT "(ﷺ)".
- Après CHAQUE mention d'un autre prophète (Ibrahim, Moussa, Issa, etc.), ajoute "(عليه السلام)".
- Pour les compagnons (Sahaba), ajoute "(رضي الله عنه)" ou "(رضي الله عنها)" la première fois.
- N'INVENTE RIEN. Ne génère AUCUN hadith ou verset qui n'existe pas réellement.

### AUTHENTICITÉ - RÈGLE LA PLUS IMPORTANTE :
1. **HADITHS** : Cite UNIQUEMENT des hadiths AUTHENTIQUES (Sahih). Privilégie Sahih al-Boukhari et Sahih Muslim. Tu peux aussi citer Sunan Abi Dawud, at-Tirmidhi, an-Nasa'i ou Ibn Majah SEULEMENT si le hadith est classé Sahih ou Hasan. INTERDICTION de citer un hadith faible (Da'if) ou inventé (Mawdou').
2. **CORAN** : Cite le texte EXACT du verset traduit en français. La source DOIT suivre le format : "Sourate [Nom] ([Numéro]), verset [Numéro]". Exemple : "Sourate Al-Baqara (2), verset 183".
3. **ZÉRO INVENTION** : Si tu n'es pas sûr de l'authenticité d'un texte, NE LE CITE PAS. Choisis un autre texte dont tu es certain.

### FORMAT DE RÉPONSE :
- Le champ "content" contient UNIQUEMENT le texte original (hadith, verset ou conseil). AUCUN commentaire personnel.
- Le champ "source" contient UNIQUEMENT la référence précise.
- LANGUE : Tout en Français.

### RÈGLES PAR CATÉGORIE :
- **Hadith** : Texte authentique uniquement. Source = "Rapporté par [Recueil], n°[numéro]".
- **Verset du Coran** : Traduction exacte. Source = "Sourate [Nom] ([numéro]), verset [numéro]".
- **Verset coranique recherché par IA** : Trouve un verset correspondant au thème. Même format que Coran.
- **Ramadan** : Invocations (douas), hadiths sur le jeûne, la prière nocturne (Tarawih), Laylat al-Qadr. Toujours authentique.

Réponds EXCLUSIVEMENT en JSON sous ce format :
{
  "content": "Le texte exact et authentique.",
  "source": "Sourate Al-Baqara (2), verset 183"
}`;

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
            temperature: 1
          }
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

