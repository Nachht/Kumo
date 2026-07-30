// ==========================================
// ADMIN NAVBAR - KUMO (versión definitiva)
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    // =============================================
    // 1. FUNCIONES DE AUTENTICACIÓN
    // =============================================
    
    function obtenerUsuarioLogueado() {
        
        
        const usuario = localStorage.getItem("usuarioActivo");
        
        
        if (usuario) {
            try {
                const user = JSON.parse(usuario);
                console.log("✅ Usuario encontrado:", user);
                return user;
            } catch (e) {
                console.error("❌ Error al parsear usuario:", e);
                return null;
            }
        }
        
        return null;
    }

    function cerrarSesion() {
        
        localStorage.removeItem("usuarioActivo");
        localStorage.removeItem("kumo_usuario");
        window.location.href = "../../inicio_sesion/inicio_sesion.html";
    }

    // =============================================
    // 2. CARGAR NAVBAR ADMIN (DIRECTO - SIN FETCH)
    // =============================================

    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) {
        console.warn("⚠️ No se encontró #navbar-container");
        return;
    }

    // 🔧 Generar el navbar directamente (sin fetch)
    function generarNavbarAdmin() {
        const usuario = obtenerUsuarioLogueado();
        console.log('👤 Usuario para navbar:', usuario);

        let userHTML = '';
        if (usuario) {
            const nombre = usuario.nombre || usuario.nombres || 'Administrador';
            const primerNombre = nombre.split(' ')[0];
            
            userHTML = `
                <div class="dropdown">
                    <button class="btn-user-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        background: rgba(255,255,255,0.08);
                        border: 1px solid rgba(255,255,255,0.15);
                        border-radius: 50px;
                        padding: 6px 16px 6px 12px;
                        color: #fff;
                        font-weight: 600;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.25)';"
                       onmouseout="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(255,255,255,0.15)';">
                        <i class="bi bi-person-circle" style="font-size: 1.2rem; color: #FD0C7D;"></i>
                        <span>${primerNombre}</span>
                        
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" style="
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.1);
                        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                        padding: 8px;
                        min-width: 200px;
                        background: #1a1a2e;
                    ">
                        <li><a class="dropdown-item" href="../../perfil/perfil.html" style="
                            border-radius: 8px;
                            padding: 8px 12px;
                            color: rgba(255,255,255,0.8);
                            font-weight: 500;
                            text-decoration: none;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            transition: all 0.2s ease;
                        " onmouseover="this.style.background='rgba(131,22,237,0.2)'; this.style.color='#fff';"
                           onmouseout="this.style.background='transparent'; this.style.color='rgba(255,255,255,0.8)';">
                            <i class="bi bi-person"></i> Mi perfil
                        </a></li>
                       

                        </a></li>
                        <li><hr class="dropdown-divider" style="border-color: rgba(255,255,255,0.06);"></li>
                        <li><a class="dropdown-item" href="../html/admin-servicios.html" style="
                            border-radius: 8px;
                            padding: 8px 12px;
                            color: rgba(255,255,255,0.8);
                            font-weight: 500;
                            text-decoration: none;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            transition: all 0.2s ease;
                        " onmouseover="this.style.background='rgba(131,22,237,0.2)'; this.style.color='#fff';"
                           onmouseout="this.style.background='transparent'; this.style.color='rgba(255,255,255,0.8)';">
                            <i class="bi bi-shield-lock"></i> Panel Admin
                        </a></li>
                        <li><hr class="dropdown-divider" style="border-color: rgba(255,255,255,0.06);"></li>
                        <li><button class="dropdown-item text-danger" onclick="cerrarSesion()" style="
                            border-radius: 8px;
                            padding: 8px 12px;
                            color: #FD0C7D !important;
                            font-weight: 500;
                            border: none;
                            background: transparent;
                            width: 100%;
                            text-align: left;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            transition: all 0.2s ease;
                            cursor: pointer;
                        " onmouseover="this.style.background='rgba(253,12,125,0.15)';"
                           onmouseout="this.style.background='transparent';">
                            <i class="bi bi-box-arrow-right"></i> Cerrar sesión
                        </button></li>
                    </ul>
                </div>
            `;
        } else {
            userHTML = `
                <a href="../../inicio_sesion/inicio_sesion.html" class="btn-login" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: transparent;
                    color: #fff !important;
                    border: 2px solid rgba(255,255,255,0.2);
                    padding: 6px 18px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                " onmouseover="this.style.borderColor='#FD0C7D'; this.style.background='rgba(253,12,125,0.1)';"
                   onmouseout="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.background='transparent';">
                    <i class="bi bi-box-arrow-in-right"></i> Iniciar sesión
                </a>
                <a href="../../registro/registro.html" class="btn-registro" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: linear-gradient(90deg, #8316ED, #FD0C7D);
                    color: #fff !important;
                    border: none;
                    padding: 6px 18px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 15px rgba(253,12,125,0.3)';"
                   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
                    <i class="bi bi-person-plus"></i> Registrarse
                </a>
            `;
        }

        return `
            <header>
                <nav class="navbar-kumo">
                    <div class="container-kumo">
                        <div class="nav-top">
                            <!-- LOGO -->
                            <a href="../../inicio/index.html" class="logo-link" style="display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0;">
                                <img src="../../assets/img/logo.png" alt="KUMO" class="logo-img" style="height: 60px; width: 60px; display: block;">
                            </a>
                            
                            

                            <!-- ÍCONOS -->
                            <div class="nav-icons" style="display: flex; align-items: center; gap: 20px; flex-shrink: 0;">
                                <!-- Menú de usuario -->
                                <div class="user-menu-container" id="adminUserMenu" style="display: flex; align-items: center; gap: 12px;">
                                    ${userHTML}
                                </div>
                                
                                <!-- Volver a la tienda -->
                                <a href="../../inicio/index.html" class="icon-link" style="display: flex; align-items: center; gap: 6px; color: #D5D5D5; text-decoration: none; font-weight: 700; font-size: 0.9rem; padding: 6px 12px; border-radius: 30px; transition: all 0.4s ease;" onmouseover="this.style.background='rgba(131,22,237,0.12)'; this.style.color='#8316ED';" onmouseout="this.style.background='transparent'; this.style.color='#D5D5D5';">
                                    <i class="bi bi-shop" style="font-size: 1.5rem;"></i>
                                    <span>Tienda</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }

    // =============================================
    // 3. INYECTAR NAVBAR
    // =============================================

    navbarContainer.innerHTML = generarNavbarAdmin();
    

    // =============================================
    // 4. INICIALIZAR DROPDOWNS (con Bootstrap)
    // =============================================

    function inicializarDropdownsAdmin() {
        
        
        if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
            document.querySelectorAll('.dropdown-toggle').forEach(element => {
                try {
                    const existing = bootstrap.Dropdown.getInstance(element);
                    if (existing) existing.dispose();
                } catch(e) {}
                
                try {
                    new bootstrap.Dropdown(element);
                } catch(e) {
                    console.warn('⚠️ Error en dropdown:', e);
                }
            });
            
        } else {
            
            // Intentar cargar Bootstrap desde CDN
            if (!document.querySelector('script[src*="bootstrap.bundle"]')) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
                script.onload = function() {
                    
                    inicializarDropdownsAdmin();
                };
                document.head.appendChild(script);
            } else {
                setTimeout(inicializarDropdownsAdmin, 500);
            }
        }
    }

    // Inicializar dropdowns después de inyectar el navbar
    setTimeout(inicializarDropdownsAdmin, 200);

    // Exponer función cerrarSesion globalmente
    window.cerrarSesion = cerrarSesion;

});