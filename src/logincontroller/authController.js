import User from '../userModel/user.Model.js';
import { hashPassword } from '../userModel/hash.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

    
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password)
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });

    res.json({ message: 'Login exitoso', token });

  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error });
  }
};


const current = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autorizado' });
  }

  res.json({
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role
  });
};

export { register, login, current };