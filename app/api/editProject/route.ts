import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const formData = await request.formData();

  const referer = request.headers.get("referer");

  if (!referer) {
    return NextResponse.json({ error: "Referer manquant" }, { status: 400 });
  }

  const id = referer.split("/").filter(Boolean).pop();

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const name = formData.get("name");
  const description = formData.get("description");

  const modifRes = await fetch(`http://localhost:8000/projects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  const modifJson = await modifRes.json();

  if (!modifRes.ok) {
    return NextResponse.json({ error: "Erreur de modification de projet", details: modifJson }, { status: modifRes.status });
  }

  return NextResponse.json({
    success: true,
    message: "Projet modifié avec succès",
  });
}
