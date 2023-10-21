import authMiddleware from '../middlewares/authMiddleware';

import express from 'express';
import { createOpenConversation, getConversations } from '../controllers';

const router = express.Router();

router.route('/').post(authMiddleware, createOpenConversation);
router.route('/').get(authMiddleware, getConversations);

export default router;
