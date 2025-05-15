// server.js (Servidor con MongoDB y JWT)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://Atlasadmin:Hola12345@editortextcluster.kc0gvhk.mongodb.net/EditorText', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Modelos de MongoDB
const userSchema = new mongoose.Schema({
    nombre: String,
    correo: { type: String, unique: true, index: true },
    contrasena: String
});
const User = mongoose.model('User', userSchema);

const noteSchema = new mongoose.Schema({
    usuarioId: String,
    contenido: String
});
const Note = mongoose.model('Note', noteSchema);

// Función para generar token JWT
function generarToken(id) {
    return jwt.sign({ userId: id }, 'secreto_jwt', { expiresIn: '1h' });
}

// Middleware para verificar el token
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'secreto_jwt', (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Token inválido.' });
            req.userId = decoded.userId;
            next();
        });
    } else {
        res.status(401).json({ message: 'No autenticado.' });
    }
}

// Registro de usuarios
app.post('/register', async (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    try {
        const user = await User.create({ nombre, correo, contrasena });
        res.status(201).json({ message: 'Usuario registrado.', token: generarToken(user._id) });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'El correo ya está registrado.' });
        } else {
            res.status(500).json({ message: 'Error al registrar usuario.' });
        }
    }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    const user = await User.findOne({ correo, contrasena });
    if (user) {
        res.json({ message: 'Inicio de sesión exitoso.', token: generarToken(user._id) });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
});

// Obtener usuarios (Solo admin)
app.get('/users', verificarToken, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Eliminar usuario y sus notas (Solo admin)
app.delete('/user/:id', verificarToken, async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
        await Note.deleteMany({ usuarioId: req.params.id });
        res.json({ message: 'Usuario y sus notas eliminados.' });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado.' });
    }
});

// Crear nota
app.post('/note', verificarToken, async (req, res) => {
    const { contenido } = req.body;
    const note = await Note.create({ usuarioId: req.userId, contenido });
    res.status(201).json(note);
});

// Obtener todas las notas del usuario
app.get('/notes', verificarToken, async (req, res) => {
    const notes = await Note.find({ usuarioId: req.userId });
    res.json(notes);
});

// Obtener una nota específica (Para editar)
app.get('/note/:id', verificarToken, async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ message: 'Nota no encontrada.' });
    }
});

// Actualizar nota
app.put('/note/:id', verificarToken, async (req, res) => {
    const { contenido } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, { contenido }, { new: true });
    res.json(note ? { message: 'Nota actualizada.', note } : { message: 'Nota no encontrada.' });
});

// Eliminar nota
app.delete('/note/:id', verificarToken, async (req, res) => {
    const note = await Note.findByIdAndDelete(req.params.id);
    res.json(note ? { message: 'Nota eliminada.' } : { message: 'Nota no encontrada.' });
});

// Iniciar servidor
app.listen(3000, () => console.log('✅ Servidor corriendo en http://localhost:3000'));
