// ✅ admin.js (Actualizado con JWT)
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');

    const response = await fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });
    const users = await response.json();

    const usuariosContainer = document.getElementById('usuariosContainer');
    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.classList.add('list-group-item');
        userElement.innerHTML = `
            <span>${user.nombre} (${user.correo})</span>
            <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}', '${token}')">Eliminar</button>
        `;
        usuariosContainer.appendChild(userElement);
    });
});

async function deleteUser(id, token) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        const response = await fetch(`http://localhost:3000/user/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        const data = await response.json();
        alert(data.message);
        window.location.reload();
    }
}
