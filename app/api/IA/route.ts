import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content:
            'Tu es une IA spécialisée dans la création de tâches pour une application SaaS. À partir d\'une demande utilisateur, tu dois générer ENTRE 1 ET 10 tâches pertinentes. Tu dois TOUJOURS répondre dans un JSON strict de la forme suivante : { "tasks": [ { "title": "...", "description": "..." } ] }. Le tableau "tasks" doit contenir moins de 10 tâches. Tu ne dois rien renvoyer d\'autre qu\'un JSON strict. STRICTEMENT rien d\'autre que ce JSON.',
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Erreur Mistral" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
