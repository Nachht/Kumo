const formulario = document.getElementById("formulario");
const mensajeFormulario = document.getElementById("mensajeFormulario");

const nombre = document.getElementById("nombre");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
const contraseña = document.getElementById("contraseña");

const errorNombre = document.getElementById("errorNombre");
const errorTelefono = document.getElementById("errorTelefono");
const errorCorreo = document.getElementById("errorCorreo");
const errorContraseña = document.getElementById("errorContraseña");

//LocalStorage
let listaUsuarios = [];
const usuariosGuardados = localStorage.getItem("listaUsuarios");

if (usuariosGuardados) {
    listaUsuarios = JSON.parse(usuariosGuardados);
}

// Validacion
formulario.addEventListener("submit", function (e) {

    e.preventDefault(); // SIEMPRE validamos primero

    let valido = true;

    mensajeFormulario.textContent = "";
    mensajeFormulario.className = "";

    // LIMPIAR MENSAJES
    document.querySelectorAll("small").forEach(campo => {
        campo.textContent = "";
    });

    // LIMPIAR ESTILOS
    document.querySelectorAll("input, textarea").forEach(campo => {
        campo.classList.remove("errorInput");
        campo.classList.remove("successInput");
    });

    // Nombre completo
    const nombreValor = nombre.value.trim();

    if (nombreValor === "") {

        errorNombre.className = "mensajeErrorCampo";
        errorNombre.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe escribir su nombre completo.';
        nombre.classList.add("errorInput");
        valido = false;

    } else if (nombreValor.length < 2) {

        errorNombre.className = "mensajeErrorCampo";
        errorNombre.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Mínimo 2 caracteres.';
        nombre.classList.add("errorInput");
        valido = false;

    } else if (nombreValor.length > 50) {

        errorNombre.className = "mensajeErrorCampo";
        errorNombre.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Máximo 50 caracteres.';
        nombre.classList.add("errorInput");
        valido = false;

    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombreValor)) {

        errorNombre.className = "mensajeErrorCampo";
        errorNombre.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Solo se permiten letras y espacios.';
        nombre.classList.add("errorInput");
        valido = false;

    } else {

        errorNombre.className = "mensajeExitoCampo";
        errorNombre.innerHTML = '<i class="bi bi-check-circle-fill"></i> Nombre válido';
        nombre.classList.add("success-text");
    }

    // teléfono
    const telefonoValor = telefono.value.trim();

    if (telefonoValor === "") {

        errorTelefono.className = "mensajeErrorCampo";
        errorTelefono.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar su teléfono.';
        telefono.classList.add("errorInput");
        valido = false;

    } else if (!/^\d+$/.test(telefonoValor)) {

        errorTelefono.className = "mensajeErrorCampo";
        errorTelefono.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Solo se permiten números.';
        telefono.classList.add("errorInput");
        valido = false;

    } else if (!/^3\d{9}$/.test(telefonoValor)) {

        errorTelefono.className = "mensajeErrorCampo";
        errorTelefono.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar un número colombiano válido.';
        telefono.classList.add("errorInput");
        valido = false;

    } else {

        errorTelefono.className = "mensajeExitoCampo";
        errorTelefono.innerHTML = '<i class="bi bi-check-circle-fill"></i> Teléfono válido.';
        telefono.classList.add("success-text");
    }

    // correo
    const correoValor = correo.value.trim();

    const regexCorreo =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co|org|net|edu|gov|info|biz)$/i;

    if (correoValor === "") {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar su correo.';
        correo.classList.add("errorInput");
        valido = false;

    } else if (!correoValor.includes("@")) {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> El correo debe contener el símbolo @.';
        correo.classList.add("errorInput");
        valido = false;

    } else if (!regexCorreo.test(correoValor)) {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Ingrese un correo electrónico válido.';
        correo.classList.add("errorInput");
        valido = false;

    } else {

        errorCorreo.className = "mensajeExitoCampo";
        errorCorreo.innerHTML = '<i class="bi bi-check-circle-fill"></i> Correo válido.';
        correo.classList.add("success-text");
    }

    // Contraseña
    const contraseñaValor = contraseña.value.trim();

    if (contraseñaValor === "") {

        errorContraseña.className = "mensajeErrorCampo";
        errorContraseña.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar una contraseña.';
        contraseña.classList.add("errorInput");
        valido = false;

    } else if (contraseñaValor.length < 8) {

        errorContraseña.className = "mensajeErrorCampo";
        errorContraseña.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Mínimo 8 caracteres.';
        contraseña.classList.add("errorInput");
        valido = false;

    } else if (!/[A-Z]/.test(contraseñaValor)) {

        errorContraseña.className = "mensajeErrorCampo";
        errorContraseña.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe contener al menos una letra mayúscula.';
        contraseña.classList.add("errorInput");
        valido = false;

    } else if (!/[a-z]/.test(contraseñaValor)) {

        errorContraseña.className = "mensajeErrorCampo";
        errorContraseña.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe contener al menos una letra minúscula.';
        contraseña.classList.add("errorInput");
        valido = false;

    } else if (!/\d/.test(contraseñaValor)) {

        errorContraseña.className = "mensajeErrorCampo";
        errorContraseña.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe contener al menos un número.';
        contraseña.classList.add("errorInput");
        valido = false;

    } else if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(contraseñaValor)) {

        errorContraseña.className = "mensajeErrorCampo";
        errorContraseña.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe contener un carácter especial.';
        contraseña.classList.add("errorInput");
        valido = false;

    } else if (/\s/.test(contraseñaValor)) {

        errorContraseña.className = "mensajeErrorCampo";
        errorContraseña.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> La contraseña no puede contener espacios.';
        contraseña.classList.add("errorInput");
        valido = false;

    } else {

        errorContraseña.className = "mensajeExitoCampo";
        errorContraseña.innerHTML = '<i class="bi bi-check-circle-fill"></i> Contraseña segura.';
        contraseña.classList.add("success-text");

    }

    //Validaciones registro completo
    if (!valido) {

        mensajeFormulario.className = "mensajeError";
        mensajeFormulario.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Debe corregir los campos marcados en rojo.';

        mensajeFormulario.classList.add("mensajeError");
        return;
    }

    // Registro exitoso
    mensajeFormulario.className = "mensajeExito";
    mensajeFormulario.innerHTML = '<i class="bi bi-check-circle-fill"></i> Registro realizado correctamente.';

    mensajeFormulario.classList.add("mensajeExito");

    // Limpiar formulario
    formulario.reset();

    // Quitar bordes verdes
    document.querySelectorAll("input").forEach(campo => {
        campo.classList.remove("successInput");
    });

    // Limpiar mensajes de cada campo
    document.querySelectorAll("small").forEach(campo => {
        campo.textContent = "";
    });

    setTimeout(() => {

        mensajeFormulario.textContent = "";
        mensajeFormulario.className = "";

    }, 3000);

    const nuevoUsuario = {
        id: Date.now().toString(),
        nombre: nombreValor,
        telefono: telefonoValor,
        correo: correoValor,
        contraseña: contraseñaValor,
    };

    listaUsuarios.push(nuevoUsuario);

    localStorage.setItem(
        "listaUsuarios",
        JSON.stringify(listaUsuarios)
    );
});