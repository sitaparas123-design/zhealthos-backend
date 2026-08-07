const express = require('express')
const router = express.Router()
const controller = require('./patient.controller')
const authenticate = require('../../middlewares/auth.middleware')
const authorize = require('../../middlewares/role.middleware')

router.use(authenticate, authorize('PATIENT', 'SUPER_ADMIN'))

router.get('/profile', controller.getPatientProfile)
router.put('/profile', controller.updatePatientProfile)
router.get('/appointments', controller.getPatientAppointments)
router.post('/appointments', controller.createAppointment)
router.put('/appointments/:id/reschedule', controller.rescheduleAppointment)
router.put('/appointments/:id/cancel', controller.cancelAppointment)
router.get('/practitioners', controller.getPractitioners)
router.get('/care-team', controller.getCareTeam)
router.get('/messages', controller.getCareTeamMessages)
router.post('/messages', controller.sendCareTeamMessage)
router.get('/invoices', controller.getPatientInvoices)

// Treatment Plans
router.get('/treatment-plans', controller.getTreatmentPlans)
router.post('/treatment-plans', controller.createTreatmentPlan)
router.put('/treatment-plans/:id', controller.updateTreatmentPlan)
router.delete('/treatment-plans/:id', controller.deleteTreatmentPlan)

// Prescribed Exercises
router.get('/exercises', controller.getPrescribedExercises)
router.post('/exercises', controller.createPrescribedExercise)
router.put('/exercises/:id/toggle', controller.togglePrescribedExercise)
router.delete('/exercises/:id', controller.deletePrescribedExercise)

// Visual Progress & Clinical Outcomes
router.get('/progress-outcomes', controller.getProgressOutcomes)
router.post('/outcome-measures', controller.createOutcomeMeasure)
router.put('/outcome-measures/:id', controller.updateOutcomeMeasure)
router.delete('/outcome-measures/:id', controller.deleteOutcomeMeasure)
router.post('/progress-trends', controller.createProgressTrend)
router.put('/progress-trends/:id', controller.updateProgressTrend)
router.delete('/progress-trends/:id', controller.deleteProgressTrend)

// Forms & Documents Center
router.get('/forms-documents', controller.getFormsAndDocuments)
router.post('/forms/:id/submit', controller.submitPatientForm)
router.post('/documents', controller.uploadPatientDocument)
router.delete('/documents/:id', controller.deletePatientDocument)

// Funding, NDIS & Claims Accounts
router.get('/funding-claims', controller.getFundingAndClaims)
router.post('/claims', controller.createPatientClaim)
router.put('/claims/:id', controller.updatePatientClaim)
router.delete('/claims/:id', controller.deletePatientClaim)
router.post('/funding-accounts', controller.createFundingAccount)
router.put('/funding-accounts/:id', controller.updateFundingAccount)

// Health Record Sharing
router.get('/health-sharing', controller.getHealthShares)
router.post('/health-sharing/grant', controller.grantHealthShare)
router.put('/health-sharing/:id/approve', controller.approveHealthShareRequest)
router.put('/health-sharing/:id/deny', controller.denyHealthShareRequest)
router.delete('/health-sharing/:id/revoke', controller.revokeHealthShare)

// Patient Invoices
router.get('/invoices', controller.getPatientInvoices)
router.post('/invoices/:id/pay', controller.payPatientInvoice)
router.post('/invoices', controller.createPatientInvoice)
router.delete('/invoices/:id', controller.deletePatientInvoice)

// Preferences & Security Settings
router.get('/preferences', controller.getPatientPreferences)
router.put('/preferences', controller.updatePatientPreferences)
router.get('/security/devices', controller.getTrustedDevices)
router.delete('/security/devices/:key', controller.revokeTrustedDevice)
router.get('/family-profiles', controller.getFamilyProfiles)
router.get('/achievements', controller.getPatientAchievements)
router.put('/achievements', controller.updatePatientAchievements)

module.exports = router







