import authMiddleware from '../middlewares/authMiddleware';
import express from 'express';
import { searchUsers } from '../controllers';

const router = express.Router();

router.route('/').get(authMiddleware, searchUsers);

export default router;
