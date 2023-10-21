import { getMessages, sendMessage } from '../controllers';
import authMiddleware from '../middlewares/authMiddleware';
import express from 'express';

const router = express.Router();

router.route('/').post(authMiddleware, sendMessage);
router.route('/:con_id').get(authMiddleware, getMessages);

export default router;
