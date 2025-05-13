// ✅ Registro y Login Automático
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellidos, correo, contrasena })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        // ✅ Iniciar sesión automáticamente después de registrarse
        const loginResponse = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
            sessionStorage.setItem('userId', loginData.user._id);
            window.location.href = 'editor.html'; // ✅ Redirige directamente al Editor
        } else {
            alert("Error al iniciar sesión automáticamente.");
        }
    } else {
        alert(data.message);
    }
});
