const formularioRegistro = document.getElementById("formularioRegistro");
const mensajeRegistro = document.getElementById("mensajeRegistro");

const inputNombre = document.getElementById("nombreCompleto");
const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");
const inputPassword = document.getElementById("password");

const errorNombre = document.getElementById("errorNombre");
const errorTelefono = document.getElementById("errorTelefono");
const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

// Lista de usuarios almacenados
let listaUsuarios = [];

const usuariosGuardados =
    localStorage.getItem("listaUsuarios");

if (usuariosGuardados) {
    listaUsuarios = JSON.parse(usuariosGuardados);
}

// Mostrar y ocultar contraseña
mostrarPassword.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        mostrarPassword.innerHTML = '<i class="bi bi-eye-slash"></i>';
    } else {
        password.type = "password";
        mostrarPassword.innerHTML = '<i class="bi bi-eye"></i>';
    }

});

// Registro
formularioRegistro.addEventListener("submit", function (e) {
    e.preventDefault();
    let valido = true;
    mensajeRegistro.textContent = "";
    mensajeRegistro.className = "";

    // Limpiar mensajes
    document.querySelectorAll("small").forEach(campo => {
        campo.textContent = "";
    });

    // Limpiar estilos
    document.querySelectorAll("input").forEach(campo => {
        campo.classList.remove("errorInput");
        campo.classList.remove("successInput");
    });

    const nombreValor = inputNombre.value.trim();
    const telefonoValor = inputTelefono.value.trim();
    const correoValor = inputCorreo.value.trim();
    const passwordValor = inputPassword.value.trim();

    //Validaciones de nombre
    if (nombreValor === "") {

        errorNombre.className = "mensajeErrorCampo";
        errorNombre.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe escribir su nombre completo.';

        inputNombre.classList.add("errorInput");
        valido = false;

    } else if (nombreValor.length < 2) {

        errorNombre.className = "mensajeErrorCampo";
        errorNombre.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Mínimo 2 caracteres.';

        inputNombre.classList.add("errorInput");
        valido = false;

    } else if (nombreValor.length > 50) {

        errorNombre.className = "mensajeErrorCampo";
        errorNombre.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Máximo 50 caracteres.';

        inputNombre.classList.add("errorInput");
        valido = false;

    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombreValor)) {

        errorNombre.className = "mensajeErrorCampo";
        errorNombre.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Solo se permiten letras y espacios.';

        inputNombre.classList.add("errorInput");
        valido = false;

    } else {

        errorNombre.className = "mensajeExitoCampo";
        errorNombre.innerHTML = '<i class="bi bi-check-circle-fill"></i> Nombre válido.';

        inputNombre.classList.add("successInput");
    }

    // Validaciones de telefono
    if (telefonoValor === "") {

        errorTelefono.className = "mensajeErrorCampo";
        errorTelefono.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar su teléfono.';

        inputTelefono.classList.add("errorInput");
        valido = false;

    } else if (!/^\d+$/.test(telefonoValor)) {

        errorTelefono.className = "mensajeErrorCampo";
        errorTelefono.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Solo se permiten números.';

        inputTelefono.classList.add("errorInput");
        valido = false;

    } else if (!/^3\d{9}$/.test(telefonoValor)) {

        errorTelefono.className = "mensajeErrorCampo";
        errorTelefono.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar un número colombiano válido.';

        inputTelefono.classList.add("errorInput");
        valido = false;

    } else {

        errorTelefono.className = "mensajeExitoCampo";
        errorTelefono.innerHTML = '<i class="bi bi-check-circle-fill"></i> Teléfono válido.';

        inputTelefono.classList.add("successInput");
    }

    // Validaciones correo
    const regexCorreo =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co|org|net|edu|gov|info|biz)$/i;

    if (correoValor === "") {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar su correo.';

        inputCorreo.classList.add("errorInput");
        valido = false;

    } else if (!correoValor.includes("@")) {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> El correo debe contener el símbolo @.';

        inputCorreo.classList.add("errorInput");
        valido = false;

    } else if (!regexCorreo.test(correoValor)) {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Ingrese un correo electrónico válido.';

        inputCorreo.classList.add("errorInput");
        valido = false;

    } else if (listaUsuarios.some(usuario => usuario.correo === correoValor)) {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Este correo ya está registrado.';

        inputCorreo.classList.add("errorInput");
        valido = false;

    } else {

        errorCorreo.className = "mensajeExitoCampo";
        errorCorreo.innerHTML = '<i class="bi bi-check-circle-fill"></i> Correo válido.';

        inputCorreo.classList.add("successInput");
    }

    //Validaciones contraseña
    if (passwordValor === "") {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar una contraseña.';

        inputPassword.classList.add("errorInput");
        valido = false;

    } else if (passwordValor.length < 8) {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Mínimo 8 caracteres.';

        inputPassword.classList.add("errorInput");
        valido = false;

    } else if (!/[A-Z]/.test(passwordValor)) {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe contener al menos una letra mayúscula.';

        inputPassword.classList.add("errorInput");
        valido = false;

    } else if (!/[a-z]/.test(passwordValor)) {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe contener al menos una letra minúscula.';

        inputPassword.classList.add("errorInput");
        valido = false;

    } else if (!/\d/.test(passwordValor)) {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe contener al menos un número.';

        inputPassword.classList.add("errorInput");
        valido = false;

    } else if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(passwordValor)) {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe contener un carácter especial.';

        inputPassword.classList.add("errorInput");
        valido = false;

    } else if (/\s/.test(passwordValor)) {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> La contraseña no puede contener espacios.';

        inputPassword.classList.add("errorInput");
        valido = false;

    } else {

        errorPassword.className = "mensajeExitoCampo";
        errorPassword.innerHTML = '<i class="bi bi-check-circle-fill"></i> Contraseña segura.';

        inputPassword.classList.add("successInput");
    }

    // Validacion completa
    if (!valido) {

        mensajeRegistro.className = "mensajeError";
        mensajeRegistro.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Debe corregir los campos marcados en rojo.';

        return;
    }

    //Crea el usuario
    const nuevoUsuario = {
        id: Date.now().toString(),
        nombre: nombreValor,
        telefono: telefonoValor,
        correo: correoValor,
        contraseña: passwordValor
    };

    listaUsuarios.push(nuevoUsuario);

    localStorage.setItem(
        "listaUsuarios",
        JSON.stringify(listaUsuarios)
    );

    // Mensaje
    mensajeRegistro.className = "mensajeExito";
    mensajeRegistro.innerHTML = '<i class="bi bi-check-circle-fill"></i> Registro realizado correctamente.';

    // Limpiar formulario
    formularioRegistro.reset();

    document.querySelectorAll("input").forEach(campo => {
        campo.classList.remove("successInput");
    });

    document.querySelectorAll("small").forEach(campo => {
        campo.textContent = "";
    });

    setTimeout(() => {
        mensajeRegistro.textContent = "";
        mensajeRegistro.className = "";

        window.location.href = "../inicio_sesion/inicio_sesion.html";

    }, 1800);
});