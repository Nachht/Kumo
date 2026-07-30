console.log("✅ Hola navbar - JS cargado correctamente");

// =============================================
// 1. CARGAR BOOTSTRAP JS SI NO ESTÁ DISPONIBLE
// =============================================

function cargarBootstrap() {
    if (typeof bootstrap !== 'undefined') {
        console.log('✅ Bootstrap ya está disponible');
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            console.error('❌ Error al cargar Bootstrap');
            reject();
        };
        document.head.appendChild(script);
    });
}

// =============================================
// 2. FUNCIONES DE AUTENTICACIÓN (TUYAS)
// =============================================

function obtenerUsuarioLogueado() {
    const usuario = localStorage.getItem("usuarioActivo");
    if (usuario) {
        try {
            return JSON.parse(usuario);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function estaLogueado() {
    return obtenerUsuarioLogueado() !== null;
}

function cerrarSesion() {
    console.log("🚪 Cerrando sesión...");
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("kumo_usuario");
    window.location.reload();
}

// =============================================
// 3. OFFCANVAS DEL CARRITO (AGREGADO DE TU COMPAÑERA)
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
                <!-- PIE DE PÁGINA FIJO CON BOTONES -->
                <div class="offcanvas-footer">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="small fw-bold text-white-50 text-uppercase" style="font-size: 0.75rem;">Subtotal</span>
                        <span id="subtotalCarrito" class="fw-bold fs-5 text-fucsia-neon">$0</span>
                    </div>
                    <div class="d-flex flex-column gap-2 text-center">
                        <button id="btnComprar" class="btn btn-fucsia-led w-100 rounded-pill">COMPRAR</button>
                        <a href="../carrito/carrito.html" class="btn btn-outline-fucsia-led w-100 rounded-pill">VER CARRITO COMPLETO</a>
                        <button type="button" class="btn btn-link text-decoration-none text-uppercase fw-bold p-0 mt-1 btn-seguir-viendo" data-bs-dismiss="offcanvas">SEGUIR VIENDO</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", offcanvasHTML);
    }
}

// =============================================
// 4. CARGAR NAVBAR (TU VERSIÓN CON RUTAS DINÁMICAS)
// =============================================

function cargarNavbar() {
    const path = window.location.pathname;
    let rutaNavbar = '../navbar/navbar-completo.html';
    
    if (path.includes('/administrador/')) {
        rutaNavbar = '../../navbar/navbar-completo.html';
    } else if (path.includes('/inicio/') || path.includes('/catalogo/') || 
               path.includes('/nosotros/') || path.includes('/contactenos/')) {
        rutaNavbar = '../navbar/navbar-completo.html';
    }

    console.log('📦 Cargando navbar desde:', rutaNavbar);

    cargarBootstrap()
        .then(() => {
            return fetch(rutaNavbar);
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            
            // AGREGADO: Preparar Offcanvas del carrito
            prepararOffcanvasCarrito();
            
            setTimeout(() => {
                actualizarMenuUsuario();
                inicializarInteracciones();
                crearBadge();
                actualizarBadgeCarrito();
            }, 100);
        })
        .catch(err => console.warn("⚠️ No se pudo cargar el navbar:", err));
}

// =============================================
// 5. CREAR BADGE DEL CARRITO (TU VERSIÓN)
// =============================================

function crearBadge() {
    const usuario = obtenerUsuarioLogueado();
    if (!usuario) {
        console.log('👤 Usuario no logueado, badge no creado');
        return;
    }

    const carritoBtn = document.querySelector('.btn-cart-offcanvas');
    if (!carritoBtn) {
        console.warn('⚠️ Botón de carrito no encontrado');
        return;
    }

    let badge = carritoBtn.querySelector('.badge-number');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge-number';
        badge.id = 'badge';
        badge.textContent = '0';
        carritoBtn.style.position = 'relative';
        carritoBtn.appendChild(badge);
    }
}

// =============================================
// 6. ACTUALIZAR BADGE DEL CARRITO (TU VERSIÓN)
// =============================================

function actualizarBadgeCarrito() {
    const usuario = obtenerUsuarioLogueado();
    const carritoBtn = document.querySelector('.btn-cart-offcanvas');
    
    if (!carritoBtn) return;

    let badge = carritoBtn.querySelector('.badge-number');

    if (!usuario) {
        if (badge) {
            badge.style.display = 'none';
            console.log('👤 Usuario no logueado, badge oculto');
        }
        return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge-number';
        badge.id = 'badge';
        badge.textContent = '0';
        carritoBtn.style.position = 'relative';
        carritoBtn.appendChild(badge);
        console.log('✅ Badge creado');
    }

    badge.style.display = 'flex';
    badge.textContent = totalItems;
}

// =============================================
// 7. ACTUALIZAR MENÚ DE USUARIO (TU VERSIÓN)
// =============================================

