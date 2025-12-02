import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const formData = await request.formData();

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const dueDate = formData.get("dueDate");
  const priority = formData.get("priority");
  const id = formData.get("id");
  const contributors = formData.get("assigneeIds");
  const assigneeIds = contributors ? JSON.parse(contributors as string) : [];

  const creationRes = await fetch(`http://localhost:8000/projects/${id}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      dueDate,
      priority,
      assigneeIds,
    }),
  });

  const creationJson = await creationRes.json();
  
  if (!creationRes.ok) {
    return NextResponse.json({ error: "Erreur création de tâche", details: creationJson }, { status: creationRes.status });
  }

  return NextResponse.json({
    success: true,
    message: "Tâche créee avec succès",
  });
}
