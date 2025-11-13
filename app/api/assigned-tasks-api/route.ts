import { NextRequest, NextResponse } from "next/server";
import { getAssignedTasksByUser } from "../api";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const tasks = await getAssignedTasksByUser(token);

    return NextResponse.json(tasks ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
