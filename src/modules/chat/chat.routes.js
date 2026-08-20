const express = require('express')
const router = express.Router()
const controller = require('./chat.controller')
const authenticate = require('../../middlewares/auth.middleware')

// All chat routes are protected with JWT authentication
router.use(authenticate)

router.get('/contacts', controller.getChatContacts)
router.get('/messages/:conversationId', controller.getConversationMessages)
router.post('/messages', controller.sendLiveChatMessage)
router.put('/read/:conversationId', controller.markMessagesAsRead)

module.exports = router
