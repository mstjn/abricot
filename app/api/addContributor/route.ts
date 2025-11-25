import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const referer = request.headers.get("referer");
  const email = await request.text();
  
  if (!email) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }


  if (!referer) {
    return NextResponse.json({ error: "Referer manquant" }, { status: 400 });
  }

  const id = referer.split("/").filter(Boolean).pop();

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const addRes = await fetch(`http://localhost:8000/projects/${id}/contributors`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const addContributor = await addRes.json();

  if (!addRes.ok) {
    return NextResponse.json({ error: "Erreur d'ajout de contributeur", details: addContributor }, { status: addRes.status });
  }

  return NextResponse.json({
    success: true,
    message: "Contributeur ajouté avec succès",
  });
}
