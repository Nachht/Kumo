// ==========================================
// CATÁLOGO - AGREGAR AL CARRITO
// ==========================================


// ================= VARIABLES =================
const contenedorServicios = document.getElementById("servicesGrid");
const inputBusqueda = document.getElementById("searchInput");
const totalServicios = document.getElementById("totalCount");
const serviciosVisibles = document.getElementById("visibleCount");

let listaServicios = [];
let textoBusqueda = "";

// ================= FORMATEAR PRECIO =================
function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });
}

// ================= CARGAR SERVICIOS =================
document.addEventListener("DOMContentLoaded", () => {
    const serviciosGuardados = localStorage.getItem("listaServicios");

    if (serviciosGuardados) {
        listaServicios = JSON.parse(serviciosGuardados);
    } else {
        listaServicios = [];
    }

    renderizarServicios();
    actualizarContadores();
    actualizarBadgeCarrito();
});

// ================= BUSCADOR =================
inputBusqueda.addEventListener("input", function () {
    textoBusqueda = this.value.trim();
    renderizarServicios();
});

// ================= RENDERIZAR SERVICIOS =================
function renderizarServicios() {
    contenedorServicios.innerHTML = "";
    const serviciosActivos = listaServicios.filter(servicio => {
        const coincideBusqueda =
            servicio.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
            servicio.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase());
        return servicio.activo && coincideBusqueda;
    });

    serviciosVisibles.textContent = serviciosActivos.length;
    totalServicios.textContent = listaServicios.filter(servicio => servicio.activo).length;

    if (serviciosActivos.length === 0) {
        contenedorServicios.innerHTML = `
            <div class="col-12 text-center mt-5">
                <h3>No hay servicios disponibles.</h3>
            </div>
        `;
        return;
    }

    serviciosActivos.forEach(servicio => {
        const card = document.createElement("div");
        card.className = "col-lg-4 col-md-6 col-12";
        card.innerHTML = `
            <div class="service-card">
                <div class="service-img-container">
                    <img src="${servicio.imagen}" alt="${servicio.nombre}">
                </div>
                <div class="text-center mt-4">
                    <h3 class="service-card-title">${servicio.nombre}</h3>
                    <p class="service-card-desc">${servicio.descripcion}</p>
                    <div class="service-card-price">${formatearPrecio(servicio.precio)}</div>
                    <button class="btn btn-primary mt-3 btn-solicitar" 
                            data-id="${servicio.id}"
                            data-nombre="${servicio.nombre}"
                            data-descripcion="${servicio.descripcion}"
                            data-precio="${servicio.precio}"
                            data-imagen="${servicio.imagen}"
                            data-etiqueta="${servicio.etiqueta || 'Servicio profesional'}">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        contenedorServicios.appendChild(card);
    });

    // ===== EVENTOS DE LOS BOTONES =====
    document.querySelectorAll(".btn-solicitar").forEach(boton => {
        boton.addEventListener("click", function () {
            const servicio = {
                id: this.dataset.id || Date.now() + Math.random(),
                nombre: this.dataset.nombre,
                descripcion: this.dataset.descripcion,
                precio: parseFloat(this.dataset.precio),
                imagen: this.dataset.imagen,
                etiqueta: this.dataset.etiqueta,
                cantidad: 1
            };
            agregarAlCarrito(servicio);
        });
    });
}

// ================= AGREGAR AL CARRITO =================
function agregarAlCarrito(servicio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existente = carrito.find(item => item.id === servicio.id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push(servicio);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarBadgeCarrito();
    mostrarModal(servicio.nombre);
}

// ================= MODAL =================
function mostrarModal(nombreServicio) {
    const modalExistente = document.getElementById("modalCarrito");
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement("div");
    modal.id = "modalCarrito";
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
                <strong>"${nombreServicio}"</strong> se agregó correctamente.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
                <button onclick="cerrarModal()" style="
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
        if (e.target === modal) cerrarModal();
    });
}

function cerrarModal() {
    const modal = document.getElementById("modalCarrito");
    if (modal) modal.remove();
}

// ================= ACTUALIZAR BADGE DEL NAVBAR =================
function actualizarBadgeCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const badge = document.getElementById("badge");
    if (badge) {
        badge.textContent = totalItems;
    }

    const cantidadServicios = document.getElementById("cantidadServicios");
    if (cantidadServicios) {
        cantidadServicios.textContent = totalItems;
    }
}

// ================= CONTADORES =================
function actualizarContadores() {
    const activos = listaServicios.filter(servicio => servicio.activo).length;
    totalServicios.textContent = activos;
    serviciosVisibles.textContent = activos;
}

// ================= ESTILOS DE ANIMACIÓN =================
const estilos = document.createElement("style");
estilos.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(estilos);



// ==========================================
// CATÁLOGO - BÚSQUEDA DESDE NAVBAR
// ==========================================

// ================= AL INICIAR =================
document.addEventListener("DOMContentLoaded", () => {
    const serviciosGuardados = localStorage.getItem("listaServicios");

    if (serviciosGuardados) {
        listaServicios = JSON.parse(serviciosGuardados);
    } else {
        listaServicios = [];
    }

    // ✅ LEER TÉRMINO DE BÚSQUEDA DESDE LA URL
    const urlParams = new URLSearchParams(window.location.search);
    const terminoBusqueda = urlParams.get('buscar');

    if (terminoBusqueda) {
        textoBusqueda = terminoBusqueda;
        // Mostrar el término en el input de búsqueda del catálogo
        if (inputBusqueda) {
            inputBusqueda.value = terminoBusqueda;
        }
    }

    renderizarServicios();
    actualizarContadores();
    actualizarBadgeCarrito();
});