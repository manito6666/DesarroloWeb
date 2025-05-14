// ✅ editor.js (Súper Simplificado)
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert("Inicia sesión.");
        window.location.href = 'Homme.html';
        return;
    }

    const noteId = sessionStorage.getItem('noteId');
    if (noteId) {
        document.getElementById('editor').innerHTML = sessionStorage.getItem('noteContent');
    }

    document.getElementById('btnSave').addEventListener('click', async () => {
        const contenido = document.getElementById('editor').innerHTML.trim();
        if (contenido === "") {
            alert("No puedes guardar una nota vacía.");
            return;
        }

        if (noteId) {
            await actualizarNota(noteId, contenido, token);
        } else {
            await crearNota(contenido, token);
        }

        sessionStorage.removeItem('noteId');
        sessionStorage.removeItem('noteContent');
        window.location.href = 'notes.html';
    });
});

async function actualizarNota(noteId, contenido, token) {
    await fetch(`http://localhost:3000/note/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ contenido })
    });
}

async function crearNota(contenido, token) {
    await fetch('http://localhost:3000/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ contenido, formato: 'html' })
    });
}
