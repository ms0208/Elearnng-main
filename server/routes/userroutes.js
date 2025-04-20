import express from 'express';
import {checkUserAuth} from '../middleware/authmiddleware.js';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/usercontrol.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/user/:id',checkUserAuth, getUserById);
router.put('/update/:id', checkUserAuth,updateUser);
router.delete('/delete/:id',checkUserAuth, deleteUser);

export default router;
