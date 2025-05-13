document.addEventListener('DOMContentLoaded', async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert("Error: No se encontró el usuario. Por favor, inicia sesión.");
        window.location.href = 'Homme.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/notes/${userId}`);
        if (!response.ok) {
            throw new Error("No se pudieron cargar las notas. Verifica el servidor.");
        }

        const notes = await response.json();
        const notasContainer = document.getElementById('notasContainer');

        if (notes.length === 0) {
            notasContainer.innerHTML = '<p class="text-center">No tienes notas guardadas.</p>';
        } else {
            notasContainer.innerHTML = notes.map(note => `
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Tu Nota</div>
                        <div class="note-body">
                            <p>${note.contenido}</p>
                        </div>
                        <div class="card-body text-end">
                            <button class="btn-edit" onclick="editarNota('${note._id}')"><i class="fas fa-edit"></i><span>Editar</span></button>
                            <button class="btn-delete" onclick="eliminarNota('${note._id}')"><i class="fas fa-trash"></i><span>Eliminar</span></button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        alert("Error al cargar las notas.");
        console.error("❌ Error al obtener las notas:", error);
    }
});

// ✅ Función para eliminar una nota
async function eliminarNota(noteId) {
    if (confirm("¿Estás seguro de eliminar esta nota?")) {
        try {
            const response = await fetch(`http://localhost:3000/note/${noteId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            alert(data.message);
            location.reload();
        } catch (error) {
            alert("Error al eliminar la nota.");
        }
    }
}

// ✅ Función para editar (a futuro)
function editarNota(noteId) {
    alert("Función de editar aún no implementada.");
}
