import Zoom from "react-medium-image-zoom"

import menu from "../assets/screenshots/menu.png"
import mapa from "../assets/screenshots/mapa.png"
import plaza from "../assets/screenshots/plaza.png"

function Screenshots() {
  return (
    <section className="screenshots" id="screenshots" data-aos="fade-up">

      <h2>Capturas de la aplicación</h2>

      <div className="screenshots-grid">

        <Zoom>
          <img src={menu} alt="Menu PlazaFit" className="screenshot-img"/>
        </Zoom>

        <Zoom>
          <img src={mapa} alt="Mapa de plazas" className="screenshot-img"/>
        </Zoom>

        <Zoom>
          <img src={plaza} alt="Detalle de plaza" className="screenshot-img"/>
        </Zoom>

      </div>

    </section>
  )
}

export default Screenshots