// ✅ server.js (Back-End Completo y Corregido con JWT)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Conexión a MongoDB (Atlas o Local)
mongoose.connect('mongodb+srv://Atlasadmin:Hola12345@editortextcluster.kc0gvhk.mongodb.net/EditorText?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// ✅ Modelos de MongoDB
const User = mongoose.model('User', new mongoose.Schema({
    nombre: String,
    apellidos: String,
    correo: { type: String, unique: true, index: true },
    contrasena: String
}));

const Note = mongoose.model('Note', new mongoose.Schema({
    usuarioId: String,
    contenido: String,
    formato: String
}));

// ✅ Generar Token JWT
function generarToken(usuario) {
    return jwt.sign({ userId: usuario._id }, 'secreto_jwt', { expiresIn: '1h' });
}

// ✅ Middleware para Verificar Token JWT
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Acceso denegado. Token no proporcionado.' });

    jwt.verify(token, 'secreto_jwt', (err, decoded) => {
        if (err) {
            console.error("❌ Token inválido:", err);
            return res.status(403).json({ message: 'Token inválido.' });
        }
        req.userId = decoded.userId;
        next();
    });
}

// ✅ Ruta de Registro
app.post('/register', async (req, res) => {
    const { nombre, apellidos, correo, contrasena } = req.body;
    try {
        const user = await User.create({ nombre, apellidos, correo, contrasena });
        const token = generarToken(user);
        res.status(201).json({ message: 'Usuario registrado correctamente.', user, token });
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'El correo ya está registrado.' });
        } else {
            res.status(500).json({ message: 'Error al registrar el usuario.', error: error.message });
        }
    }
});

// ✅ Ruta de Inicio de Sesión
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const user = await User.findOne({ correo, contrasena });
        if (user) {
            const token = generarToken(user);
            res.json({ message: 'Inicio de sesión exitoso', user, token });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas.' });
        }
    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error);
        res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
    }
});

// ✅ Ruta para Crear Notas (POST) - Verificación con JWT
app.post('/note', verificarToken, async (req, res) => {
    const { contenido, formato } = req.body;
    const usuarioId = req.userId;

    if (!usuarioId) return res.status(400).json({ message: 'Error: Usuario no identificado.' });

    try {
        const note = await Note.create({ usuarioId, contenido, formato });
        res.status(201).json({ message: 'Nota guardada correctamente.', note });
    } catch (error) {
        console.error("❌ Error al guardar la nota:", error);
        res.status(500).json({ message: 'Error al guardar la nota.', error: error.message });
    }
});

// ✅ Ruta para Obtener Notas por Usuario (Protegida)
app.get('/notes', verificarToken, async (req, res) => {
    const usuarioId = req.userId;
    try {
        const notes = await Note.find({ usuarioId });
        res.status(200).json(notes);
    } catch (error) {
        console.error("❌ Error al obtener las notas:", error);
        res.status(500).json({ message: 'Error al obtener las notas.', error: error.message });
    }
});

// ✅ Ruta para Actualizar Nota (Protegida)
app.put('/note/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { contenido } = req.body;

    try {
        const note = await Note.findByIdAndUpdate(id, { contenido }, { new: true });
        if (!note) {
            console.error("❌ Nota no encontrada para actualizar:", id);
            return res.status(404).json({ message: 'Nota no encontrada.' });
        }
        res.status(200).json({ message: 'Nota actualizada correctamente.', note });
    } catch (error) {
        console.error("❌ Error al actualizar la nota:", error);
        res.status(500).json({ message: 'Error al actualizar la nota.', error: error.message });
    }
});

// ✅ Ruta para Eliminar Nota (Protegida)
app.delete('/note/:id', verificarToken, async (req, res) => {
    const { id } = req.params;

    try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            console.error("❌ Nota no encontrada para eliminar:", id);
            return res.status(404).json({ message: 'Nota no encontrada.' });
        }
        res.status(200).json({ message: 'Nota eliminada correctamente.' });
    } catch (error) {
        console.error("❌ Error al eliminar la nota:", error);
        res.status(500).json({ message: 'Error al eliminar la nota.', error: error.message });
    }
});

// ✅ Servidor corriendo
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
