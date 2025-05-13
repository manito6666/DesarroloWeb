document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const usuariosContainer = document.getElementById('usuariosContainer');
    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.classList.add('list-group-item');
        userElement.innerHTML = `
            <span>${user.nombre} (${user.correo})</span>
            <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Eliminar</button>
        `;
        usuariosContainer.appendChild(userElement);
    });
});

async function deleteUser(id) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        const response = await fetch(`http://localhost:3000/user/${id}`, { method: 'DELETE' });
        const data = await response.json();
        alert(data.message);
        window.location.reload();
    }
}
