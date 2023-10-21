import express from 'express';
import authRoutes from './auth.route';
import conversationRoutes from './conversation.route';
import messageRoutes from './message.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/conversation', conversationRoutes);
router.use('/message', messageRoutes);
router.use('*', (req, res) => res.status(400).json({ error: { status: 404, message: 'invalid route' } }));

export default router;
