let rutas = JSON.parse(localStorage.getItem("rutas")) || [];
let nombres = ["mario", "pablo", "diego", "andres", "daniel"]

const nombreRuta = document.getElementById("nombreRuta");
const nombreConductor = document.getElementById("nombreConductor");
const horaSalida = document.getElementById("horaSalida");
const ciudadRuta = document.getElementById("ciudadRuta");
const contenedorRutas = document.getElementById("contenedorRutas");
const btnCrearRuta = document.getElementById("btnCrearRuta");
const templateRuta = document.getElementById("templateRuta");

function guardarLocalStorage() {

    localStorage.setItem(
        "rutas", JSON.stringify(rutas)
    );
}

async function obtenerClima(ciudad) {

    const apiKey = "98a1bb55ebe4e29a656ab2d1d6c02c1e";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

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

function crearTarjetaProyecto(rutaObjeto, index) {

    const tarjeta = templateRuta.content.cloneNode(true);

    tarjeta.querySelector(".tituloRuta").textContent = rutaObjeto.ruta;
    tarjeta.querySelector(".textoConductor").textContent = `Conductor: ${rutaObjeto.conductor}`;
    tarjeta.querySelector(".textoHora").textContent = `Hora: ${rutaObjeto.hora}`;
    tarjeta.querySelector(".textoClima").textContent = `Ciudad: ${rutaObjeto.ciudad} - ${rutaObjeto.temperatura}°C`;

    const tarjetaElemento = tarjeta.querySelector(".tarjetaRuta");
    const inputEstudiante = tarjetaElemento.querySelector(".inputEstudiante");
    const btnAgregarEstudiante = tarjetaElemento.querySelector(".btnAgregarEstudiante");
    const listaEstudiantes = tarjetaElemento.querySelector(".listaEstudiantes");
    const btnEditar = tarjetaElemento.querySelector(".btnEditar");
    const btnEliminar = tarjetaElemento.querySelector(".btnEliminar");

    const contenedorEdicion = tarjetaElemento.querySelector(".contenedorEdicionRuta");
    const editarRutaInput = tarjetaElemento.querySelector(".editarRutaInput");
    const editarConductorInput = tarjetaElemento.querySelector(".editarConductorInput");
    const editarHoraInput = tarjetaElemento.querySelector(".editarHoraInput");
    const editarCiudadInput = tarjetaElemento.querySelector(".editarCiudadInput");
    const btnGuardarEdicion = tarjetaElemento.querySelector(".btnGuardarEdicion");
    const btnCancelarEdicion = tarjetaElemento.querySelector(".btnCancelarEdicion");

    // MOSTRAR ESTUDIANTES GUARDADOS

    rutaObjeto.estudiantes.forEach((estudiante) => {

        const estudianteItem = document.createElement("li");

        estudianteItem.textContent = estudiante;

        listaEstudiantes.appendChild(estudianteItem);

    });

    // AGREGAR ESTUDIANTE

    btnAgregarEstudiante.addEventListener("click", () => {

        const nombreEstudiante = inputEstudiante.value.trim();

        if (nombreEstudiante === "") {

            alert("Ingrese el nombre del estudiante");
            return;

        }
        const estudianteExiste = rutas.some((ruta) => {

            return ruta.estudiantes.includes(nombreEstudiante);
        
        });
        
        if (estudianteExiste) {
        
            alert("Este estudiante ya está asignado a otra ruta");
        
            return;
        }

        rutaObjeto.estudiantes.push(nombreEstudiante);
        nombres.push(nombreEstudiante)

        guardarLocalStorage();

        renderRutas();

        const eventoEstudiante = new CustomEvent("estudianteAgregado", {

            detail: {
                estudiante: nombreEstudiante,
                ruta: rutaObjeto.ruta
            }

        });

        document.dispatchEvent(eventoEstudiante);

    });

    // EDITAR

    btnEditar.addEventListener("click", () => {

        editarRutaInput.value = rutaObjeto.ruta;

        editarConductorInput.value = rutaObjeto.conductor;

        editarHoraInput.value = rutaObjeto.hora;

        editarCiudadInput.value = rutaObjeto.ciudad;

        contenedorEdicion.style.display = "block";
        btnEditar.style.display = "none";

    });

    // GUARDAR EDICIÓN

    btnGuardarEdicion.addEventListener("click", () => {

        const nuevoRuta = editarRutaInput.value.trim();

        const nuevoConductor = editarConductorInput.value.trim();

        const nuevaHora = editarHoraInput.value.trim();

        const nuevaCiudad = editarCiudadInput.value.trim();

        if (
            nuevoRuta === "" ||
            nuevoConductor === "" ||
            nuevaHora === "" ||
            nuevaCiudad === ""
        ) {

            alert("Complete todos los campos");
            return;

        }

        rutas[index].ruta = nuevoRuta;
        rutas[index].conductor = nuevoConductor;
        rutas[index].hora = nuevaHora;
        rutas[index].ciudad = nuevaCiudad;

        guardarLocalStorage();

        renderRutas();

    });

    // CANCELAR EDICIÓN

    btnCancelarEdicion.addEventListener("click", () => {

        contenedorEdicion.style.display = "none";

        btnEditar.style.display = "inline-block";

    });

    // ELIMINAR

    btnEliminar.addEventListener("click", () => {

        rutas.splice(index, 1);

        guardarLocalStorage();

        renderRutas();

    });

    return tarjeta;
}

// RENDER

function renderRutas() {

    contenedorRutas.innerHTML = "";

    rutas.forEach((rutaObjeto, index) => {

        const tarjeta = crearTarjetaProyecto(
            rutaObjeto,
            index
        );

        contenedorRutas.appendChild(tarjeta);

    });

}

// LIMPIAR FORMULARIO

function limpiarFormulario() {

    nombreRuta.value = "";
    nombreConductor.value = "";
    horaSalida.value = "";
    ciudadRuta.value = "";

}

// CREAR RUTA

async function AgregarTarjeta() {

    if (
        nombreRuta.value.trim() === "" ||
        nombreConductor.value.trim() === "" ||
        horaSalida.value.trim() === "" ||
        ciudadRuta.value.trim() === ""
    ) {

        alert("Complete todos los campos");
        return;

    }

    let temperatura;

    try {

        temperatura = await obtenerClima(ciudadRuta.value);

    } catch (error) {

        alert(
            "No se pudo obtener el clima. Revisa el nombre de la ciudad."
        );

        return;

    }

    rutas.push({

        ruta: nombreRuta.value,

        conductor: nombreConductor.value,

        hora: horaSalida.value,

        ciudad: ciudadRuta.value,

        temperatura: temperatura,

        estudiantes: []

    });

    guardarLocalStorage();

    renderRutas();

    limpiarFormulario();

}

btnCrearRuta.addEventListener(
    "click", AgregarTarjeta
);

// EVENTO PERSONALIZADO

document.addEventListener("estudianteAgregado",
    (event) => {

        console.log(
            `Nuevo estudiante agregado:
            ${event.detail.estudiante}
            En la ruta:
            ${event.detail.ruta}`
        );

    }
);

// RENDER INICIAL

renderRutas();
console.log(rutas);
