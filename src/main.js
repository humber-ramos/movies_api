import { obtenerPeliculasPopulares, buscarPeliculasPorTitulo } from './peliculas';
import './style.css'

// Llamando elementos del HTML
const resultados = document.querySelector("#resultados")
const mensaje = document.querySelector("#mensaje")
const inputBuscar = document.querySelector("#inputBuscar")
const btnBuscar = document.querySelector("#btnBuscar")
const btnPopulares = document.querySelector("#btnPopulares")

// Variables de control para la paginación
let paginaActual = 1;
let totalPaginas = 1;
let modoActual = 'populares'; // Puede ser 'populares' o 'busqueda'

// Creamos una barra simple de paginación debajo de los resultados
const contenedorPaginacion = document.createElement("div");
contenedorPaginacion.id = "paginacion";
contenedorPaginacion.style.cssText = "display: flex; justify-content: center; align-items: center; gap: 15px; margin: 30px 0; width: 100%;";
contenedorPaginacion.innerHTML = `
  <button id="btnAnterior" style="padding: 8px 16px; cursor: pointer;">Anterior</button>
  <span id="infoPagina">Página 1</span>
  <button id="btnSiguiente" style="padding: 8px 16px; cursor: pointer;">Siguiente</button>
`;
// Lo insertamos justo después de los resultados
resultados.after(contenedorPaginacion);

const btnAnterior = document.querySelector("#btnAnterior");
const btnSiguiente = document.querySelector("#btnSiguiente");
const infoPagina = document.querySelector("#infoPagina");


// Método para capturar la informacion de cada película y mostrarlo
function mostrarPeliculas(peliculas) {

  resultados.innerHTML = "";

  peliculas.map((pelicula) => {
    //Validación de fecha
    const anio = pelicula.release_date ? pelicula.release_date.slice(0, 4) : "Sin fecha";
    const sinopsis = pelicula.overview || "Sin sinopsis disponible.";
    const poster = pelicula.poster_path
      ? `https://image.tmdb.org/t/p/w300${pelicula.poster_path}`
      : "https://placehold.co/300x450?text=Sin+imagen";

    resultados.innerHTML += `
      <div class="tarjeta">
        <img src="${poster}" alt="${pelicula.title}" />
        <h3>${pelicula.title}</h3>
        <p class="anio">${anio}</p>
        <p class="sinopsis">${sinopsis}</p>
      </div>
    `;
  });
}

// Función para actualizar el estado visual de los botones de paginación
function actualizarControlesPaginacion() {
  infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  btnAnterior.disabled = paginaActual <= 1;
  btnSiguiente.disabled = paginaActual >= totalPaginas;
}

// Método para cargar las Películas Populares
async function cargarPopulares(pagina = 1) {
  mensaje.textContent = "Cargando...";

  // Limpiamos el texto de la búsqueda que el usuario haya introducido
  inputBuscar.value = '';

  modoActual = 'populares';
  paginaActual = pagina;

  try {
    const data = await obtenerPeliculasPopulares(paginaActual);
    mensaje.textContent = "";

    totalPaginas = data.total_pages > 500 ? 500 : data.total_pages; // TMDB limita a 500 páginas máximo
    mostrarPeliculas(data.results);
    actualizarControlesPaginacion();
  } catch (error) {
    resultados.innerHTML = "";
    mensaje.textContent = "Error de conexión. Intenta de nuevo más tarde.";
  }
}


// Buscar una película
async function buscar(pagina = 1) {
  const texto = inputBuscar.value.trim();

  if (texto === "") {
    mensaje.textContent = "Escribe el nombre de una película.";
    return;
  }

  mensaje.textContent = "Cargando...";
  modoActual = 'busqueda';
  paginaActual = pagina;

  try {
    const data = await buscarPeliculasPorTitulo(texto, paginaActual);

    if (data.results.length === 0) {
      resultados.innerHTML = "";
      contenedorPaginacion.style.display = "none"; // Ocultar paginación si no hay resultados
      mensaje.textContent = "Película no encontrada";
      return;
    }

    mensaje.textContent = "";
    contenedorPaginacion.style.display = "flex"; // Mostrar paginación
    totalPaginas = data.total_pages;
    mostrarPeliculas(data.results);
    actualizarControlesPaginacion();
  } catch (error) {
    console.error("Error detallado:", error); // <-- AÑADE ESTO
    resultados.innerHTML = "";
    mensaje.textContent = "Error de conexión. Intenta de nuevo más tarde.";
  }
}

// Eventos para los botones de Siguiente y Anterior
btnSiguiente.addEventListener("click", () => {
  if (paginaActual < totalPaginas) {
    paginaActual++;
    if (modoActual === 'populares') {
      cargarPopulares(paginaActual);
    } else {
      buscar(paginaActual);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla suavemente al cambiar de página
  }
});

btnAnterior.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    if (modoActual === 'populares') {
      cargarPopulares(paginaActual);
    } else {
      buscar(paginaActual);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// cargar películas populares al entrar a la página
cargarPopulares(1)

// Agregar la acción de cada botón
btnBuscar.addEventListener("click", () => buscar(1))
btnPopulares.addEventListener("click", () => cargarPopulares(1))

//Hacer que el botón de Buscar se active al presionar Enter en el campo de texto
inputBuscar.addEventListener('keydown', (e) => {
  // Verificamos si la tecla presionada es "Enter"
  if (e.key === 'Enter') {
    buscar(1);
  }
});