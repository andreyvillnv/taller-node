document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("palabraDesordenada")) {
        iniciarJuegoPalabras();
    }
});

// Obtener el animal según el mes de nacimiento
function descubrirAnimal() {
    const mes = document.getElementById("mes").value;
    
    // Realizamos la solicitud al backend (simulando con fetch)
    fetch(`/getAnimal/${mes}`)
        .then(response => response.json())
        .then(data => {
            if (data.animal) {
                document.getElementById("resultado").innerText = `Tu animal según el mes de nacimiento es: ${data.animal}`;
            } else {
                document.getElementById("resultado").innerText = "Mes no válido o animal no encontrado.";
            }
        })
        .catch(error => console.error('Error al obtener el animal:', error));
}

// Mostrar frase motivacional
function mostrarFrase() {
    const dia = document.getElementById("dia").value;
    
    // Realizamos la solicitud al backend
    fetch(`/getFrase/${dia}`)
        .then(response => response.json())
        .then(data => {
            if (data.frase) {
                document.getElementById("frase").innerText = data.frase;
            } else {
                document.getElementById("frase").innerText = "Día no válido o frase no encontrada.";
            }
        })
        .catch(error => console.error('Error al obtener la frase:', error));
}

// Iniciar el juego de palabras
// Función para iniciar el juego de palabras
function iniciarJuegoPalabras() {
    fetch('/getPalabraAleatoria')
        .then(response => response.json())
        .then(data => {
            const palabra = data.palabra;
            let desordenada = palabra.split('').sort(() => Math.random() - 0.5).join('');
            document.getElementById("palabraDesordenada").innerText = desordenada;
            document.getElementById("palabraCorrecta").value = palabra;
        })
        .catch(error => console.error("Error al obtener la palabra:", error));
}


// Función para verificar si la palabra es correcta
function verificarPalabra() {
    let respuesta = document.getElementById("respuesta").value.toUpperCase();
    let palabra = document.getElementById("palabraCorrecta").value.toUpperCase(); // Convertir a mayúsculas

    if (respuesta === palabra) {
        document.getElementById("mensaje").innerText = "¡Correcto!";
    } else {
        document.getElementById("mensaje").innerText = "Intenta de nuevo.";
    }
}