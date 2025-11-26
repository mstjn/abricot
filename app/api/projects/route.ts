import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "../api";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const data = await getProjects(token);    
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
