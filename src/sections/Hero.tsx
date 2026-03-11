import logo from "../assets/logo.png"

function Hero() {
  return (
    <section className="hero">

      <div className="hero-text" data-aos="fade-right">

        <span className="hero-tag">
          Entrenamiento al aire libre
        </span>

        <h1>PlazaFit</h1>

        <p>
          Descubre plazas deportivas cercanas, aprende a utilizar
          las máquinas de ejercicio y sigue rutinas diseñadas
          para entrenar al aire libre.
        </p>

      </div>

      <div className="hero-image" data-aos="fade-left">

        <div className="hero-logo-container">
          <img
            src={logo}
            alt="Logo PlazaFit"
            className="hero-logo"
          />
        </div>

      </div>

    </section>
  )
}

export default Hero