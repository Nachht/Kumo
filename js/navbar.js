document.addEventListener("DOMContentLoaded", () => {

    // =============================================
    // MAPA DE PÁGINAS
    // =============================================
    function obtenerNombrePagina() {
        const path = window.location.pathname;
        const paginas = [
            { rutas: ["nosotros"], nombre: "Nosotros", icono: "bi-people" },
            { rutas: ["catalogo"], nombre: "Servicios", icono: "bi-grid" },
            { rutas: ["contactenos"], nombre: "Contacto", icono: "bi-envelope" },
            { rutas: ["preguntas-frecuentes", "preguntas", "faq"], nombre: "FAQ", icono: "bi-question-circle" },
            { rutas: ["perfil"], nombre: "Mi cuenta", icono: "bi-person" },
            { rutas: ["carrito"], nombre: "Carrito", icono: "bi-cart3" },
            { rutas: ["admin-servicios"], nombre: "admin-servicios", icono: "bi-cart3" },
            { rutas: ["inicio", "index"], nombre: "Inicio", icono: "bi-house-door" }
        ];
        for (const pagina of paginas) {
            for (const ruta of pagina.rutas) {
                if (path.includes(ruta)) {
                    return pagina;
                }
            }
        }
        return { nombre: "Página", icono: "bi-file-earmark" };
    }

    // =============================================
    // INYECTAR ESTRUCTURA DEL OFFCANVAS
    // =============================================
    // =============================================
// INYECTAR ESTRUCTURA DEL OFFCANVAS (CORREGIDO)
// =============================================
function prepararOffcanvasCarrito() {
    if (!document.getElementById("carritoKumo")) {
        const offcanvasHTML = `
            <div class="offcanvas offcanvas-end" tabindex="-1" id="carritoKumo" aria-labelledby="carritoKumoLabel">
                
                <!-- ENCABEZADO CON VACIAR -->
                <div class="offcanvas-header border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                    <h6 class="offcanvas-title fw-bold text-uppercase small text-fucsia-neon m-0" id="carritoKumoLabel">
                        CARRITO (<span id="cantidadArticulos">0</span>)
                    </h6>
                    <div class="d-flex align-items-center gap-2">
                        <button id="btnVaciarCarrito" class="btn btn-link text-white-50 text-decoration-none p-0 small fw-bold text-uppercase btn-vaciar-offcanvas">
                            <i class="bi bi-trash3 me-1"></i> Vaciar
                        </button>
                        <button type="button" class="btn-close btn-close-white ms-2" id="cerrarOffcanvasManual" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                </div>

                <!-- CUERPO DE PRODUCTOS -->
                <div class="offcanvas-body">
                    <div id="contenedorArticulos" class="d-flex flex-column gap-2"></div>
                </div>

                <!-- PIE DE PÁGINA FIJO CON BOTONES FUCSIA LED -->
                <div class="offcanvas-footer">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="small fw-bold text-white-50 text-uppercase" style="font-size: 0.75rem;">Subtotal</span>
                        <span id="subtotalCarrito" class="fw-bold fs-5 text-fucsia-neon">$0</span>
                    </div>

                    <div class="d-flex flex-column gap-2 text-center">
                        <button id="btnComprar" class="btn btn-fucsia-led w-100 rounded-pill">
                            COMPRAR
                        </button>

                        <a href="../carrito/carrito.html" class="btn btn-outline-fucsia-led w-100 rounded-pill">
                            VER CARRITO COMPLETO
                        </a>

                        <button type="button" class="btn btn-link text-decoration-none text-uppercase fw-bold p-0 mt-1 btn-seguir-viendo" data-bs-dismiss="offcanvas">
                            SEGUIR VIENDO
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", offcanvasHTML);
    }
}
    // =============================================
    // ESCUCHADOR GLOBAL PARA ABRIR Y CERRAR EL CARRITO
    // =============================================
    document.addEventListener("click", (e) => {
        const btnCarrito = e.target.closest('.btn-cart-offcanvas');
        const btnCerrar = e.target.closest('#cerrarOffcanvasManual') || e.target.closest('[data-bs-dismiss="offcanvas"]');
        const offcanvasEl = document.getElementById("carritoKumo");

        if (btnCarrito && offcanvasEl) {
            e.preventDefault();
            if (window.bootstrap && window.bootstrap.Offcanvas) {
                const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
                bsOffcanvas.show();
            } else {
                offcanvasEl.classList.add("show");
                offcanvasEl.style.visibility = "visible";
            }
        }

        if (btnCerrar && offcanvasEl) {
            if (window.bootstrap && window.bootstrap.Offcanvas) {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (bsOffcanvas) bsOffcanvas.hide();
            }
            offcanvasEl.classList.remove("show");
            offcanvasEl.style.visibility = "hidden";
        }
    });

    // =============================================
    // MARCAR ENLACE ACTIVO
    // =============================================
    function marcarEnlaceActivo() {
        const path = window.location.pathname;
        const enlaces = document.querySelectorAll('.menu-link');

        enlaces.forEach(enlace => {
            const href = enlace.getAttribute('href');
            if (href && path.includes(href.replace('../', '').replace('.html', ''))) {
                enlace.classList.add('active');
            } else {
                enlace.classList.remove('active');
            }
        });
    }

    // =============================================
    // ACTUALIZAR BADGE DEL CARRITO
    // =============================================
    function actualizarBadgeCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

        let badge = document.getElementById("badge");

        if (badge) {
            badge.textContent = totalItems;
        } else {
            const cartBtn = document.querySelector('.btn-cart-offcanvas');
            if (cartBtn) {
                const newBadge = document.createElement('span');
                newBadge.id = "badge";
                newBadge.className = 'badge-number';
                newBadge.textContent = totalItems;
                cartBtn.appendChild(newBadge);
            }
        }
    }

    // =============================================
    // MANEJAR BÚSQUEDA
    // =============================================
    function manejarBusqueda() {
        const input = document.getElementById("searchInputNav");
        const icon = document.getElementById("searchIcon");

        if (!input) return;

        function ejecutarBusqueda() {
            const termino = input.value.trim();
            if (termino === "") {
                window.location.href = "../catalogo/catalogo.html";
            } else {
                window.location.href = `../catalogo/catalogo.html?buscar=${encodeURIComponent(termino)}`;
            }
        }

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                ejecutarBusqueda();
            }
        });

        if (icon) {
            icon.addEventListener("click", (e) => {
                e.preventDefault();
                ejecutarBusqueda();
            });
        }
    }

    // =============================================
    // CARGAR NAVBAR DESDE HTML E INICIALIZAR
    // =============================================
    fetch("../navbar/navbar-completo.html")
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);

            // 1. Preparar HTML del offcanvas
            prepararOffcanvasCarrito();

            // 2. Hamburguesa responsive
            const hamburger = document.getElementById("hamburgerBtn");
            const navMenu = document.getElementById("navMenu");

            if (hamburger && navMenu) {
                hamburger.addEventListener("click", () => {
                    navMenu.classList.toggle("open");
                    hamburger.innerHTML = navMenu.classList.contains("open") 
                        ? '<i class="bi bi-x"></i>' 
                        : '<i class="bi bi-list"></i>';
                });

                document.querySelectorAll(".menu-link").forEach(link => {
                    link.addEventListener("click", () => {
                        navMenu.classList.remove("open");
                        hamburger.innerHTML = '<i class="bi bi-list"></i>';
                    });
                });
            }

            // 3. Efecto scroll
            const navbar = document.querySelector(".navbar-kumo");
            if (navbar) {
                window.addEventListener("scroll", () => {
                    navbar.classList.toggle("scrolled", window.scrollY > 50);
                });
            }

            // 4. Búsqueda, badge y active link
            manejarBusqueda();
            marcarEnlaceActivo();
            actualizarBadgeCarrito();

            // 📢 NOTIFICAR A OTROS SCRIPTS QUE EL NAVBAR Y EL OFFCANVAS YA ESTÁN EN EL DOM
            document.dispatchEvent(new CustomEvent("navbarCargado"));
        })
        .catch(err => console.warn("⚠️ No se pudo cargar el navbar:", err));

});