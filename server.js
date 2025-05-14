// ✅ server.js (Completo y Limpio)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Conexión a MongoDB
mongoose.connect('mongodb+srv://Atlasadmin:Hola12345@editortextcluster.kc0gvhk.mongodb.net/EditorText', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => console.error('❌ Error al conectar:', err));

// ✅ Modelos de MongoDB (Índice Único en Correo)
const userSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String,
    correo: { type: String, unique: true, index: true },
    contrasena: String
});

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', { usuarioId: String, contenido: String, formato: String });

// ✅ Generar y Verificar Token
function generarToken(id) {
    return jwt.sign({ userId: id }, 'secreto_jwt', { expiresIn: '1h' });
}

app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'secreto_jwt', (err, decoded) => {
            if (!err) req.userId = decoded.userId;
        });
    }
    next();
});

// ✅ Registro (Verifica si el correo ya está registrado)
app.post('/register', async (req, res) => {
    const { nombre, apellidos, correo, contrasena } = req.body;
    try {
        const user = await User.create({ nombre, apellidos, correo, contrasena });
        res.status(201).json({ message: 'Usuario registrado.', token: generarToken(user._id) });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'El correo ya está registrado. Intenta con otro.' });
        } else {
            res.status(500).json({ message: 'Error al registrar el usuario. Intenta nuevamente.' });
        }
    }
});

// ✅ Login
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    const user = await User.findOne({ correo, contrasena });
    if (user) {
        res.json({ message: 'Inicio de sesión exitoso.', token: generarToken(user._id) });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
});

// ✅ Cerrar Sesión (Eliminar Token en el Cliente)
app.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Sesión cerrada correctamente.' });
});

// ✅ Crear Nota
app.post('/note', async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
    const note = await Note.create({ usuarioId: req.userId, contenido: req.body.contenido, formato: 'html' });
    res.status(201).json({ message: 'Nota creada.', note });
});

// ✅ Obtener Notas
app.get('/notes', async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
    const notes = await Note.find({ usuarioId: req.userId });
    res.json(notes);
});

// ✅ Actualizar Nota
app.put('/note/:id', async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
    const note = await Note.findByIdAndUpdate(req.params.id, { contenido: req.body.contenido }, { new: true });
    res.json(note ? { message: 'Nota actualizada.', note } : { message: 'Nota no encontrada.' });
});

// ✅ Eliminar Nota
app.delete('/note/:id', async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
    const note = await Note.findByIdAndDelete(req.params.id);
    res.json(note ? { message: 'Nota eliminada.' } : { message: 'Nota no encontrada.' });
});

// ✅ Servidor corriendo
app.listen(3000, () => console.log('✅ Servidor corriendo en http://localhost:3000'));

