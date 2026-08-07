console.log('📦 carrito.js cargado');

// productos del admin para descontar stock al comprar
const CLAVE_PRODUCTOS_ADMIN_KUMO = "kumo_productos";

function cargarProductosKumo() {
    try {
        const datos = localStorage.getItem(CLAVE_PRODUCTOS_ADMIN_KUMO);
        return datos ? JSON.parse(datos) : [];
    } catch (error) {
        console.error("No se pudieron leer los productos:", error);
        return [];
    }
}

function guardarProductosKumo(lista) {
    try {
        localStorage.setItem(CLAVE_PRODUCTOS_ADMIN_KUMO, JSON.stringify(lista));
        return true;
    } catch (error) {
        console.error("No se pudieron guardar los productos:", error);
        return false;
    }
}

// Descuenta el stock comprado y desactiva automáticamente los productos que se agoten
function descontarStockCompra(carrito) {
    const productos = cargarProductosKumo();

    carrito.forEach(articulo => {
        const producto = productos.find(p => String(p.id) === String(articulo.id));
        if (!producto) return;

        producto.stock = Math.max(0, producto.stock - articulo.cantidad);

        // Si el stock llega a 0, el producto se desactiva automáticamente
        if (producto.stock <= 0) {
            producto.activo = false;
        }
    });

    guardarProductosKumo(productos);

    // avisa a las otras paginas que el stock cambio para que lo actualice
    document.dispatchEvent(new CustomEvent("productosKumoActualizados"));
}

// cargar carrito
function cargarCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// guardar carrito
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// formatear precio
function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });
}

// actualizar badge del navbar
function actualizarBadge() {
    const carrito = cargarCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const badgeNavbar = document.getElementById("badge");
    if (badgeNavbar) {
        badgeNavbar.textContent = totalItems;
    }
}

