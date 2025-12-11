import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const referer = request.headers.get("referer");
  const idUser = await request.text();
  
  if (!idUser) {
    return NextResponse.json({ error: "Id manquant" }, { status: 400 });
  }

  if (!referer) {
    return NextResponse.json({ error: "Referer manquant" }, { status: 400 });
  }

  const id = referer.split("/").filter(Boolean).pop();

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const removeRes = await fetch(`http://localhost:8000/projects/${id}/contributors/${idUser}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });

  const removeContributor = await removeRes.json();

  if (!removeRes.ok) {
    return NextResponse.json({ error: "Erreur de suppression de contributeur", details: removeContributor }, { status: removeRes.status });
  }

  return NextResponse.json({
    success: true,
    message: "Contributeur supprimé avec succès",
  });
}
