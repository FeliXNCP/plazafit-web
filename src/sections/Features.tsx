import { FaMapMarkedAlt, FaDumbbell, FaClipboardList, FaTools } from "react-icons/fa"

function Features() {
  return (
    <section className="features" id="features" data-aos="fade-up">

      <h2>Funciones principales</h2>

      <div className="features-grid">

        <div className="feature-card" data-aos="zoom-in">
          <FaMapMarkedAlt size={40} color="#2E7D32" />
          <h3>Mapa de plazas</h3>
          <p>Encuentra plazas deportivas cercanas utilizando un mapa interactivo.</p>
        </div>

        <div className="feature-card" data-aos="zoom-in">
          <FaDumbbell size={40} color="#2E7D32" />
          <h3>Guía de máquinas</h3>
          <p>Aprende a utilizar correctamente cada máquina de ejercicio.</p>
        </div>

        <div className="feature-card" data-aos="zoom-in">
          <FaClipboardList size={40} color="#2E7D32" />
          <h3>Rutinas</h3>
          <p>Accede a rutinas adaptadas a cada plaza deportiva.</p>
        </div>

        <div className="feature-card" data-aos="zoom-in">
          <FaTools size={40} color="#2E7D32" />
          <h3>Reporte de fallas</h3>
          <p>Reporta máquinas dañadas para mejorar los espacios deportivos.</p>
        </div>

      </div>

    </section>
  )
}

export default Features