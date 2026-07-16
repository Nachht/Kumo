document.addEventListener("DOMContentLoaded", () => {

    fetch("../footer/footer.html")
        .then(res => {
            if (!res.ok) throw new Error("No se pudo cargar el footer");
            return res.text();
        })
        .then(data => {
            // Buscar el main-content
            const mainContent = document.querySelector(".main-content");
            
            if (mainContent) {
                // Si existe main-content, inyectar el footer al final de él
                mainContent.insertAdjacentHTML("beforeend", data);
            } else {
                // Fallback: si no existe main-content, inyectar al final del body
                document.body.insertAdjacentHTML("beforeend", data);
            }
        })
        .catch(err => console.warn("⚠️ No se pudo cargar el footer:", err));

});