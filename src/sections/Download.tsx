import playBadge from "../assets/google-play-badge.png"

function Download() {
  return (
    <section className="download" id="download">

      <h2>Descarga PlazaFit</h2>

      <p className="download-text">
        La aplicación estará disponible próximamente en Google Play
        para dispositivos Android.
      </p>

      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="playstore-link"
      >
        <img
          src={playBadge}
          alt="Disponible en Google Play"
          className="playstore-badge"
        />
      </a>

    </section>
  )
}

export default Download