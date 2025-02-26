import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from "../models/User.js";
import { JWT_SECRET } from '../config.js';

 //!Generate JWT token 
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  } 

  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '2h'}); 
  return token;
}

//!Register - създаваме JWT for the created user
const register = async (userData) => {

  if (userData.password !== userData.confirmPassword) {
    throw new Error("Repassword does not match password!");
  }

 
  const user = await User.findOne({ email: userData.email });
  if (user) {
    throw new Error("User already exists!");
  }

  const createdUser = await User.create(userData);
 
  const token = generateToken(createdUser);
  return token;
}


//!Login
const login = async (email, password) => {

  
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid user or email!");
  }


  const isValid = await bcrypt.compare(password, user.password);   
  if(!isValid) {
    throw new Error("Invalid user or email!");
  }

  const token = generateToken(user);
  return token;
}



//!Object to be exported
const authService = {
    register,
    login,
};

export default authService;