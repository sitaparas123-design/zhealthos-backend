const express = require('express')
const router = express.Router()

const authRoutes = require('./modules/auth/auth.routes')
const superAdminRoutes = require('./modules/super-admin/super-admin.routes')
const clinicAdminRoutes = require('./modules/clinic-admin/clinic-admin.routes')
const practitionerRoutes = require('./modules/practitioner/practitioner.routes')
const salesRoutes = require('./modules/sales-executive/sales-executive.routes')
const patientRoutes = require('./modules/patient/patient.routes')
const aiRoutes = require('./modules/ai/ai.routes')
const notificationRoutes = require('./modules/notification/notification.routes')
const chatRoutes = require('./modules/chat/chat.routes')

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ZHealth Clinic Backend API',
    timestamp: new Date().toISOString(),
  })
})

const authenticate = require('./middlewares/auth.middleware')
const superAdminController = require('./modules/super-admin/super-admin.controller')

// Mount modules
router.use('/auth', authRoutes)
router.use('/super-admin', superAdminRoutes)
router.use('/clinic-admin', clinicAdminRoutes)
router.use('/practitioner', practitionerRoutes)
router.use('/sales', salesRoutes)
router.use('/patient', patientRoutes)
router.use('/ai', aiRoutes)
router.use('/notifications', notificationRoutes)
router.use('/chat', chatRoutes)

// Shared Message Board routes for authenticated users
router.get('/message-board', authenticate, superAdminController.getMessageBoardItems)
router.post('/message-board', authenticate, superAdminController.createMessageBoardItem)
router.delete('/message-board/:id', authenticate, superAdminController.deleteMessageBoardItem)

module.exports = router
