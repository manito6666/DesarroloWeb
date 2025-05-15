// admin.js (dinámico para mostrar y eliminar usuarios)
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return (window.location.href = 'Homme.html');
  
    const res = await fetch('http://localhost:3000/users', {
      headers: { Authorization: token }
    });
  
    const lista = document.querySelector('.list-group');
    lista.innerHTML = '';
  
    const users = await res.json();
    users.forEach(user => {
      const item = document.createElement('li');
      item.className = 'list-group-item';
      item.innerHTML = `
        <span>${user.nombre} (${user.correo})</span>
        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${user._id}')">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      `;
      lista.appendChild(item);
    });
  });
  
  async function eliminarUsuario(id) {
    const token = sessionStorage.getItem('token');
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    await fetch(`http://localhost:3000/user/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    });
    location.reload();
  }
  
  // Botón de logout
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Cerrar sesión';
  logoutBtn.className = 'btn btn-outline-light btn-sm ms-2';
  logoutBtn.onclick = async () => {
    await fetch('http://localhost:3000/logout', { method: 'POST' });
    sessionStorage.removeItem('token');
    window.location.href = 'Homme.html';
  };
  document.querySelector('.ms-auto').appendChild(logoutBtn);
  