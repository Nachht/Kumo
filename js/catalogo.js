const CLAVE_PRODUCTOS_KUMO = "kumo_productos";

//categorias
const nombresCategoria = {
    manga: "Manga",
    figura: "Figura",
    merch: "Merch"
};

// Contenedores fijos categorias
const contenedoresPorCategoria = {
    manga: document.getElementById("productosCategoriaManga"),
    figura: document.getElementById("productosCategoriaFigura"),
    merch: document.getElementById("productosCategoriaMerch")
};

// Párrafos fijos categorias
const contadoresPorCategoria = {
    manga: document.getElementById("contadorSeccionManga"),
    figura: document.getElementById("contadorSeccionFigura"),
    merch: document.getElementById("contadorSeccionMerch")
};

//variables
const inputBuscadorCatalogo = document.getElementById("buscadorCatalogo");
const btnLimpiarBusquedaCatalogo = document.getElementById("btnLimpiarBusquedaCatalogo");
const contadorCatalogoTotal = document.getElementById("contadorCatalogoTotal");
const contadorCatalogoVisibles = document.getElementById("contadorCatalogoVisibles");
let productosCatalogo = [];
let textoBusquedaCatalogo = "";

// precio formateado
function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });
}

// productos desde el admin
function cargarProductosCatalogo() {
    try {

        const datosGuardados = localStorage.getItem(CLAVE_PRODUCTOS_KUMO);
        productosCatalogo = datosGuardados ? JSON.parse(datosGuardados) : [];

    } catch (error) {

        console.error("No se pudieron leer los productos del catálogo:", error);
        productosCatalogo = [];
    }
}

