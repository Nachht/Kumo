const formulario = document.getElementById("formularioLogin");
const mensajeFormulario = document.getElementById("mensajeFormulario");

const correo = document.getElementById("correo");
const password = document.getElementById("password");
const mostrarPassword = document.getElementById("mostrarPassword")

const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

// Obtener datos de los usuarios ya registrados en registro.js
const listaUsuarios =
JSON.parse(localStorage.getItem("listaUsuarios")) || [];


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


// Iniciar sesión
formulario.addEventListener("submit", function (e){

    e.preventDefault(); // SIEMPRE validamos primero

    let valido = true;

    // Se limpia los mensajes y errores y colores guardados
    mensajeFormulario.textContent = "";
    mensajeFormulario.className = "";
    
    errorCorreo.textContent = "";
    errorPassword.textContent = "";

    correo.classList.remove("errorInput");
    password.classList.remove("errorInput");

    correo.classList.remove("successInput");
    password.classList.remove("successInput");

    // Variables para obtener lo que escribe el user
    const correoValor = correo.value.trim();
    const passwordValor = password.value.trim();

    // Validaciones del email
        if (correoValor === "") {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar su correo.';
        correo.classList.add("errorInput");
        valido = false;
    }

    // Validar contraseña
    if (passwordValor === "") {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Debe ingresar su contraseña.';
        password.classList.add("errorInput");
        valido = false;

    }

    if (!valido) {

        mensajeFormulario.className = "mensajeError";
        mensajeFormulario.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Complete los campos obligatorios.';
        return;

    }


    // Buscar usuario
    const usuarioEncontrado = listaUsuarios.find(usuario =>
        usuario.correo === correoValor);

    // Correo no registrado
    if (!usuarioEncontrado) {

        errorCorreo.className = "mensajeErrorCampo";
        errorCorreo.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Este correo no está registrado.';
        correo.classList.add("errorInput");

        return;
    }

        // Contraseña incorrecta
    if (usuarioEncontrado.contraseña !== passwordValor) {

        errorPassword.className = "mensajeErrorCampo";
        errorPassword.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Contraseña incorrecta.';
        password.classList.add("errorInput");

        return;

    }

    // Login exitoso
    correo.classList.add("successInput");
    password.classList.add("successInput");

    mensajeFormulario.className = "mensajeExito";
    mensajeFormulario.innerHTML = '<i class="bi bi-check-circle-fill"></i> Inicio de sesión exitoso.';

  
 // Guardar usuario activo
    localStorage.setItem(
        "usuarioActivo",
        JSON.stringify(usuarioEncontrado)
    );

    // Redireccionar
    setTimeout(() => {
        window.location.href = "../inicio/index.html";
    }, 1500);

});