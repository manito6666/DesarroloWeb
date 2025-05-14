// ✅ admin.js (Súper Simplificado)
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert("Inicia sesión.");
        window.location.href = 'Homme.html';
        return;
    }

    const response = await fetch('http://localhost:3000/users', {
        headers: { 'Authorization': token }
    });
    const users = await response.json();
    const container = document.getElementById('usuariosContainer');
    container.innerHTML = users.map(user => `
        <li>${user.nombre} (${user.correo}) 
            <button onclick="eliminarUsuario('${user._id}', '${token}')">Eliminar</button>
        </li>
    `).join('');
});

async function eliminarUsuario(id, token) {
    if (confirm("¿Eliminar este usuario?")) {
        await fetch(`http://localhost:3000/user/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        location.reload();
    }
}
