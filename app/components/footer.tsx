import Image from "next/image"
export default function Footer() {
  return (
    <div className="bg-white h-20 flex items-center justify-between px-15 ">
        <Image src="/logo-black.svg" height={15} width={100} alt="logo-black" />
        <p className="text-lg">Abricot 2025</p>
    </div>
  )
}