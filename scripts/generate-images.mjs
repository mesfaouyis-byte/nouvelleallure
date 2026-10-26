import { GoogleGenAI } from "@google/genai";
import { writeFile } from "node:fs/promises";
const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: {
    baseUrl: process.env.NETLIFY_AI_GATEWAY_URL?.replace(/\/$/, ""),
  },
});
const tasks = [
  [
    "hero",
    "Wide landscape premium fashion editorial photograph, 16:9. Elegant Moroccan woman with dark hair wearing a flowing ivory satin blouse, camel tailored trousers and fine black belt, standing on the RIGHT half of frame in a sunlit Marrakech courtyard, warm beige stucco wall and olive tree shadows, left half plain warm taupe shaded wall with ample negative space for white text overlay. Quiet luxury, natural warm light, realistic photography, sophisticated magazine campaign, no text, no logo.",
  ],
  [
    "boots",
    "Premium studio fashion product photo of a pair of dark chocolate brown suede ankle boots with block heels, beige seamless background, soft natural shadow, portrait composition, no text.",
  ],
  [
    "bag",
    "Premium studio fashion product photograph of a structured caramel brown leather handbag with minimal gold hardware on warm ivory stone plinth, beige background, portrait composition, no text.",
  ],
  [
    "coat",
    "Premium fashion editorial photograph of woman wearing a long camel tailored coat and ivory trousers, cropped at neck, beige architectural background, portrait composition, no text.",
  ],
  [
    "heels",
    "Premium studio fashion product photograph of elegant black leather pointed toe slingback shoes with small heels on warm beige background, portrait composition, no text.",
  ],
];
await Promise.all(
  tasks.map(async ([name, prompt]) => {
    try {
      const r = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: prompt,
      });
      const p = r.candidates?.[0]?.content?.parts?.find((x) => x.inlineData);
      if (!p) throw Error("No image");
      await writeFile(
        `public/img/${name}.png`,
        Buffer.from(p.inlineData.data, "base64"),
      );
      console.log(`Saved ${name}`);
    } catch {
      console.log(`Image generation failed: ${name}`);
    }
  }),
);
