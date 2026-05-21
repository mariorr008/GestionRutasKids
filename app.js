const nombreRuta = document.getElementById("nombreRuta");
const nombreConductor = document.getElementById("nombreConductor");
const horaSalida = document.getElementById("horaSalida");
const ciudadRuta = document.getElementById("ciudadRuta");
const contenedorRutas = document.getElementById("contenedorRutas");
const btnCrearRuta = document.getElementById("btnCrearRuta");
const templateRuta = document.getElementById("templateRuta");

function crearTarjetaProyecto(ruta, conductor, hora, ciudad) {
    const tarjeta = templateRuta.content.cloneNode(true);

    tarjeta.querySelector(".tituloRuta").textContent = ruta;
    tarjeta.querySelector(".textoConductor").textContent = `Conductor: ${conductor}`;
    tarjeta.querySelector(".textoHora").textContent = `Hora: ${hora}`;
    tarjeta.querySelector(".textoClima").textContent = `Ciudad: ${ciudad}`;

    return tarjeta;
}

function limpiarFormulario() {
    nombreRuta.value = "";
    nombreConductor.value = "";
    horaSalida.value = "";
    ciudadRuta.value = "";
}

function AgregarTarjeta() {
    if (nombreRuta.value.trim() === "" || nombreConductor.value.trim() === "" || horaSalida.value.trim() === "" || ciudadRuta.value.trim() === "") {
        alert("Complete todos los campos");
        return;
    }

    const nuevaTarjeta = crearTarjetaProyecto(nombreRuta.value, nombreConductor.value, horaSalida.value, ciudadRuta.value);
    contenedorRutas.appendChild(nuevaTarjeta);
    limpiarFormulario();
}

btnCrearRuta.addEventListener("click", AgregarTarjeta);