// renderizar carrito
function renderizarCarrito() {
    console.log('🔄 Renderizando carrito...');

    const carrito = cargarCarrito();
    console.log('📦 Carrito:', carrito);

    // renderizar offcanvas
    const contenedor = document.getElementById("contenedorArticulos");
    console.log('📦 Contenedor offcanvas:', contenedor);

    if (contenedor) {
        contenedor.innerHTML = "";

        if (carrito.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center py-5 w-100">
                    <i class="bi bi-cart-x text-muted" style="font-size: 3.5rem;"></i>
                    <h5 class="mt-3 text-dark fw-bold">Tu carrito está vacío</h5>
                    <p class="text-muted small">Explora nuestro catálogo y agrega figuras.</p>
                </div>
            `;
            console.log('✅ Offcanvas: carrito vacío');
        } else {
            carrito.forEach((articulo, index) => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "card border-0 rounded-3 p-3 text-dark style-tarjeta-producto mb-2";
                tarjeta.style.backgroundColor = "white";

                tarjeta.innerHTML = `
                    <div class="d-flex align-items-center gap-3">
                        <img src="${articulo.imagen}" alt="${articulo.nombre}" class="rounded-2 object-fit-cover flex-shrink-0" style="width: 70px; height: 70px;">
                        
                        <div class="flex-grow-1" style="min-width: 0;">
                            <h6 class="fw-bold m-0 mb-1 text-dark text-truncate">${articulo.nombre}</h6>
                            <span class="text-muted small d-block">${formatearPrecio(articulo.precio)}</span>
                        </div>

                        <div class="control-cantidad d-flex align-items-center border rounded bg-light px-1 flex-shrink-0">
                            <button class="btn btn-sm p-1 border-0 btn-restar fw-bold text-dark" data-index="${index}">−</button>
                            <span class="px-2 fw-bold small text-dark">${articulo.cantidad}</span>
                            <button class="btn btn-sm p-1 border-0 btn-sumar fw-bold text-dark" data-index="${index}">+</button>
                        </div>

                        <button class="btn p-0 border-0 text-danger ms-1 btn-eliminar flex-shrink-0" data-index="${index}" title="Eliminar">
                            <i class="bi bi-trash fs-5"></i>
                        </button>
                    </div>
                `;
                contenedor.appendChild(tarjeta);
            });
            console.log(`✅ Offcanvas: ${carrito.length} productos renderizados`);
        }
    } else {
        console.warn('⚠️ No se encontró #contenedorArticulos');
    }

    //RENDERIZAR PÁGINA PRINCIPAL (tablaCarritoPrincipal)
    const tablaPrincipal = document.getElementById("tablaCarritoPrincipal");
    console.log('📦 Contenedor página principal:', tablaPrincipal);

    if (tablaPrincipal) {
        console.log('✅ Renderizando página principal...');
        tablaPrincipal.innerHTML = "";

        if (carrito.length === 0) {
            tablaPrincipal.innerHTML = `
                <div class="card border-0 shadow-sm p-5 text-center bg-white rounded-4">
                    <i class="bi bi-cart-x text-muted d-block mb-3 fs-1 opacity-50"></i>
                    <h4 class="text-dark fw-bold mb-2">Tu carrito está vacío</h4>
                    <p class="text-secondary mb-4 small">Explora el catálogo para agregar nuevos productos.</p>
                    <a href="../catalogo/catalogo.html" class="btn btn-gradient-kumo text-white px-4 py-2 fw-bold text-uppercase rounded-pill mx-auto">
                        Ir al Catálogo
                    </a>
                </div>
            `;
            console.log('✅ Página principal: carrito vacío');
        } else {
            carrito.forEach((articulo, index) => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "card border-0 shadow-sm p-3 mb-3 bg-white rounded-4";

                tarjeta.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between gap-3">
                        <div class="d-flex align-items-center gap-3" style="min-width: 0; flex: 1 1 auto;">
                            <img src="${articulo.imagen}" alt="${articulo.nombre}" class="rounded-3 object-fit-cover bg-light flex-shrink-0" style="width: 75px; height: 75px;">
                            <div style="min-width: 0;">
                                <h5 class="fw-bold m-0 text-dark text-truncate">${articulo.nombre}</h5>
                                <span class="text-secondary small">${formatearPrecio(articulo.precio)}</span>
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-4 flex-shrink-0">
                            <div class="d-flex align-items-center rounded-pill px-2 border bg-light">
                                <button class="btn btn-sm p-1 border-0 btn-restar fw-bold text-dark" data-index="${index}">−</button>
                                <span class="px-3 fw-bold text-dark">${articulo.cantidad}</span>
                                <button class="btn btn-sm p-1 border-0 btn-sumar fw-bold text-dark" data-index="${index}">+</button>
                            </div>

                            <span class="fw-bold fs-5 text-fucsia">${formatearPrecio(articulo.precio * articulo.cantidad)}</span>

                            <button class="btn p-0 border-0 text-danger btn-eliminar ms-2" data-index="${index}" title="Eliminar producto">
                                <i class="bi bi-trash3 fs-5"></i>
                            </button>
                        </div>
                    </div>
                `;
                tablaPrincipal.appendChild(tarjeta);
            });
            console.log(`✅ Página principal: ${carrito.length} productos renderizados`);
        }
    } else {
        console.warn('⚠️ No se encontró #tablaCarritoPrincipal en la página');
        console.warn('⚠️ Los IDs disponibles son:');
        document.querySelectorAll('[id]').forEach(el => {
            console.log(`   - #${el.id}`);
        });
    }

    actualizarTotales(carrito);
    actualizarBadge();
}

// manejo de eventos
document.addEventListener("click", (e) => {
    const btnSumar = e.target.closest(".btn-sumar");
    const btnRestar = e.target.closest(".btn-restar");
    const btnEliminar = e.target.closest(".btn-eliminar");
    const btnVaciar = e.target.closest("#btnVaciarCarrito, #btnVaciarPagina");
    const btnComprar = e.target.closest("#btnComprar, #btnComprarPagina");
    const btnAbrirCart = e.target.closest(".btn-cart-offcanvas");

    if (btnSumar) {
        cambiarCantidad(parseInt(btnSumar.dataset.index), 1);
    } else if (btnRestar) {
        cambiarCantidad(parseInt(btnRestar.dataset.index), -1);
    } else if (btnEliminar) {
        eliminarArticulo(parseInt(btnEliminar.dataset.index));
    } else if (btnVaciar) {
        vaciarTodo();
    } else if (btnComprar) {
        ejecutarCompra();
    } else if (btnAbrirCart) {
        setTimeout(renderizarCarrito, 300);
    }
});

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

