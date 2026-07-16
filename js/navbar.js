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
    // FUNCIÓN PARA MARCAR EL ENLACE ACTIVO
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
    // FUNCIÓN PARA ACTUALIZAR EL BADGE DEL CARRITO
    // =============================================
    function actualizarBadgeCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

        let badge = document.getElementById("badge");

        if (badge) {
            badge.textContent = totalItems;
        } else {
            const cartIcon = document.querySelector('.icon-link[href*="carrito"]');
            if (cartIcon) {
                const newBadge = document.createElement('span');
                newBadge.id = "badge";
                newBadge.className = 'badge-number';
                newBadge.textContent = totalItems;
                cartIcon.appendChild(newBadge);
            }
        }
    }

    // =============================================
    // FUNCIÓN PARA MANEJAR LA BÚSQUEDA
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
    // 1. CARGAR NAVBAR
    // =============================================
    fetch("../navbar/navbar-completo.html")
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);

            // =============================================
            // 2. INICIALIZAR INTERACCIONES
            // =============================================

            // === TOGGLE MENÚ HAMBURGUESA ===
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

            // === EFECTO SCROLL ===
            const navbar = document.querySelector(".navbar-kumo");
            if (navbar) {
                window.addEventListener("scroll", () => {
                    navbar.classList.toggle("scrolled", window.scrollY > 50);
                });
            }

            // === BADGE DINÁMICO EN CARRITO ===
            const cartIcon = document.querySelector('.icon-link[href*="carrito"]');
            if (cartIcon) {
                let badge = document.getElementById("badge");
                if (!badge) {
                    badge = document.createElement('span');
                    badge.id = "badge";
                    badge.className = 'badge-number';
                    badge.textContent = '0';
                    cartIcon.appendChild(badge);
                }
            }

            // === BÚSQUEDA ===
            manejarBusqueda();

            // ✅ MARCAR ENLACE ACTIVO
            marcarEnlaceActivo();

            // ✅ ACTUALIZAR BADGE
            actualizarBadgeCarrito();

        })
        .catch(err => console.warn("⚠️ No se pudo cargar el navbar:", err));

});