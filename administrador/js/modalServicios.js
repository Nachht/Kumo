// localStorage
const CLAVE_PRODUCTOS_KUMO = "kumo_productos";
function cargarProductos() {
    try {
        const datosGuardados =
            localStorage.getItem(CLAVE_PRODUCTOS_KUMO);

        if (datosGuardados) {
            return JSON.parse(datosGuardados);
        }

    } catch (error) {
        console.error(
            "No se pudieron leer los productos guardados:",
            error
        );
    }
    return [];
}

function guardarProductos(lista = productos) {
    try {
        localStorage.setItem(
            CLAVE_PRODUCTOS_KUMO,
            JSON.stringify(lista)
        );
        return true;

    } catch (error) {
        console.error(
            "No se pudieron guardar los productos:",
            error
        );

        alert(
            "No se pudo guardar el producto: el almacenamiento local está lleno " +
            "o la imagen es demasiado pesada. Intenta con una imagen más liviana " +
            "o elimina algún producto."
        );

        return false;
    }
}

// Redimensiona y comprime una imagen antes de convertirla a base64,
// para no llenar el localStorage con imágenes muy pesadas.
function comprimirImagen(archivo, anchoMaximo = 800, calidad = 0.72) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = function () {
            const imagen = new Image();
            imagen.onload = function () {
                const escala = Math.min(1, anchoMaximo / imagen.width);
                const canvas = document.createElement("canvas");
                canvas.width = imagen.width * escala;
                canvas.height = imagen.height * escala;

                const contexto = canvas.getContext("2d");
                contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", calidad));
            };

            imagen.onerror = reject;
            imagen.src = lector.result;
        };
        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

// Base de datos
let productos = cargarProductos();

// Referencias HTML
const contenedorProductos = document.getElementById("contenedorProductos");
const totalProductos = document.getElementById("totalProductos");
const productosVisibles = document.getElementById("productosVisibles");
const buscadorProductos = document.getElementById("buscadorProductos");
const filtroTodos = document.getElementById("filtroTodos");
const filtroMangas = document.getElementById("filtroMangas");
const filtroFiguras = document.getElementById("filtroFiguras");
const filtroMerch = document.getElementById("filtroMerch");
const limpiarFiltros = document.getElementById("limpiarFiltros");

//modales
const modalAgregar = document.getElementById("modalAgregarProducto");
const modalEditar = document.getElementById("modalEditarProducto");
const cerrarAgregar = document.getElementById("cerrarModalAgregar");
const cerrarEditar = document.getElementById("cerrarModalEditar");

// formularios
const formularioAgregar = document.getElementById("formularioAgregarProducto");
const formularioEditar = document.getElementById("formularioEditarProducto");

// estado filtros
let categoriaSeleccionada = "todos";
let textoBusqueda = "";

//iconos categorias
function obtenerIconoCategoria(categoria) {
    switch (categoria) {
        case "manga":
            return "bi bi-book";

        case "figura":
            return "bi bi-controller";

        case "merch":
            return "bi bi-bag-heart";

        default:
            return "bi bi-box";
    }
}

// Nombre categoria
function obtenerNombreCategoria(categoria) {
    switch (categoria) {

        case "manga":
            return "Mangas";

        case "figura":
            return "Figuras";

        case "merch":
            return "Merch";

        default:
            return categoria;
    }
}

