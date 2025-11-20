import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const prenom = formData.get("prenom") as string;
  const nom = formData.get("nom") as string;
  const email = formData.get("email") as string;
  const newPassword = formData.get("password") as string;
  const oldPassword = formData.get("oldPassword") as string;
  const fullName = `${prenom} ${nom}`;
  const cookie = await cookies()
  const token = cookie.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }


  // profile update (name & email)
  const profileRes = await fetch("http://localhost:8000/auth/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: fullName,
      email,
    }),
  });

  const profileJson = await profileRes.json();

  if (!profileRes.ok) {
    return NextResponse.json(
      { error: "Erreur Mise à jour Profil", details: profileJson },
      { status: profileRes.status }
    );
  }


  let passwordJson = null;


  // password update 
  if (newPassword && newPassword.trim() !== "") {
    const passwordRes = await fetch("http://localhost:8000/auth/password", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: oldPassword,
        newPassword,
      }),
    });

    passwordJson = await passwordRes.json();

    if (!passwordRes.ok) {
       return NextResponse.json(
    {
      error: true,
      type: "password",
      message: passwordJson?.message || "Erreur Mise à jour Mot de passe",
    },
    { status: 400 }
  );
    }
  }
return NextResponse.json({
  success: true,
  message: "Informations mises à jour avec succès",
});

}
