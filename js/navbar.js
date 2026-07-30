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
// 2. FUNCIONES DE AUTENTICACIÓN
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
// 3. CARGAR NAVBAR
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
            
            setTimeout(() => {
                actualizarMenuUsuario();
                inicializarInteracciones();
                crearBadge();           // ← Solo crea si está logueado
                actualizarBadgeCarrito(); // ← Muestra u oculta según login
            }, 100);
        })
        .catch(err => console.warn("⚠️ No se pudo cargar el navbar:", err));
}

// =============================================
// 4. CREAR BADGE DEL CARRITO (solo si está logueado)
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
// 5. ACTUALIZAR BADGE DEL CARRITO
// =============================================

function actualizarBadgeCarrito() {
    const usuario = obtenerUsuarioLogueado();
    const carritoBtn = document.querySelector('.btn-cart-offcanvas');
    
    if (!carritoBtn) return;

    let badge = carritoBtn.querySelector('.badge-number');

    // Si no está logueado
    if (!usuario) {
        if (badge) {
            badge.style.display = 'none';
            console.log('👤 Usuario no logueado, badge oculto');
        }
        return;
    }

    // Si está logueado, mostrar y actualizar
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
// 6. ACTUALIZAR MENÚ DE USUARIO
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
// 7. INICIALIZAR DROPDOWNS
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
// 8. INICIALIZAR INTERACCIONES
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

    const carritoBtn = document.querySelector('.btn-cart-offcanvas');
if (carritoBtn) {
    carritoBtn.removeAttribute('data-bs-toggle');
    carritoBtn.removeAttribute('data-bs-target');
    carritoBtn.removeAttribute('aria-controls');
    
    carritoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Verificar si el usuario está logueado
        if (estaLogueado()) {
            // ✅ Si está logueado, redirigir al carrito
            window.location.href = '../carrito/carrito.html';
        } else {
            // ❌ Si no está logueado, redirigir al login
            window.location.href = '../inicio/index.html';
        }
    });
    console.log('✅ Redirección del carrito configurada (con verificación de login)');
}

    setTimeout(inicializarDropdowns, 200);
    
}

// =============================================
// 9. FUNCIONES AUXILIARES
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
// 10. ESCUCHAR CAMBIOS EN LOCALSTORAGE
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
// 11. ACTUALIZAR BADGE CADA 1 SEGUNDO
// =============================================
setInterval(actualizarBadgeCarrito, 1000);

// =============================================
// 12. INICIALIZAR
// =============================================

console.log('🚀 Inicializando navbar...');

window.cerrarSesion = cerrarSesion;

document.addEventListener('DOMContentLoaded', function() {
    
    cargarNavbar();
});