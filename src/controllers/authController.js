import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const authController = Router();


//! Login GET
authController.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
})


//! Login POST
authController.post('/login', isGuest, async (req, res) => {
  const { email, password } = req.body; 

try {
  const token = await authService.login(email, password);

  res.cookie('auth', token, {httpOnly: true}); 
  res.redirect('/');
} catch (err) {
  res.render('auth/login', { 
  error: getErrorMessage(err),
  user: { email } 
});  
}
});


//! Register GET
authController.get('/register', isGuest, (req, res) => {
res.render('auth/register'); 
});


//! Register POST
authController.post('/register', isGuest, async (req, res) => {
  const userData = req.body; 
  console.log(userData);

  try {
    const token = await authService.register(userData);

    res.cookie('auth', token, {httpOnly: true});
    res.redirect('/');
  } catch (err) {
    res.render('auth/register', {error: getErrorMessage(err), user: userData}); 
  }

});

//! Logout GET
authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
})

export default authController;