// ===== ELIMINAR ARTÍCULO =====
function eliminarArticulo(index) {
    let carrito = cargarCarrito();
    if (!carrito[index]) return;

    carrito.splice(index, 1);
    guardarCarrito(carrito);
    renderizarCarrito();
}

// ===== VACIAR CARRITO COMPLETO =====
function vaciarTodo() {
    const carrito = cargarCarrito();

    if (carrito.length === 0) {
        mostrarModalKumo({
            icono: "bi-cart-x-fill",
            tipoIcono: "icono-vacio",
            titulo: "Carrito vacío",
            mensajeHTML: "Tu carrito ya está vacío, no hay nada que eliminar.",
            botones: [
                { texto: "Entendido", clase: "modal-kumo-btn-ok" }
            ]
        });
        return;
    }

    mostrarModalKumo({
        icono: "bi-trash3-fill",
        tipoIcono: "",
        titulo: "Vaciar carrito",
        mensajeHTML: "¿Seguro que deseas eliminar todos los productos de tu carrito?",
        botones: [
            { texto: "Cancelar", clase: "modal-kumo-btn-cancelar" },
            {
                texto: "Vaciar",
                clase: "modal-kumo-btn-confirmar",
                accion: () => {
                    localStorage.removeItem("carrito");
                    renderizarCarrito();
                }
            }
        ]
    });
}

// ===== ACTUALIZAR TOTALES =====
function actualizarTotales(carrito) {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const subtotalSpan = document.getElementById("subtotalCarrito");
    const cantidadSpan = document.getElementById("cantidadArticulos");
    const resumenSubtotal = document.getElementById("resumenSubtotal");
    const resumenTotal = document.getElementById("resumenTotal");
    const totalItemsCount = document.getElementById("totalItemsCount");

    if (subtotalSpan) subtotalSpan.textContent = formatearPrecio(subtotal);
    if (cantidadSpan) cantidadSpan.textContent = totalItems;

    if (resumenSubtotal) resumenSubtotal.textContent = formatearPrecio(subtotal);
    if (resumenTotal) resumenTotal.textContent = formatearPrecio(subtotal);
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
}

