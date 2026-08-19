const express = require('express')
const router = express.Router()
const controller = require('./sales-executive.controller')
const authenticate = require('../../middlewares/auth.middleware')
const authorize = require('../../middlewares/role.middleware')

const auth = [authenticate, authorize('SUPER_ADMIN', 'SALES_EXECUTIVE')]

router.get('/leads', auth, controller.getLeads)
router.post('/leads', auth, controller.createLead)
router.put('/leads/:id', auth, controller.updateLead)
router.patch('/leads/:id/status', auth, controller.updateLeadStatus)
router.delete('/leads/:id', auth, controller.deleteLead)
router.post('/leads/:id/activity', auth, controller.addLeadActivity)

router.get('/tasks', auth, controller.getTasks)
router.post('/tasks', auth, controller.createTask)
router.put('/tasks/:id', auth, controller.updateTask)
router.delete('/tasks/:id', auth, controller.deleteTask)

router.get('/calendar-events', auth, controller.getCalendarEvents)
router.post('/calendar-events', auth, controller.createCalendarEvent)
router.put('/calendar-events/:id', auth, controller.updateCalendarEvent)
router.delete('/calendar-events/:id', auth, controller.deleteCalendarEvent)

router.get('/messages', auth, controller.getMessages)
router.post('/messages', auth, controller.sendMessage)

router.get('/clinics', auth, controller.getClinics)
router.put('/clinics/:id', auth, controller.updateClinic)
router.delete('/clinics/:id', auth, controller.deleteClinic)
router.post('/clinics/convert', auth, controller.convertLead)

router.get('/subscription-plans', auth, controller.getSubscriptionPlans)

router.get('/commissions', auth, controller.getCommissions)
router.post('/commissions/request', auth, controller.requestPayout)

router.get('/profile', auth, controller.getMyProfile)
router.put('/profile', auth, controller.updateMyProfile)
router.put('/profile/password', auth, controller.changeMyPassword)

module.exports = router
