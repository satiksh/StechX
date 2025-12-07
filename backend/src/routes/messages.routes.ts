import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  sendMessage,
  getConversations,
  getMessages,
  getNotifications,
  markNotificationAsRead,
} from '../controllers/messageController';

const router = Router();

// Messages
router.post('/send', authenticate, sendMessage);
router.get('/conversations', authenticate, getConversations);
router.get('/:conversationId', authenticate, getMessages);

// Notifications
router.get('/notifications/list', authenticate, getNotifications);
router.put('/notifications/:notificationId/read', authenticate, markNotificationAsRead);

export default router;