function actualizarMenuUsuario() {
    const usuario = obtenerUsuarioLogueado();
    
    const cuentaLink = document.querySelector('.icon-link[href*="perfil"]');
    if (!cuentaLink) {
        console.warn('⚠️ No se encontró el enlace "Cuenta"');
        return;
    }

    const menuContainer = document.createElement('div');
    menuContainer.className = 'user-menu-container';
    menuContainer.style.cssText = 'display: flex; align-items: center; gap: 12px;';
    
    if (usuario) {
        const nombre = usuario.nombre || usuario.nombres || 'Usuario';
        const primerNombre = nombre.split(' ')[0];
        
        menuContainer.innerHTML = `
            <div class="dropdown">
                <button class="btn-user-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle"></i>
                    <span class="user-name">${primerNombre}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="../perfil/perfil.html"><i class="bi bi-person"></i> Mi perfil</a></li>
                    <li><a class="dropdown-item" href="../pedidos/pedidos.html"><i class="bi bi-box-seam"></i> Mis pedidos</a></li>
                    ${usuario.rol === 'admin' ? `
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="../administrador/html/admin-servicios.html"><i class="bi bi-shield-lock"></i> Panel Admin</a></li>
                    ` : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger" onclick="cerrarSesion()"><i class="bi bi-box-arrow-right"></i> Cerrar sesión</button></li>
                </ul>
            </div>
        `;
    } else {
        menuContainer.innerHTML = `
            <a href="../inicio_sesion/inicio_sesion.html" class="btn-login">
                <i class="bi bi-box-arrow-in-right"></i> Ingresar
            </a>
            <a href="../registro/registro.html" class="btn-registro">
                <i class="bi bi-person-plus"></i> Registrarse
            </a>
        `;
    }
    
    cuentaLink.replaceWith(menuContainer);
}

// =============================================
// 8. INICIALIZAR DROPDOWNS (TU VERSIÓN)
// =============================================

function inicializarDropdowns() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
        document.querySelectorAll('.dropdown-toggle').forEach(element => {
            try {
                const existing = bootstrap.Dropdown.getInstance(element);
                if (existing) existing.dispose();
            } catch(e) {}
            
            try {
                new bootstrap.Dropdown(element);
            } catch(e) {
                console.warn('⚠️ Error al crear dropdown:', e);
            }
        });
    } else {
        console.warn('⚠️ Bootstrap no disponible, reintentando...');
        setTimeout(inicializarDropdowns, 500);
    }
}

// =============================================
// 9. INICIALIZAR INTERACCIONES (TU VERSIÓN + Offcanvas)
// =============================================

function inicializarInteracciones() {
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

    const navbar = document.querySelector(".navbar-kumo");
    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        });
    }

    manejarBusqueda();
    marcarEnlaceActivo();

    // ===== REDIRECCIÓN DEL CARRITO (TU VERSIÓN CON VERIFICACIÓN DE LOGIN) =====
    const carritoBtn = document.querySelector('.btn-cart-offcanvas');
    if (carritoBtn) {
        carritoBtn.removeAttribute('data-bs-toggle');
        carritoBtn.removeAttribute('data-bs-target');
        carritoBtn.removeAttribute('aria-controls');
        
        carritoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (estaLogueado()) {
                window.location.href = '../carrito/carrito.html';
            } else {
                window.location.href = '../inicio/index.html';
            }
        });
        console.log('✅ Redirección del carrito configurada (con verificación de login)');
    }

    // ===== MANEJAR APERTURA DEL OFFCANVAS DESDE EL NAVBAR =====
    // Si el botón del carrito tiene data-bs-toggle, lo manejamos
    const btnCarritoOffcanvas = document.querySelector('.btn-cart-offcanvas');
    if (btnCarritoOffcanvas && !btnCarritoOffcanvas.hasAttribute('data-bs-toggle')) {
        // Si no tiene el atributo, no hacemos nada porque ya manejamos la redirección
        console.log('ℹ️ El carrito usa redirección en lugar de offcanvas');
    }

    setTimeout(inicializarDropdowns, 200);
}

// =============================================
// 10. FUNCIONES AUXILIARES (TU VERSIÓN)
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

function manejarBusqueda() {
    const input = document.getElementById("searchInputNav");
    const icon = document.getElementById("searchIcon");

    if (!input) return;

    function ejecutarBusqueda() {
        const termino = input.value.trim();
        const path = window.location.pathname;
        let rutaCatalogo = '../catalogo/catalogo.html';
        if (path.includes('/administrador/')) {
            rutaCatalogo = '../../catalogo/catalogo.html';
        }

        if (termino === "") {
            window.location.href = rutaCatalogo;
        } else {
            window.location.href = `${rutaCatalogo}?buscar=${encodeURIComponent(termino)}`;
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
// 11. ESCUCHAR CAMBIOS EN LOCALSTORAGE
// =============================================

window.addEventListener('storage', function(e) {
    if (e.key === 'carrito') {
        console.log('🔄 Carrito actualizado desde otra pestaña');
        actualizarBadgeCarrito();
    }
    if (e.key === 'usuarioActivo' || e.key === 'kumo_usuario') {
        console.log('🔄 Usuario actualizado desde otra pestaña');
        window.location.reload();
    }
});

// =============================================
// 12. ACTUALIZAR BADGE CADA 1 SEGUNDO
// =============================================
setInterval(actualizarBadgeCarrito, 1000);

// =============================================
// 13. INICIALIZAR
// =============================================

console.log('🚀 Inicializando navbar...');

window.cerrarSesion = cerrarSesion;

document.addEventListener('DOMContentLoaded', function() {
    cargarNavbar();
});