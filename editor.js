document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert("Error: No se encontró el usuario. Por favor, inicia sesión.");
        window.location.href = 'Homme.html';
        return;
    }

    document.getElementById('btnSave').addEventListener('click', async () => {
        const contenido = document.getElementById('editor').innerHTML;

        try {
            const response = await fetch('http://localhost:3000/note', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuarioId: userId, contenido, formato: 'html' })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Nota guardada correctamente.");
                window.location.href = 'notes.html';
            } else {
                alert(`Error al guardar la nota: ${data.message}`);
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
            console.error("Error al guardar la nota:", error);
        }
    });
});
