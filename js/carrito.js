document.addEventListener("DOMContentLoaded", () => {

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
    function renderizarCarrito() {
        const carrito = cargarCarrito();
        const contenedor = document.getElementById("contenedorArticulos");
        const tablaPrincipal = document.getElementById("tablaCarritoPrincipal");

        // 1. Renderizar Vista Offcanvas (Desplegable Lateral)
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
            }
        }

        // 2. Renderizar Vista Principal de la Página (carrito.html)
        if (tablaPrincipal) {
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
            }
        }

        actualizarTotales(carrito);
        actualizarBadge();
    }

    // ===== MANEJO DE EVENTOS GLOBAL (DELEGACIÓN) =====
    document.addEventListener("click", (e) => {
        const btnSumar = e.target.closest(".btn-sumar");
        const btnRestar = e.target.closest(".btn-restar");
        const btnEliminar = e.target.closest(".btn-eliminar");
        
        // Se incluyen selectores para offcanvas y página principal
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
            renderizarCarrito();
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

        localStorage.setItem("carritoTotal", JSON.stringify({ subtotal, total: subtotal }));
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

    // ===== ESCUCHAR EVENTOS DE CARGA Y APERTURA =====
    document.addEventListener("navbarCargado", () => {
        renderizarCarrito();
    });

    document.addEventListener("show.bs.offcanvas", (e) => {
        if (e.target.id === "carritoKumo") {
            renderizarCarrito();
        }
    });

    // Renderizar inicialmente
    renderizarCarrito();
});