// =============================================
// CARRITO.JS - VERSIÓN COMPLETA
// =============================================

console.log('📦 carrito.js cargado');

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
function actualizarBadge() {
    const carrito = cargarCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const badgeNavbar = document.getElementById("badge");
    if (badgeNavbar) {
        badgeNavbar.textContent = totalItems;
    }
}

// ===== RENDERIZAR TODO EL CARRITO =====
// ===== RENDERIZAR TODO EL CARRITO =====
function renderizarCarrito() {
    console.log('🔄 Renderizando carrito...');
    
    const carrito = cargarCarrito();
    console.log('📦 Carrito:', carrito);
    
    // =============================================
    // 1. RENDERIZAR OFFCANVAS (contenedorArticulos)
    // =============================================
    const contenedor = document.getElementById("contenedorArticulos");
    console.log('📦 Contenedor offcanvas:', contenedor);

    if (contenedor) {
        contenedor.innerHTML = "";

        if (carrito.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center py-5 w-100">
                    <i class="bi bi-cart-x text-white-50" style="font-size: 3.5rem;"></i>
                    <h5 class="mt-3 text-white fw-bold">Tu carrito está vacío</h5>
                    <p class="text-white-50 small">Explora nuestro catálogo y agrega figuras.</p>
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
                        <img src="${articulo.imagen}" alt="${articulo.nombre}" class="rounded-2 object-fit-cover" style="width: 70px; height: 70px;">
                        
                        <div class="flex-grow-1">
                            <h6 class="fw-bold m-0 mb-1 text-dark text-truncate" style="max-width: 130px;">${articulo.nombre}</h6>
                            <span class="text-muted small d-block">${formatearPrecio(articulo.precio)}</span>
                        </div>

                        <div class="control-cantidad d-flex align-items-center border rounded bg-light px-1">
                            <button class="btn btn-sm p-1 border-0 btn-restar fw-bold text-dark" data-index="${index}">−</button>
                            <span class="px-2 fw-bold small text-dark">${articulo.cantidad}</span>
                            <button class="btn btn-sm p-1 border-0 btn-sumar fw-bold text-dark" data-index="${index}">+</button>
                        </div>

                        <button class="btn p-0 border-0 text-danger ms-1 btn-eliminar" data-index="${index}" title="Eliminar">
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

    // =============================================
    // 2. RENDERIZAR PÁGINA PRINCIPAL (tablaCarritoPrincipal)
    // =============================================
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
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-3">
                            <img src="${articulo.imagen}" alt="${articulo.nombre}" class="rounded-3 object-fit-cover bg-light" style="width: 75px; height: 75px;">
                            <div>
                                <h5 class="fw-bold m-0 text-dark">${articulo.nombre}</h5>
                                <span class="text-secondary small">${formatearPrecio(articulo.precio)}</span>
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-4">
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

// ===== MANEJO DE EVENTOS GLOBAL (DELEGACIÓN) =====
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
        alert("El carrito ya está vacío.");
        return;
    }

    if (confirm("¿Seguro que deseas vaciar todo el carrito?")) {
        localStorage.removeItem("carrito");
        renderizarCarrito();
    }
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

// ===== ACCIÓN COMPRAR =====
function ejecutarCompra() {
    const carrito = cargarCarrito();
    if (carrito.length === 0) {
        alert("🛒 Tu carrito está vacío. Agrega productos primero.");
        return;
    }

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    if (confirm(`📋 RESUMEN DE TU PEDIDO\n─────────────────────\nTotal: ${formatearPrecio(subtotal)}\n\n¿Confirmas tu compra en KUMO?`)) {
        alert("✅ ¡Compra confirmada! Nos pondremos en contacto contigo.");
    }
}

// =============================================
// ✅ FORZAR ESTILOS DEL OFFCANVAS
// =============================================
function forzarEstilosOffcanvas() {
    const offcanvas = document.getElementById('carritoKumo');
    if (!offcanvas) return;
    
    offcanvas.style.backgroundColor = '#1b1618';
    offcanvas.style.color = 'white';
    offcanvas.style.borderLeft = '2px solid #ff007f';
    
    const subtotal = document.getElementById('subtotalCarrito');
    if (subtotal) {
        subtotal.style.color = '#FF007F';
    }
    
    console.log('✅ Estilos del offcanvas forzados');
}

// =============================================
// ✅ EVENTOS DE CARGA Y ACTUALIZACIÓN
// =============================================

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
window.addEventListener('storage', function(e) {
    if (e.key === 'carrito') {
        console.log('🔄 Carrito actualizado en localStorage (otra pestaña)');
        renderizarCarrito();
    }
});

// 4. Cuando el DOM se carga
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado');
    renderizarCarrito();
});

// =============================================
// ✅ EXPONER FUNCIONES GLOBALMENTE
// =============================================
window.renderizarCarrito = renderizarCarrito;
window.cargarCarrito = cargarCarrito;
window.actualizarBadge = actualizarBadge;

console.log('✅ carrito.js cargado correctamente');