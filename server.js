// server.js (Servidor con MongoDB y JWT)

// Importando módulos necesarios
const express = require('express'); // Pmanejar el servidor
const mongoose = require('mongoose'); //  conectar con la base de datos MongoDB
const cors = require('cors'); //  servidor acepte peticiones de otros dominios
const jwt = require('jsonwebtoken'); // Pautenticación con tokens JWT
const app = express(); //  aplicación de servidor

app.use(cors()); // peticiones desde cualquier origen
app.use(express.json()); // Habilitar de JSON

// Conectar a la base de datos de MongoDB
mongoose.connect('mongodb+srv://Atlasadmin:Hola12345@editortextcluster.kc0gvhk.mongodb.net/EditorText', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(' Conectado a MongoDB')) // Mensaje si se conecta bien
    .catch((err) => console.error(' Error al conectar a MongoDB:', err)); // Mensaje si falla

// Modelos de MongoDB
const userSchema = new mongoose.Schema({ // Esquema para los usuarios
    nombre: String,
    correo: { type: String, unique: true, index: true }, // El correo debe ser único
    contrasena: String
});
const User = mongoose.model('User', userSchema); // Creando el modelo de usuario

const noteSchema = new mongoose.Schema({ // Esquema para las notas
    usuarioId: String, // ID del usuario que creó la nota
    contenido: String // El contenido de la nota
});
const Note = mongoose.model('Note', noteSchema); // Creando el modelo de nota

// Función para generar un token JWT
function generarToken(id) {
    return jwt.sign({ userId: id }, 'secreto_jwt', { expiresIn: '1h' }); // Crea un token que expira en 1 hora
}

// Middleware para verificar el token JWT
function verificarToken(req, res, next) {
    const token = req.headers['authorization']; // Obtiene el token
    if (token) {
        jwt.verify(token, 'secreto_jwt', (err, decoded) => { // Verificamos el token
            if (err) return res.status(403).json({ message: 'Token inválido.' }); // Si falla
            req.userId = decoded.userId; // Guarda el ID del usuario
            next(); // Continua
        });
    } else {
        res.status(401).json({ message: 'No autenticado.' }); // Si no hay token
    }
}

// Registro de usuario
app.post('/register', async (req, res) => {
    const { nombre, correo, contrasena } = req.body; // Datos del usuario
    try {
        const user = await User.create({ nombre, correo, contrasena }); // Creamos el usuario
        res.status(201).json({ message: 'Usuario registrado.', token: generarToken(user._id) }); // Envia token
    } catch (error) {
        if (error.code === 11000) { // Si el correo ya está registrado
            res.status(400).json({ message: 'El correo ya está registrado.' });
        } else {
            res.status(500).json({ message: 'Error al registrar usuario.' }); // Otro error
        }
    }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body; // Datos para iniciar sesión
    const user = await User.findOne({ correo, contrasena }); // Buscamos  el usuario en la base de datos
    if (user) {
        res.json({ message: 'Inicio de sesión exitoso.', token: generarToken(user._id) }); // Envia token
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas.' }); // Si las credenciales son incorrectas
    }
});

// Obtener todos los usuarios (solo admin)
app.get('/users', verificarToken, async (req, res) => {
    const users = await User.find(); // Obtenemos todos los usuarios
    res.json(users);
});

// Eliminar usuario y sus notas admin
app.delete('/user/:id', verificarToken, async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id); // Borra el usuario por ID
    if (user) {
        await Note.deleteMany({ usuarioId: req.params.id }); // Borramos las notas del usuario
        res.json({ message: 'Usuario y sus notas eliminados.' });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado.' });
    }
});

// Crear una nueva nota
app.post('/note', verificarToken, async (req, res) => {
    const { contenido } = req.body;
    const note = await Note.create({ usuarioId: req.userId, contenido }); // Creamos una nota nueva
    res.status(201).json(note);
});

// Obtener todas las notas del usuario
app.get('/notes', verificarToken, async (req, res) => {
    const notes = await Note.find({ usuarioId: req.userId }); // Buscamos todas las notas del usuario
    res.json(notes);
});

// Obtener una nota específica (Para editar)
app.get('/note/:id', verificarToken, async (req, res) => {
    const note = await Note.findById(req.params.id); // Buacmos nota por ID
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ message: 'Nota no encontrada.' });
    }
});

// Actualizar una nota
app.put('/note/:id', verificarToken, async (req, res) => {
    const { contenido } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, { contenido }, { new: true }); // Actualizamos la nota
    res.json(note ? { message: 'Nota actualizada.', note } : { message: 'Nota no encontrada.' });
});

// Eliminar una nota
app.delete('/note/:id', verificarToken, async (req, res) => {
    const note = await Note.findByIdAndDelete(req.params.id); // Borra la nota por ID
    res.json(note ? { message: 'Nota eliminada.' } : { message: 'Nota no encontrada.' });
});

// Iniciar el servidor
app.listen(3000, () => console.log(' Servidor corriendo en http://localhost:3000'));

