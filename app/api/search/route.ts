import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query") || "";
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    

    if (!token) {
      return NextResponse.json([], { status: 401 });
    }
console.log(query);

    // Requête à ton backend
    const res = await fetch(
      `http://localhost:8000/users/search?query=${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json([], { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
