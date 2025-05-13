document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert("Error: No se encontró el usuario. Por favor, inicia sesión.");
        window.location.href = 'Homme.html';
        return;
    }

    // ✅ Cargar Nota si se está editando
    const noteId = sessionStorage.getItem('noteId');
    const noteContent = sessionStorage.getItem('noteContent');

    if (noteId && noteContent) {
        document.getElementById('editor').innerHTML = noteContent;
    }

    document.getElementById('btnSave').addEventListener('click', async () => {
        const contenido = document.getElementById('editor').innerHTML;

        if (noteId) {
            // ✅ Actualizar Nota Existente
            await actualizarNota(noteId, contenido);
        } else {
            // ✅ Crear Nueva Nota
            await crearNota(userId, contenido);
        }

        // ✅ Limpiar almacenamiento
        sessionStorage.removeItem('noteId');
        sessionStorage.removeItem('noteContent');
        window.location.href = 'notes.html';
    });
});

// ✅ Función para actualizar una nota existente
async function actualizarNota(noteId, contenido) {
    try {
        const response = await fetch(`http://localhost:3000/note/${noteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contenido })
        });

        if (response.ok) {
            alert("Nota actualizada correctamente.");
        } else {
            throw new Error("Error al actualizar la nota.");
        }
    } catch (error) {
        alert("Error al actualizar la nota.");
        console.error("❌ Error al actualizar la nota:", error);
    }
}

// ✅ Función para crear una nueva nota
async function crearNota(userId, contenido) {
    try {
        const response = await fetch('http://localhost:3000/note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuarioId: userId, contenido, formato: 'html' })
        });

        if (response.ok) {
            alert("Nota guardada correctamente.");
        } else {
            throw new Error("Error al guardar la nota.");
        }
    } catch (error) {
        alert("Error al guardar la nota.");
        console.error("❌ Error al guardar la nota:", error);
    }
}