// Crea el overlay del modal una sola vez y lo reutiliza
function crearModalKumoSiNoExiste() {
    if (document.getElementById("modalKumoOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "modalKumoOverlay";
    overlay.className = "modal-kumo-overlay";
    overlay.innerHTML = `
        <div class="modal-kumo-box">
            <div id="modalKumoIcono" class="modal-kumo-icono">
                <i class="bi bi-info-circle-fill"></i>
            </div>
            <h5 id="modalKumoTitulo" class="modal-kumo-titulo">Título</h5>
            <p id="modalKumoMensaje" class="modal-kumo-mensaje">Mensaje</p>
            <div id="modalKumoBotones" class="modal-kumo-botones"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) cerrarModalKumo();
    });
}

function cerrarModalKumo() {
    const overlay = document.getElementById("modalKumoOverlay");
    if (overlay) overlay.classList.remove("activo");
}

function mostrarModalKumo({ icono = "bi-info-circle-fill", tipoIcono = "", titulo, mensajeHTML, botones }) {
    crearModalKumoSiNoExiste();

    const overlay = document.getElementById("modalKumoOverlay");
    const iconoEl = document.getElementById("modalKumoIcono");
    const tituloEl = document.getElementById("modalKumoTitulo");
    const mensajeEl = document.getElementById("modalKumoMensaje");
    const botonesEl = document.getElementById("modalKumoBotones");

    iconoEl.className = `modal-kumo-icono ${tipoIcono}`;
    iconoEl.innerHTML = `<i class="bi ${icono}"></i>`;
    tituloEl.textContent = titulo;
    mensajeEl.innerHTML = mensajeHTML;

    botonesEl.innerHTML = "";
    botones.forEach((btn) => {
        const boton = document.createElement("button");
        boton.className = btn.clase;
        boton.textContent = btn.texto;
        boton.addEventListener("click", () => {
            cerrarModalKumo();
            if (btn.accion) btn.accion();
        });
        botonesEl.appendChild(boton);
    });

    requestAnimationFrame(() => overlay.classList.add("activo"));
}

// ===== ACCIÓN COMPRAR =====
function ejecutarCompra() {
    const carrito = cargarCarrito();

    if (carrito.length === 0) {
        mostrarModalKumo({
            icono: "bi-cart-x-fill",
            tipoIcono: "icono-vacio",
            titulo: "Carrito vacío",
            mensajeHTML: "No tienes productos en tu carrito. Agrega algunas figuras antes de continuar.",
            botones: [
                { texto: "Entendido", clase: "modal-kumo-btn-ok" }
            ]
        });
        return;
    }

    // Verificar que haya stock suficiente para cada producto antes de continuar
    const productos = cargarProductosKumo();
    const productosSinStock = [];

    carrito.forEach(articulo => {
        const producto = productos.find(p => String(p.id) === String(articulo.id));
        const stockDisponible = producto ? producto.stock : 0;
        if (articulo.cantidad > stockDisponible) {
            productosSinStock.push(articulo.nombre);
        }
    });

    if (productosSinStock.length > 0) {
        mostrarModalKumo({
            icono: "bi-exclamation-triangle-fill",
            tipoIcono: "icono-vacio",
            titulo: "Stock insuficiente",
            mensajeHTML: `No hay stock suficiente para: <strong>${productosSinStock.join(", ")}</strong>. Ajusta la cantidad en tu carrito antes de continuar.`,
            botones: [
                { texto: "Entendido", clase: "modal-kumo-btn-ok" }
            ]
        });
        return;
    }

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    mostrarModalKumo({
        icono: "bi-bag-check-fill",
        tipoIcono: "",
        titulo: "Confirmar pedido",
        mensajeHTML: `Estás a punto de confirmar tu compra en KUMO.<br><br>Total a pagar: <span class="modal-kumo-total">${formatearPrecio(subtotal)}</span>`,
        botones: [
            { texto: "Cancelar", clase: "modal-kumo-btn-cancelar" },
            {
                texto: "Confirmar",
                clase: "modal-kumo-btn-confirmar",
                accion: () => {
                    // Pequeña espera para que la animación de cierre no choque con la de apertura
                    setTimeout(() => {
                        // La compra ya se confirmó: descontamos el stock, vaciamos el carrito y actualizamos la vista
                        descontarStockCompra(carrito);
                        localStorage.removeItem("carrito");
                        renderizarCarrito();

                        mostrarModalKumo({
                            icono: "bi-check-circle-fill",
                            tipoIcono: "icono-exito",
                            titulo: "¡Compra confirmada!",
                            mensajeHTML: "Gracias por tu compra. Nos pondremos en contacto contigo muy pronto.",
                            botones: [
                                { texto: "Genial", clase: "modal-kumo-btn-ok" }
                            ]
                        });
                    }, 300);
                }
            }
        ]
    });
}

// FORZAR ESTILOS DEL OFFCANVAS
function forzarEstilosOffcanvas() {
    const offcanvas = document.getElementById('carritoKumo');
    if (!offcanvas) return;

    offcanvas.style.backgroundColor = '#ffffff';
    offcanvas.style.color = '#050505';
    offcanvas.style.borderLeft = '2px solid #ff007f';

    const subtotal = document.getElementById('subtotalCarrito');
    if (subtotal) {
        subtotal.style.color = '#FF007F';
    }

    console.log('✅ Estilos del offcanvas forzados');
}

// EVENTOS DE CARGA Y ACTUALIZACIÓN
// 1. Cuando el navbar se carga
document.addEventListener("navbarCargado", () => {
    console.log('✅ navbarCargado recibido');
    renderizarCarrito();
    setTimeout(forzarEstilosOffcanvas, 100);
});

// 2. Cuando se abre el offcanvas
document.addEventListener("show.bs.offcanvas", (e) => {
    if (e.target.id === "carritoKumo") {
        console.log('✅ Offcanvas abriéndose');
        renderizarCarrito();
        setTimeout(forzarEstilosOffcanvas, 150);
    }
});

// 3. Cuando cambia el localStorage (desde otra pestaña)
window.addEventListener('storage', function (e) {
    if (e.key === 'carrito') {
        console.log('🔄 Carrito actualizado en localStorage (otra pestaña)');
        renderizarCarrito();
    }
});

// 4. Cuando el DOM se carga
document.addEventListener('DOMContentLoaded', function () {
    console.log('📄 DOM cargado');
    renderizarCarrito();
});

window.renderizarCarrito = renderizarCarrito;
window.cargarCarrito = cargarCarrito;
window.actualizarBadge = actualizarBadge;

console.log('✅ carrito.js cargado correctamente');