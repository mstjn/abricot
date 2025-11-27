import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const formData = await request.formData();
  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }
  const projectId = formData.get("projectId");
  const taskId = formData.get("taskId");
  const commentId = formData.get("commentId");

  const deleteRes = await fetch(`http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const deleteJson = await deleteRes.json();

  if (!deleteRes.ok) {
    return NextResponse.json({ error: "Erreur création de commentaire", details: deleteJson }, { status: deleteRes.status });
  }

  return NextResponse.json({
    success: true,
    message: "Commentaire supprimé avec succès",
  });
}
