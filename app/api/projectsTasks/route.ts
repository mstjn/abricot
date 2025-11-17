import { NextRequest, NextResponse } from "next/server";
import { getProjectsWithTasks } from "../api";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const data = await getProjectsWithTasks(token);

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
