import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const formData = await request.formData();
  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const content = formData.get("content");
  const projectId = formData.get("projectId");
  const taskId = formData.get("taskId");

  const creationRes = await fetch(`http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
     content
    }),
  });

  const creationJson = await creationRes.json();

  if (!creationRes.ok) {
    return NextResponse.json({ error: "Erreur création de commentaire", details: creationJson }, { status: creationRes.status });
  }

  return NextResponse.json({
    success: true,
    message: "Commentaire crée avec succès",
  });
}
