import Footer from "../components/footer"
import Navbar from "../components/navbar"
export default function page() {
  return (
    <>
    <Navbar dashboard={false} project={true} profile={false}/>
    <main></main>
    <Footer />
    </>
  )
}