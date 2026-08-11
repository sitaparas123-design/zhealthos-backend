const express = require('express')
const router = express.Router()
const controller = require('./practitioner.controller')
const authenticate = require('../../middlewares/auth.middleware')
const authorize = require('../../middlewares/role.middleware')

router.use(authenticate, authorize('SUPER_ADMIN', 'CLINIC_ADMIN', 'PRACTITIONER'))

router.get('/dashboard/stats', controller.getDashboardStats)

router.get('/consultations', controller.getConsultations)
router.post('/consultations', controller.createConsultation)
router.put('/consultations/:id', controller.updateConsultation)
router.delete('/consultations/:id', controller.deleteConsultation)

router.get('/exercises', controller.getPrescribedExercises)
router.post('/exercises', controller.createPrescribedExercise)
router.put('/exercises/:id/compliance', controller.updatePrescribedExerciseCompliance)

router.get('/appointments', controller.getAppointments)
router.post('/appointments', controller.createAppointment)
router.put('/appointments/:id', controller.updateAppointment)
router.delete('/appointments/:id', controller.deleteAppointment)

router.get('/practitioners', controller.getPractitioners)

router.get('/waitlist', controller.getWaitlist)
router.post('/waitlist', controller.addToWaitlist)
router.patch('/waitlist/:id/status', controller.updateWaitlistStatus)
router.delete('/waitlist/:id', controller.removeFromWaitlist)

router.get('/patients', controller.getPatients)
router.post('/patients', controller.createPatient)
router.put('/patients/:id', controller.updatePatient)

router.get('/payments', controller.getPayments)
router.post('/payments', controller.createPayment)
router.put('/payments/:id', controller.updatePayment)
router.get('/profile', controller.getProfile)
router.put('/profile', controller.updateProfile)

router.get('/body-chart-templates', controller.getBodyChartTemplates)
router.post('/body-chart-templates', controller.createBodyChartTemplate)
router.put('/body-chart-templates/:id', controller.updateBodyChartTemplate)
router.delete('/body-chart-templates/:id', controller.deleteBodyChartTemplate)

router.get('/settings/integrations', controller.getIntegrations)
router.post('/settings/integrations', controller.createIntegration)
router.put('/settings/integrations/:id', controller.updateIntegration)
router.delete('/settings/integrations/:id', controller.deleteIntegration)

const adminController = require('../clinic-admin/clinic-admin.controller')
router.get('/settings/templates', adminController.getSettingsTemplates)
router.post('/settings/templates', adminController.createSettingsTemplate)
router.put('/settings/templates/:type/:id', adminController.updateSettingsTemplate)
router.delete('/settings/templates/:type/:id', adminController.deleteSettingsTemplate)

router.get('/documents', adminController.getDocuments)
router.post('/documents', adminController.createDocument)

router.get('/invoices', adminController.getInvoices)
router.post('/invoices', adminController.createInvoice)
router.put('/invoices/:id', adminController.updateInvoice)


router.get('/login-history', controller.getLoginHistory)
router.post('/login-history', controller.recordLoginLog)
router.delete('/login-history/:id', controller.revokeLoginSession)

router.post('/change-password', controller.changePassword)
router.get('/security-settings', controller.getSecuritySettings)
router.put('/security-settings', controller.updateSecuritySettings)

router.get('/settings/api-keys', controller.getApiKeys)
router.post('/settings/api-keys', controller.createApiKey)
router.delete('/settings/api-keys/:id', controller.deleteApiKey)

module.exports = router
