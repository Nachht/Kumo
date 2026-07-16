// ==========================================
// CARRITO - LÓGICA COMPLETA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ===== ELEMENTOS DOM =====
    const contenedor = document.getElementById("contenedorCarrito");
    const cantidadSpan = document.getElementById("cantidadServicios");
    const subtotalSpan = document.getElementById("subtotal");
    const tarifaSpan = document.getElementById("tarifa");
    const totalSpan = document.getElementById("total");
    const botonSolicitar = document.querySelector(".boton-solicitar");

    // ===== TARIFA FIJA (en pesos) =====
    const TARIFA_SERVICIO = 5000;

    // ===== CARGAR CARRITO =====
    function cargarCarrito() {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    }

    // ===== GUARDAR CARRITO =====
    function guardarCarrito(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // ===== FORMATEAR PRECIO =====
    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        });
    }

    // ===== ACTUALIZAR BADGE DEL NAVBAR =====
// ===== ACTUALIZAR BADGE DEL NAVBAR =====
function actualizarBadge() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const badge = document.getElementById("badge");
    if (badge) {
        badge.textContent = totalItems;
    }
}

    // ===== RENDERIZAR TARJETAS =====
    function renderizarCarrito() {
        // LIMPIAR completamente el contenedor
        contenedor.innerHTML = "";

        const carrito = cargarCarrito();

        if (carrito.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-cart-x" style="font-size: 4rem; color: #D1D5DB;"></i>
                    <h3 class="mt-3" style="color: #6B7280;">Tu carrito está vacío</h3>
                    <p style="color: #9CA3AF;">Explora nuestro catálogo y agrega servicios.</p>
                    <a href="../catalogo/catalogo.html" class="btn btn-primary mt-3" style="background: #4C1D95; border: none; border-radius: 12px; padding: 10px 30px;">
                        <i class="bi bi-arrow-left"></i> Ir al catálogo
                    </a>
                </div>
            `;
            actualizarTotales(carrito);
            return;
        }

        // Renderizar cada servicio
        carrito.forEach((servicio, index) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta tarjeta-servicio";
            tarjeta.dataset.index = index;

            tarjeta.innerHTML = `
                <img src="${servicio.imagen}" alt="${servicio.nombre}" class="imagen-servicio">
                <div class="info-servicio">
                    <h5 class="nombre-servicio">${servicio.nombre}</h5>
                    <p class="descripcion-servicio">${servicio.descripcion}</p>
                    <span class="etiqueta-servicio">
                        <i class="bi bi-tag"></i> ${servicio.etiqueta || 'Servicio profesional'}
                    </span>
                </div>
                <div class="precio-servicio">
                    <strong class="texto-precio">${formatearPrecio(servicio.precio)}</strong>
                </div>
                <div class="control-cantidad">
                    <button class="boton-cantidad btn-restar" data-index="${index}">−</button>
                    <input type="text" class="numero-cantidad" value="${servicio.cantidad}" readonly>
                    <button class="boton-cantidad btn-sumar" data-index="${index}">+</button>
                </div>
                <button class="boton-eliminar btn-eliminar" data-index="${index}" title="Eliminar servicio">
                    <i class="bi bi-trash"></i>
                </button>
            `;

            contenedor.appendChild(tarjeta);
        });

        // ===== EVENTOS =====
        document.querySelectorAll(".btn-sumar").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = parseInt(this.dataset.index);
                cambiarCantidad(index, 1);
            });
        });

        document.querySelectorAll(".btn-restar").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = parseInt(this.dataset.index);
                cambiarCantidad(index, -1);
            });
        });

        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = parseInt(this.dataset.index);
                eliminarServicio(index);
            });
        });

        actualizarTotales(carrito);
        actualizarBadge();
    }

    // ===== CAMBIAR CANTIDAD =====
    function cambiarCantidad(index, delta) {
        const carrito = cargarCarrito();
        if (!carrito[index]) return;

        const nuevaCantidad = carrito[index].cantidad + delta;
        if (nuevaCantidad < 1) return;

        carrito[index].cantidad = nuevaCantidad;
        guardarCarrito(carrito);
        renderizarCarrito();
    }

    // ===== ELIMINAR SERVICIO =====
    function eliminarServicio(index) {
        let carrito = cargarCarrito();
        if (!carrito[index]) return;

        const nombre = carrito[index].nombre;
        carrito.splice(index, 1);
        guardarCarrito(carrito);
        renderizarCarrito();
        actualizarBadge();
        console.log(`🗑️ Eliminado: ${nombre}`);
    }

    // ===== ACTUALIZAR TOTALES =====
    function actualizarTotales(carrito) {
        const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const tarifa = carrito.length > 0 ? TARIFA_SERVICIO : 0;
        const total = subtotal + tarifa;

        if (subtotalSpan) subtotalSpan.textContent = formatearPrecio(subtotal);
        if (tarifaSpan) tarifaSpan.textContent = formatearPrecio(tarifa);
        if (totalSpan) totalSpan.textContent = formatearPrecio(total);
        if (cantidadSpan) {
            const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            cantidadSpan.textContent = totalItems;
        }

        localStorage.setItem("carritoTotal", JSON.stringify({ subtotal, tarifa, total }));
    }

    // ===== BOTÓN SOLICITAR SERVICIOS =====
    if (botonSolicitar) {
        botonSolicitar.addEventListener("click", function () {
            const carrito = cargarCarrito();

            if (carrito.length === 0) {
                alert("🛒 Tu carrito está vacío. Agrega servicios primero.");
                return;
            }

            const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            const tarifa = TARIFA_SERVICIO;
            const total = subtotal + tarifa;

            const mensaje = `
📋 RESUMEN DE TU PEDIDO
─────────────────────
Servicios: ${carrito.length}
Subtotal: ${formatearPrecio(subtotal)}
Tarifa de servicio: ${formatearPrecio(tarifa)}
─────────────────────
TOTAL: ${formatearPrecio(total)}

¿Confirmas tu solicitud?
            `;

            if (confirm(mensaje)) {
                alert("✅ ¡Solicitud confirmada! Nos pondremos en contacto contigo.");
                // Opcional: vaciar carrito
                // localStorage.removeItem("carrito");
                // renderizarCarrito();
            }
        });
    }

    // ===== INICIALIZAR =====
    renderizarCarrito();

});