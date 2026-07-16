document.addEventListener("DOMContentLoaded", () => {
    
    // Cargar el CSS del footer solo si no existe
    if (!document.querySelector('link[href*="footer.css"]')) {

        const estilos = document.createElement("link");
        estilos.rel = "stylesheet";
        estilos.href = "../estilos-css/footer.css";
        document.head.appendChild(estilos);
    }

    // Cargar el HTML del footer
    fetch("../footer/footer.html")
        .then(res => res.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
        });
});