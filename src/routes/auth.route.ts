import { login, logout, refreshToken, register } from '../controllers/auth.controller';
import express from 'express';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/refresh-token').post(refreshToken);

export default router;