// tarjeta del producto
function crearTarjetaProductoCatalogo(producto) {
    const columna = document.createElement("div");
    columna.className = "col-lg-3 col-md-4 col-sm-6";
    const nombreCategoria = nombresCategoria[producto.categoria] || producto.categoria;
    columna.innerHTML = `
        <div class="tarjetaProductoCatalogo">
            <div class="contenedorImagenCatalogo">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <span class="etiquetaCategoriaCatalogo categoria-${producto.categoria}">
                    ${nombreCategoria}
                </span>
            </div>
            <div class="contenidoTarjetaCatalogo">
                <h3 class="tituloProductoCatalogo">${producto.nombre}</h3>
                <p class="descripcionProductoCatalogo">${producto.descripcion}</p>
                <div class="datoStockCatalogo">
                    <i class="bi bi-box-seam"></i>
                    <span>${producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado"}</span>
                </div>
                <div class="pieTarjetaCatalogo">
                    <span class="precioProductoCatalogo">${formatearPrecio(producto.precio)}</span>
                    <button
                        class="botonAgregarCarrito${producto.stock <= 0 ? " deshabilitado" : ""}"
                        title="${producto.stock > 0 ? "Agregar al carrito" : "Sin stock disponible"}"
                        ${producto.stock <= 0 ? "disabled" : ""}
                        data-id="${producto.id}"
                        data-nombre="${producto.nombre}"
                        data-descripcion="${producto.descripcion}"
                        data-precio="${producto.precio}"
                        data-imagen="${producto.imagen}">
                        <i class="bi bi-cart-plus-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    return columna;
}

// llenar categorias con los productos
function renderizarCatalogo() {
    const productosActivos = productosCatalogo.filter(producto => {
        const texto = textoBusquedaCatalogo.toLowerCase();
        const coincideBusqueda =
            producto.nombre.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto);
        return producto.activo && coincideBusqueda;
    });

    contadorCatalogoTotal.textContent =
        productosCatalogo.filter(producto => producto.activo).length;

    contadorCatalogoVisibles.textContent = productosActivos.length;

    Object.keys(contenedoresPorCategoria).forEach(categoria => {
        const contenedor = contenedoresPorCategoria[categoria];
        const contadorTexto = contadoresPorCategoria[categoria];

        if (!contenedor) return;
        contenedor.innerHTML = "";
        const productosCategoria = productosActivos.filter(
            producto => producto.categoria === categoria
        );

        if (contadorTexto) {
            contadorTexto.textContent =
                `${productosCategoria.length} ${productosCategoria.length === 1 ? "producto disponible" : "productos disponibles"}`;
        }

        if (productosCategoria.length === 0) {
            contenedor.innerHTML = `<p class="mensajeVacioSeccion">No hay productos en esta categoría por ahora.</p>`;
            return;
        }

        productosCategoria.forEach(producto => {
            contenedor.appendChild(crearTarjetaProductoCatalogo(producto));
        });
    });

    // eventos botones
    document.querySelectorAll(".botonAgregarCarrito").forEach(boton => {
        boton.addEventListener("click", function () {
            const producto = {
                id: this.dataset.id,
                nombre: this.dataset.nombre,
                descripcion: this.dataset.descripcion,
                precio: parseFloat(this.dataset.precio),
                imagen: this.dataset.imagen,
                cantidad: 1
            };
            agregarAlCarrito(producto);
        });
    });
}

// agregar al carrito
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
        existente.cantidad += 1;

    } else {
        carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarBadgeCarrito();
    mostrarModalCarrito(producto.nombre);
}

// modal de confirmacion carrito
function mostrarModalCarrito(nombreProducto) {
    const modalExistente = document.getElementById("modalCarritoKumo");
    if (modalExistente) modalExistente.remove();
    const modal = document.createElement("div");
    modal.id = "modalCarritoKumo";
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 40px 35px;
            max-width: 420px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease;
        ">
            <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
            <h3 style="color: #1E1B4B; font-weight: 800; margin-bottom: 8px;">
                ¡Agregado al carrito!
            </h3>
            <p style="color: #6B7280; margin-bottom: 25px;">
                <strong>"${nombreProducto}"</strong> se agregó correctamente.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
                <button onclick="cerrarModalCarrito()" style="
                    background: #E5E7EB;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    color: #1E1B4B;
                    cursor: pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#D1D5DB'" onmouseout="this.style.background='#E5E7EB'">
                    Seguir comprando
                </button>
                <a href="../carrito/carrito.html" style="
                    background: #4C1D95;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    color: white;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#6C2BD9'" onmouseout="this.style.background='#4C1D95'">
                    Ir al carrito 🛒
                </a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrarModalCarrito();
    });
}

function cerrarModalCarrito() {

    const modal = document.getElementById("modalCarritoKumo");
    if (modal) modal.remove();
}

// actualizar navbar
function actualizarBadgeCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const badge = document.getElementById("badge");
    if (badge) badge.textContent = totalItems;
    const cantidadServicios = document.getElementById("cantidadServicios");
    if (cantidadServicios) cantidadServicios.textContent = totalItems;
}

// animacion modal
const estilosModalCatalogo = document.createElement("style");

estilosModalCatalogo.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;

document.head.appendChild(estilosModalCatalogo);

// mostrar u ocultar el botón de limpiar según el contenido del buscador
function actualizarBotonLimpiarBusqueda() {
    if (!btnLimpiarBusquedaCatalogo) return;
    btnLimpiarBusquedaCatalogo.classList.toggle("visible", inputBuscadorCatalogo.value.trim().length > 0);
}

// buscador
inputBuscadorCatalogo.addEventListener("input", function () {
    textoBusquedaCatalogo = this.value.trim();
    actualizarBotonLimpiarBusqueda();
    renderizarCatalogo();
});

// limpiar búsqueda con el botón de escoba
if (btnLimpiarBusquedaCatalogo) {
    btnLimpiarBusquedaCatalogo.addEventListener("click", () => {
        inputBuscadorCatalogo.value = "";
        textoBusquedaCatalogo = "";
        actualizarBotonLimpiarBusqueda();
        renderizarCatalogo();
        inputBuscadorCatalogo.focus();
    });
}

// sincronizacion con admin
window.addEventListener("storage", (evento) => {

    if (evento.key === CLAVE_PRODUCTOS_KUMO) {

        cargarProductosCatalogo();
        renderizarCatalogo();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    cargarProductosCatalogo();
    const parametrosUrl = new URLSearchParams(window.location.search);

    const terminoBusqueda = parametrosUrl.get("buscar");

    if (terminoBusqueda) {
        textoBusquedaCatalogo = terminoBusqueda;
        if (inputBuscadorCatalogo) inputBuscadorCatalogo.value = terminoBusqueda;
    }

    actualizarBotonLimpiarBusqueda();
    renderizarCatalogo();
    actualizarBadgeCarrito();
});