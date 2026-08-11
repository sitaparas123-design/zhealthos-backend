const express = require('express')
const router = express.Router()
const notificationController = require('./notification.controller')
const authenticate = require('../../middlewares/auth.middleware')

// Protect all routes
router.use(authenticate)

// GET /api/notifications
router.get('/', notificationController.getNotifications)

// POST /api/notifications/broadcast
router.post('/broadcast', notificationController.broadcastNotification)

// PUT /api/notifications/:id/read
router.put('/:id/read', notificationController.markAsRead)

// DELETE /api/notifications/:id
router.delete('/:id', notificationController.deleteNotification)

module.exports = router
