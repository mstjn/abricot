import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const referer = request.headers.get("referer");
  if (!referer) {
    return NextResponse.json({ error: "Referer manquant" }, { status: 400 });
  }
  const id = referer.split("/").filter(Boolean).pop();

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const deleteRes = await fetch(`http://localhost:8000/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });

  const deleteJson = await deleteRes.json();

  if (!deleteRes.ok) {
    return NextResponse.json({ error: "Erreur de suppression de projet", details: deleteJson }, { status: deleteRes.status });
  }

  return NextResponse.json({
    success: true,
    message: "Projet supprimé avec succès",
  });
}
