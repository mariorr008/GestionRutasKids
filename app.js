let rutas = [];

const nombreRuta = document.getElementById("nombreRuta");
const nombreConductor = document.getElementById("nombreConductor");
const horaSalida = document.getElementById("horaSalida");
const ciudadRuta = document.getElementById("ciudadRuta");
const contenedorRutas = document.getElementById("contenedorRutas");
const btnCrearRuta = document.getElementById("btnCrearRuta");
const templateRuta = document.getElementById("templateRuta");

async function obtenerClima(ciudad) {

    const apiKey = "98a1bb55ebe4e29a656ab2d1d6c02c1e";

    const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener el clima");
    }

    const datos = await respuesta.json();

    if (!datos.main || typeof datos.main.temp !== "number") {
        throw new Error("Respuesta de clima inválida");
    }

    return datos.main.temp;
}


function crearTarjetaProyecto(ruta, conductor, hora, ciudad) {
    const tarjeta = templateRuta.content.cloneNode(true);

    tarjeta.querySelector(".tituloRuta").textContent = ruta;
    tarjeta.querySelector(".textoConductor").textContent = `Conductor: ${conductor}`;
    tarjeta.querySelector(".textoHora").textContent = `Hora: ${hora}`;
    tarjeta.querySelector(".textoClima").textContent = `Ciudad: ${ciudad}`;

    const tarjetaElemento = tarjeta.querySelector(".tarjetaRuta");
    const inputEstudiante = tarjetaElemento.querySelector(".inputEstudiante");
    const btnAgregarEstudiante = tarjetaElemento.querySelector(".btnAgregarEstudiante");
    const listaEstudiantes = tarjetaElemento.querySelector(".listaEstudiantes");

    const btnEditar = tarjetaElemento.querySelector(".btnEditar");
    const btnEliminar = tarjetaElemento.querySelector(".btnEliminar");
    const tituloRutaEl = tarjetaElemento.querySelector(".tituloRuta");
    const conductorEl = tarjetaElemento.querySelector(".textoConductor");
    const horaEl = tarjetaElemento.querySelector(".textoHora");
    const ciudadEl = tarjetaElemento.querySelector(".textoClima");

    const contenedorEdicion = tarjetaElemento.querySelector(".contenedorEdicionRuta");
    const editarRutaInput = tarjetaElemento.querySelector(".editarRutaInput");
    const editarConductorInput = tarjetaElemento.querySelector(".editarConductorInput");
    const editarHoraInput = tarjetaElemento.querySelector(".editarHoraInput");
    const editarCiudadInput = tarjetaElemento.querySelector(".editarCiudadInput");
    const btnGuardarEdicion = tarjetaElemento.querySelector(".btnGuardarEdicion");
    const btnCancelarEdicion = tarjetaElemento.querySelector(".btnCancelarEdicion");

    btnAgregarEstudiante.addEventListener("click", () => {
        const nombreEstudiante = inputEstudiante.value.trim();
        if (nombreEstudiante === "") {
            alert("Ingrese el nombre del estudiante");
            return;
        }

        const estudianteItem = document.createElement("li");
        estudianteItem.textContent = nombreEstudiante;
        listaEstudiantes.appendChild(estudianteItem);
        inputEstudiante.value = "";
    });

    btnEditar.addEventListener("click", () => {
        contenedorEdicion.style.display = "block";
        btnEditar.style.display = "none";
    });

    btnGuardarEdicion.addEventListener("click", () => {
        const nuevoRuta = editarRutaInput.value.trim();
        const nuevoConductor = editarConductorInput.value.trim();
        const nuevaHora = editarHoraInput.value.trim();
        const nuevaCiudad = editarCiudadInput.value.trim();

        if (nuevoRuta === "" || nuevoConductor === "" || nuevaHora === "" || nuevaCiudad === "") {
            alert("Complete todos los campos");
            return;
        }

        tituloRutaEl.textContent = nuevoRuta;
        conductorEl.textContent = `Conductor: ${nuevoConductor}`;
        horaEl.textContent = `Hora: ${nuevaHora}`;
        ciudadEl.textContent = `Ciudad: ${nuevaCiudad}`;

        contenedorEdicion.style.display = "none";
        btnEditar.style.display = "inline-block";
    });

    btnCancelarEdicion.addEventListener("click", () => {
        contenedorEdicion.style.display = "none";
        btnEditar.style.display = "inline-block";
    });

    btnEliminar.addEventListener("click", () => {
        tarjetaElemento.remove();
    });

    return tarjeta;
}

function limpiarFormulario() {
    nombreRuta.value = "";
    nombreConductor.value = "";
    horaSalida.value = "";
    ciudadRuta.value = "";
}

async function AgregarTarjeta() {
    if (nombreRuta.value.trim() === "" || nombreConductor.value.trim() === "" || horaSalida.value.trim() === "" || ciudadRuta.value.trim() === "") {
        alert("Complete todos los campos");
        return;
    }

    let temperatura;
    try {
        temperatura = await obtenerClima(ciudadRuta.value);
    } catch (error) {
        alert("No se pudo obtener el clima. Revisa el nombre de la ciudad e inténtalo de nuevo.");
        return;
    }

    const nuevaTarjeta = crearTarjetaProyecto(
        nombreRuta.value,
        nombreConductor.value,
        horaSalida.value,
        `${ciudadRuta.value} - ${temperatura}°C`
    );

    contenedorRutas.appendChild(nuevaTarjeta);

    limpiarFormulario();
}

btnCrearRuta.addEventListener("click", AgregarTarjeta);
