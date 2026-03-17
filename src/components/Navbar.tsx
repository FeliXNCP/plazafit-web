import { useState } from "react"

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">

      <div className="logo">PlazaFit</div>

      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        <a href="#features" onClick={closeMenu}>Funciones</a>

        <a href="#screenshots" onClick={closeMenu}>Capturas</a>

        <a href="#download" onClick={closeMenu}>Descargar</a>

      </div>

    </nav>
  )
}

export default Navbar