import Navbar from "./components/Navbar"
import Hero from "./sections/Hero"
import Features from "./sections/Features"
import Screenshots from "./sections/Screenshots"
import Download from "./sections/Download"
import Footer from "./sections/Footer"
import AOS from "aos"
import { useEffect } from "react"

function App() {
  

  useEffect(() => {
    AOS.init({
      duration: 800
    })
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Screenshots />
      <Download />
      <Footer />
    </>
  )
}

export default App