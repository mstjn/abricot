import { NextRequest, NextResponse } from "next/server";
import { getProjectsTasks } from "../api";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    // Récupération de l'id dans l'URL
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id") ?? "";
 
    const data = await getProjectsTasks(token, projectId);
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
