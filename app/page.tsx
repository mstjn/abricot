"use client";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LogoutButton from "./components/LogoutButton";

export default function HomePage() {
  return (
    <>
      <Navbar dashboard={true} project={false} profile={false} />
      <main>
        <LogoutButton />
      </main>
      <Footer />
    </>
  );
}
