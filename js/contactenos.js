document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTOS DEL FORMULARIO
    const formulario = document.getElementById("formularioContacto");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const asunto = document.getElementById("asunto");
    const mensaje = document.getElementById("mensaje");

    const errorNombre = document.getElementById("errorNombre");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorTelefono = document.getElementById("errorTelefono");
    const errorAsunto = document.getElementById("errorAsunto");
    const errorMensaje = document.getElementById("errorMensaje");

    const mensajeFormulario = document.getElementById("mensajeFormulario");

    // CARGAR DATOS GUARDADOS (localStorage)
    function cargarDatosGuardados() {
        const datos = JSON.parse(localStorage.getItem("contactoKumo")) || {};

        if (datos.nombre) nombre.value = datos.nombre;
        if (datos.correo) correo.value = datos.correo;
        if (datos.telefono) telefono.value = datos.telefono;
        if (datos.asunto) asunto.value = datos.asunto;
        if (datos.mensaje) mensaje.value = datos.mensaje;
    }

    cargarDatosGuardados();

    // GUARDAR EN LOCALSTORAGE
    function guardarDatos() {
        const datos = {
            nombre: nombre.value.trim(),
            correo: correo.value.trim(),
            telefono: telefono.value.trim(),
            asunto: asunto.value,
            mensaje: mensaje.value.trim()
        };
        localStorage.setItem("contactoKumo", JSON.stringify(datos));
    }

    nombre.addEventListener("input", guardarDatos);
    correo.addEventListener("input", guardarDatos);
    telefono.addEventListener("input", guardarDatos);
    asunto.addEventListener("change", guardarDatos);
    mensaje.addEventListener("input", guardarDatos);


    // FUNCIONES DE VALIDACIÓN
    function validarNombre() {
        const valor = nombre.value.trim();
        let valido = true;

        if (valor === "") {
            errorNombre.textContent = "❌ El nombre es obligatorio";
            nombre.classList.add("errorInput");
            nombre.classList.remove("successInput");
            valido = false;
        } else if (valor.length < 3) {
            errorNombre.textContent = "❌ Mínimo 3 caracteres";
            nombre.classList.add("errorInput");
            nombre.classList.remove("successInput");
            valido = false;
        } else if (valor.length > 50) {
            errorNombre.textContent = "❌ Máximo 50 caracteres";
            nombre.classList.add("errorInput");
            nombre.classList.remove("successInput");
            valido = false;
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor)) {
            errorNombre.textContent = "❌ Solo letras y espacios";
            nombre.classList.add("errorInput");
            nombre.classList.remove("successInput");
            valido = false;
        } else {
            errorNombre.textContent = "✔ Nombre válido";
            nombre.classList.remove("errorInput");
            nombre.classList.add("successInput");
        }
        return valido;
    }

    function validarCorreo() {
        const valor = correo.value.trim();
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co|org|net|edu|info|biz)$/i;
        let valido = true;

        if (valor === "") {
            errorCorreo.textContent = "❌ El correo es obligatorio";
            correo.classList.add("errorInput");
            correo.classList.remove("successInput");
            valido = false;
        } else if (!regex.test(valor)) {
            errorCorreo.textContent = "❌ Ingresa un correo válido (ejemplo@correo.com)";
            correo.classList.add("errorInput");
            correo.classList.remove("successInput");
            valido = false;
        } else {
            errorCorreo.textContent = "✔ Correo válido";
            correo.classList.remove("errorInput");
            correo.classList.add("successInput");
        }
        return valido;
    }

    function validarTelefono() {
        const valor = telefono.value.trim();
        let valido = true;

        if (valor === "") {
            errorTelefono.textContent = "❌ El teléfono es obligatorio";
            telefono.classList.add("errorInput");
            telefono.classList.remove("successInput");
            valido = false;
        } else if (!/^\d+$/.test(valor)) {
            errorTelefono.textContent = "❌ Solo números";
            telefono.classList.add("errorInput");
            telefono.classList.remove("successInput");
            valido = false;
        } else if (valor.length < 7) {
            errorTelefono.textContent = "❌ Mínimo 7 dígitos";
            telefono.classList.add("errorInput");
            telefono.classList.remove("successInput");
            valido = false;
        } else if (valor.length > 10) {
            errorTelefono.textContent = "❌ Máximo 10 dígitos";
            telefono.classList.add("errorInput");
            telefono.classList.remove("successInput");
            valido = false;
        } else {
            errorTelefono.textContent = "✔ Teléfono válido";
            telefono.classList.remove("errorInput");
            telefono.classList.add("successInput");
        }
        return valido;
    }

    function validarAsunto() {
        const valor = asunto.value;
        let valido = true;

        if (valor === "") {
            errorAsunto.textContent = "❌ Selecciona un asunto";
            asunto.classList.add("errorInput");
            asunto.classList.remove("successInput");
            valido = false;
        } else {
            errorAsunto.textContent = "✔ Asunto seleccionado";
            asunto.classList.remove("errorInput");
            asunto.classList.add("successInput");
        }
        return valido;
    }

    function validarMensaje() {
        const valor = mensaje.value.trim();
        let valido = true;

        if (valor === "") {
            errorMensaje.textContent = "❌ El mensaje es obligatorio";
            mensaje.classList.add("errorInput");
            mensaje.classList.remove("successInput");
            valido = false;
        } else if (valor.length < 10) {
            errorMensaje.textContent = "❌ Mínimo 10 caracteres";
            mensaje.classList.add("errorInput");
            mensaje.classList.remove("successInput");
            valido = false;
        } else if (valor.length > 300) {
            errorMensaje.textContent = "❌ Máximo 300 caracteres";
            mensaje.classList.add("errorInput");
            mensaje.classList.remove("successInput");
            valido = false;
        } else {
            errorMensaje.textContent = "✔ Mensaje válido";
            mensaje.classList.remove("errorInput");
            mensaje.classList.add("successInput");
        }
        return valido;
    }

    // ENVÍO DEL FORMULARIO (SIN FORMSPREE)
    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombreOk = validarNombre();
        const correoOk = validarCorreo();
        const telefonoOk = validarTelefono();
        const asuntoOk = validarAsunto();
        const mensajeOk = validarMensaje();

        if (!nombreOk || !correoOk || !telefonoOk || !asuntoOk || !mensajeOk) {
            mensajeFormulario.textContent = "❌ Corrige los campos marcados en rojo antes de enviar.";
            mensajeFormulario.className = "mensajeError";
            return;
        }

        mensajeFormulario.textContent = "📨 Enviando mensaje...";
        mensajeFormulario.className = "mensajeExito";

        // Simular envío (delay de 1s)
        setTimeout(() => {

            // ===== ALERT DE ÉXITO =====
            alert("✅ ¡Mensaje enviado con éxito!\n\nNos pondremos en contacto contigo pronto. 💜");

            // Limpiar formulario
            formulario.reset();

            // Limpiar validaciones
            document.querySelectorAll("small").forEach(campo => {
                campo.textContent = "";
            });
            document.querySelectorAll("input, textarea, select").forEach(campo => {
                campo.classList.remove("successInput", "errorInput");
            });

            mensajeFormulario.textContent = "";
            mensajeFormulario.className = "";

            // Eliminar datos guardados
            localStorage.removeItem("contactoKumo");

            // Guardar en historial
            const historial = JSON.parse(localStorage.getItem("contactoKumoHistorial")) || [];
            historial.push({
                fecha: new Date().toLocaleString(),
                nombre: nombre.value.trim(),
                correo: correo.value.trim(),
                asunto: asunto.value
            });
            localStorage.setItem("contactoKumoHistorial", JSON.stringify(historial));

        }, 1000);
    });
});