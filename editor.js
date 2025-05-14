// ✅ editor.js (Simplificado y JWT integrado)
document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    if (!userId || !token) {
        alert("Error: No se encontró el usuario. Por favor, inicia sesión.");
        window.location.href = 'Homme.html';
        return;
    }

    const noteId = sessionStorage.getItem('noteId');
    const noteContent = sessionStorage.getItem('noteContent');

    if (noteId && noteContent) {
        document.getElementById('editor').innerHTML = noteContent;
    }

    document.getElementById('btnSave').addEventListener('click', async () => {
        const contenido = document.getElementById('editor').innerHTML;

        if (contenido.trim() === "") {
            alert("No puedes guardar una nota vacía.");
            return;
        }

        if (noteId) {
            await actualizarNota(noteId, contenido, token);
        } else {
            await crearNota(userId, contenido, token);
        }

        sessionStorage.removeItem('noteId');
        sessionStorage.removeItem('noteContent');
        window.location.href = 'notes.html';
    });
});

// ✅ Función para actualizar una nota existente (con JWT)
async function actualizarNota(noteId, contenido, token) {
    try {
        const response = await fetch(`http://localhost:3000/note/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ contenido })
        });

        if (response.ok) {
            alert("Nota actualizada correctamente.");
        } else {
            alert("Error al actualizar la nota.");
        }
    } catch (error) {
        alert("Error al actualizar la nota.");
        console.error("❌ Error al actualizar la nota:", error);
    }
}

// ✅ Función para crear una nueva nota
async function crearNota(userId, contenido, token) {
    try {
        const response = await fetch('http://localhost:3000/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ contenido, formato: 'html' })
        });

        if (response.ok) {
            alert("Nota guardada correctamente.");
        } else {
            alert("Error al guardar la nota.");
        }
    } catch (error) {
        alert("Error al guardar la nota.");
        console.error("❌ Error al guardar la nota:", error);
    }
}