//creacion de tarjetas
function crearTarjetaProducto(producto) {
    return `
    <div class="col-lg-3 col-md-6 mb-4">
        <div class="tarjetaProductoAdmin ${producto.activo ? "productoActivo" : "productoInactivo"}">
            <div class="contenedorImagenProducto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <span class="badgeCategoriaProducto categoria-${producto.categoria}">
                    ${obtenerNombreCategoria(producto.categoria)}
                </span>
            </div>
            <div class="contenidoTarjetaProducto">
                <h3 class="tituloProductoAdmin">
                    ${producto.nombre}
                </h3>
                <p class="descripcionProductoAdmin">
                    ${producto.descripcion}
                </p>
                <div class="informacionProducto">
                    <div class="datoProducto">
                        <i class="bi bi-box-seam"></i>
                        <span>
                            Stock: ${producto.stock}
                        </span>
                    </div>
                </div>
                <div class="precioProductoAdmin">
                    $${producto.precio.toLocaleString("es-CO")}
                </div>
                <div class="estadoProducto">
                    <span>
                        Activo
                    </span>
                    <i
                        class="bi ${producto.activo ? "bi-toggle-on" : "bi-toggle-off"} toggleEstadoProducto"
                        onclick="cambiarEstado(${producto.id})">
                    </i>
                </div>
                <div class="accionesProducto">
                    <button
                        class="btn botonEditarProducto"
                        onclick="abrirEditar(${producto.id})">
                        <i class="bi bi-pencil-square"></i>
                        Editar
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
}

// crear seccion categoria
function crearSeccionCategoria(nombre, categoria, listaProductos) {
    if (listaProductos.length === 0) {
        return "";
    }

    let html = `
    <section class="categoriaProductos">
        <div class="tituloCategoriaProducto">
            <i class="${obtenerIconoCategoria(categoria)}"></i>
            <h2>${nombre}</h2>
        </div>
        <div class="row">
    `;

    listaProductos.forEach(producto => {
        html += crearTarjetaProducto(producto);
    });

    html += `
        </div>
    </section>
    `;
    return html;
}

// ordenar productos
function ordenarProductos(lista) {
    return lista.sort((a, b) => {
        if (a.activo === b.activo) {
            return a.nombre.localeCompare(b.nombre);
        }
        return a.activo ? -1 : 1;
    });
}

// renderizado productos
function renderizarProductos() {
    contenedorProductos.innerHTML = "";

    let lista = [...productos];

    // buscar
    if (textoBusqueda !== "") {
        lista = lista.filter(producto =>
            producto.nombre
                .toLowerCase()
                .includes(textoBusqueda)

            ||
            producto.descripcion
                .toLowerCase()
                .includes(textoBusqueda)
        );
    }

    // filtrar categoria
    if (categoriaSeleccionada !== "todos") {
        lista = lista.filter(producto =>
            producto.categoria === categoriaSeleccionada
        );
    }

    // separar categoria
    const mangas = ordenarProductos(
        lista.filter(producto =>
            producto.categoria === "manga"
        )
    );

    const figuras = ordenarProductos(
        lista.filter(producto =>
            producto.categoria === "figura"
        )
    );

    const merch = ordenarProductos(
        lista.filter(producto =>
            producto.categoria === "merch"
        )
    );

    // pintar
    contenedorProductos.innerHTML +=
        crearSeccionCategoria(
            "Mangas",
            "manga",
            mangas
        );

    contenedorProductos.innerHTML +=
        crearSeccionCategoria(
            "Figuras",
            "figura",
            figuras
        );

    contenedorProductos.innerHTML +=
        crearSeccionCategoria(
            "Merch",
            "merch",
            merch
        );

    // contadores
    contadorProductosTotal.textContent =
        productos.length;
    contadorProductosVisibles.textContent =
        lista.length;
}

// agregar productos
formularioAgregarProducto.addEventListener("submit", async function (e) {
    e.preventDefault();
    const archivo = imagenProductoAgregar.files[0];

    const imagenFinal = archivo
        ? await comprimirImagen(archivo)
        : "../../assets/img/sin-imagen.png";

    const nuevoProducto = {
        id: Date.now(),
        nombre:
            nombreProductoAgregar.value.trim(),
        descripcion:
            descripcionProductoAgregar.value.trim(),
        categoria:
            categoriaProductoAgregar.value,
        precio:
            Number(precioProductoAgregar.value),
        stock:
            Number(stockProductoAgregar.value),
        imagen: imagenFinal,
        activo: true
    };

    productos.push(nuevoProducto);

    const guardadoExitoso = guardarProductos();

    if (!guardadoExitoso) {
        // El guardado falló (ej. localStorage lleno): revertimos
        // el producto en memoria para que no quede desincronizado.
        productos = cargarProductos();
    }

    formularioAgregarProducto.reset();
    modalAgregarProducto.classList.remove("activo");
    renderizarProductos();
});

// abrir editar
function abrirEditar(id) {
    const producto = productos.find(
        p => p.id === id
    );
    if (!producto) return;
    idProductoEditar.value = producto.id;

    nombreProductoEditar.value =
        producto.nombre;

    descripcionProductoEditar.value =
        producto.descripcion;

    categoriaProductoEditar.value =
        producto.categoria;

    precioProductoEditar.value =
        producto.precio;

    stockProductoEditar.value =
        producto.stock;

    modalEditarProducto.classList.add("activo");
}

// Editar producto
formularioEditarProducto.addEventListener("submit", async function (e) {

    e.preventDefault();

    const id =
        Number(idProductoEditar.value);

    const producto = productos.find(

        p => p.id === id
    );

    if (!producto) return;

    producto.nombre =
        nombreProductoEditar.value.trim();

    producto.descripcion =
        descripcionProductoEditar.value.trim();

    producto.categoria =
        categoriaProductoEditar.value;

    producto.precio =
        Number(precioProductoEditar.value);

    producto.stock =
        Number(stockProductoEditar.value);

    const archivo =
        imagenProductoEditar.files[0];

    if (archivo) {
        producto.imagen = await comprimirImagen(archivo);
    }

    const guardadoExitoso = guardarProductos();

    if (!guardadoExitoso) {
        // El guardado falló (ej. localStorage lleno): recargamos
        // desde el storage real para no quedar desincronizados.
        productos = cargarProductos();
    }

    renderizarProductos();
    modalEditarProducto.classList.remove("activo");
});

// Activar / Desactivar
function cambiarEstado(id) {
    const producto = productos.find(
        p => p.id === id
    );
    if (!producto) return;

    producto.activo = !producto.activo;

    const guardadoExitoso = guardarProductos();

    if (!guardadoExitoso) {
        productos = cargarProductos();
    }

    renderizarProductos();
}

// MODAL PRODUCTOS - KUMO
// Buscador
buscadorProductos.addEventListener("input", function () {
    textoBusqueda = this.value.trim().toLowerCase();
    renderizarProductos();
});

// Filtros
filtroTodos.addEventListener("click", () => {
    categoriaSeleccionada = "todos";
    renderizarProductos();
});

filtroMangas.addEventListener("click", () => {
    categoriaSeleccionada = "manga";
    renderizarProductos();
});

filtroFiguras.addEventListener("click", () => {
    categoriaSeleccionada = "figura";
    renderizarProductos();
});

filtroMerch.addEventListener("click", () => {
    categoriaSeleccionada = "merch";
    renderizarProductos();
});

// Limpiar filtros
limpiarFiltros.addEventListener("click", () => {
    categoriaSeleccionada = "todos";
    textoBusqueda = "";
    buscadorProductos.value = "";
    renderizarProductos();
});

// Abrir modal agregar
botonAgregarProducto.addEventListener("click", () => {
    formularioAgregarProducto.reset();
    modalAgregarProducto.classList.add("activo");
});

// Cerrar modal agregar
cerrarModalAgregar.addEventListener("click", () => {
    modalAgregarProducto.classList.remove("activo");
});

modalAgregarProducto.addEventListener("click", (e) => {
    if (e.target === modalAgregarProducto) {
        modalAgregarProducto.classList.remove("activo");
    }
});

// Cerrar modal editar
cerrarModalEditar.addEventListener("click", () => {
    modalEditarProducto.classList.remove("activo");
});

modalEditarProducto.addEventListener("click", (e) => {

    if (e.target === modalEditarProducto) {
        modalEditarProducto.classList.remove("activo");
    }
});

// Actualizar contadores
function actualizarContadores() {
    contadorProductosTotal.textContent = productos.length;

    let visibles = productos;
    if (categoriaSeleccionada !== "todos") {
        visibles = visibles.filter(
            producto => producto.categoria === categoriaSeleccionada
        );
    }
    if (textoBusqueda !== "") {
        visibles = visibles.filter(producto =>
            producto.nombre.toLowerCase().includes(textoBusqueda) ||
            producto.descripcion.toLowerCase().includes(textoBusqueda)
        );
    }
    contadorProductosVisibles.textContent = visibles.length;
}

const renderOriginal = renderizarProductos;
renderizarProductos = function () {
    renderOriginal();
    actualizarContadores();
};

// Render inicial
renderizarProductos();