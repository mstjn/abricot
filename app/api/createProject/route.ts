import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const formData = await request.formData();

   if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const name = formData.get('name')
  const description = formData.get('description')

  
  const creationRes = await fetch("http://localhost:8000/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      contributors : []
    }),
  });

  const creationJson = await creationRes.json();

   if (!creationRes.ok) {
    return NextResponse.json(
      { error: "Erreur Mise à jour Profil", details: creationJson },
      { status: creationRes.status }
    );
  }

 return NextResponse.json({
  success: true,
  message: "Projet crée avec succès",
});
}
