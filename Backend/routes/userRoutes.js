import express from 'express';
import { getUsers, register,login, getUser, deleteUser, updateUser, logout, updatepassword, getPortfolio, forgetPasswod, resetPassword } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/logout',isAuthenticated,logout);
router.get('/me', getUser);
router.delete('/:id', deleteUser);
router.put('/update/profile', isAuthenticated,updateUser);
router.put('/update/password', isAuthenticated,updatepassword);
router.get('/me/portfolio',getPortfolio);
router.get('/getUsers', getUsers);
router.post('/password/forgotpassword',forgetPasswod);
router.put('/password/resetpassword/:token',resetPassword);

export default router;