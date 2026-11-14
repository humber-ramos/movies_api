
const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = import.meta.env.VITE_BASE_URL


export async function obtenerPeliculasPopulares() {

    // Utilizar el método fetch para consultar los datos de la API
    const response = await fetch(`${BASE_URL}movie/popular?api_key=${API_KEY}`)

    // Convertir a JSON los datos
    const data = await response.json()
    return data
}

export async function buscarPeliculasPorTitulo(titulo) {

    // Utilizar el método fetch para consultar los datos de la API
    const response = await fetch(`${BASE_URL}search/movie?api_key=${API_KEY}&query=${encodeURIComponent(titulo)}`)

    // Convertir a JSON los datos
    const data = await response.json()
    return data

}