// ✅ server.js con mejoras solicitadas (admin por defecto + logout)
require('dotenv').config();
const SECRET = process.env.JWT_SECRET || 'secreto_jwt';

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
  })
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    crearAdminPorDefecto(); // ← asegúrate de que esta función exista arriba
  })
  .catch(err => console.error('❌ Error al conectar:', err));
  

// ✅ Modelos
const User = mongoose.model('User', {
  nombre: String,
  apellidos: String,
  correo: { type: String, unique: true },
  contrasena: String,
  rol: { type: String, default: 'usuario' }
});

const Note = mongoose.model('Note', {
  usuarioId: String,
  contenido: String,
  formato: String
});

function generarToken(id, rol) {
  return jwt.sign({ userId: id, rol }, SECRET, { expiresIn: '1h' });
}


app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (!err) {
        req.userId = decoded.userId;
        req.userRol = decoded.rol;
      }
    });
  }
  next();
});

async function crearAdminPorDefecto() {
  const existe = await User.findOne({ correo: 'admin@gmail.com' });
  if (!existe) {
    await User.create({
      nombre: 'Admin',
      apellidos: 'Default',
      correo: 'admin@gmail.com',
      contrasena: 'admin123',
      rol: 'admin'
    });
    console.log('✅ Admin creado por defecto');
  }
}

app.post('/register', async (req, res) => {
  const { nombre, apellidos, correo, contrasena } = req.body;
  try {
    const user = await User.create({ nombre, apellidos, correo, contrasena });
    res.status(201).json({ message: 'Usuario registrado.', token: generarToken(user._id, user.rol) });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'El correo ya está registrado.' });
    } else {
      res.status(500).json({ message: 'Error al registrar.' });
    }
  }
});

app.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  const user = await User.findOne({ correo, contrasena });
  if (user) {
    res.json({ message: 'Inicio de sesión exitoso.', token: generarToken(user._id, user.rol) });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas.' });
  }
});

app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Sesión cerrada correctamente.' });
});

app.post('/note', async (req, res) => {
  if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
  const note = await Note.create({ usuarioId: req.userId, contenido: req.body.contenido, formato: 'html' });
  res.status(201).json({ message: 'Nota creada.', note });
});

app.get('/notes', async (req, res) => {
  if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
  const notes = await Note.find({ usuarioId: req.userId });
  res.json(notes);
});

app.put('/note/:id', async (req, res) => {
  if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
  const note = await Note.findByIdAndUpdate(req.params.id, { contenido: req.body.contenido }, { new: true });
  res.json(note ? { message: 'Nota actualizada.', note } : { message: 'Nota no encontrada.' });
});

app.delete('/note/:id', async (req, res) => {
  if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
  const note = await Note.findByIdAndDelete(req.params.id);
  res.json(note ? { message: 'Nota eliminada.' } : { message: 'Nota no encontrada.' });
});

app.get('/users', async (req, res) => {
  if (req.userRol !== 'admin') return res.status(403).json({ message: 'No autorizado.' });
  const users = await User.find();
  res.json(users);
});

app.delete('/user/:id', async (req, res) => {
  if (req.userRol !== 'admin') return res.status(403).json({ message: 'No autorizado.' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Usuario eliminado.' });
});

app.listen(3000, () => console.log('✅ Servidor corriendo en http://localhost:3000'));
