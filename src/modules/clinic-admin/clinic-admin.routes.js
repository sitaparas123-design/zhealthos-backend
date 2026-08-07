const express = require('express')
const router = express.Router()
const controller = require('./clinic-admin.controller')
const authenticate = require('../../middlewares/auth.middleware')
const authorize = require('../../middlewares/role.middleware')

router.use(authenticate, authorize('SUPER_ADMIN', 'CLINIC_ADMIN', 'PRACTITIONER'))

router.get('/dashboard/stats', controller.getDashboardStats)
router.get('/settings/payment-terms', controller.getPaymentTerms)
router.put('/settings/payment-terms', controller.updatePaymentTerms)

router.get('/branches', controller.getBranches)
router.post('/branches', controller.createBranch)
router.put('/branches/:id', controller.updateBranch)
router.delete('/branches/:id', controller.deleteBranch)

router.get('/practitioners', controller.getPractitioners)
router.post('/practitioners', controller.createPractitioner)
router.put('/practitioners/:id', controller.updatePractitioner)
router.delete('/practitioners/:id', controller.deletePractitioner)

router.get('/invoices', controller.getInvoices)
router.post('/invoices', controller.createInvoice)
router.put('/invoices/:id', controller.updateInvoice)
router.delete('/invoices/:id', controller.deleteInvoice)

router.get('/payments', controller.getPayments)
router.post('/payments', controller.createPayment)
router.put('/payments/:id', controller.updatePayment)
router.delete('/payments/:id', controller.deletePayment)

router.get('/products', authorize('SUPER_ADMIN', 'CLINIC_ADMIN', 'PRACTITIONER'), controller.getProducts)
router.post('/products', authorize('SUPER_ADMIN', 'CLINIC_ADMIN', 'PRACTITIONER'), controller.createProduct)
router.put('/products/:id', authorize('SUPER_ADMIN', 'CLINIC_ADMIN', 'PRACTITIONER'), controller.updateProduct)
router.delete('/products/:id', authorize('SUPER_ADMIN', 'CLINIC_ADMIN', 'PRACTITIONER'), controller.deleteProduct)

router.get('/reports', controller.getReports)

router.get('/documents', controller.getDocuments)
router.post('/documents', controller.createDocument)
router.put('/documents/:id', controller.updateDocument)
router.delete('/documents/:id', controller.deleteDocument)

router.get('/admins', controller.getAdmins)
router.post('/admins', controller.createAdmin)
router.put('/admins/:id', controller.updateAdmin)
router.delete('/admins/:id', controller.deleteAdmin)

router.get('/appointments', controller.getAppointments)
router.post('/appointments', controller.createAppointment)
router.put('/appointments/:id', controller.updateAppointment)
router.delete('/appointments/:id', controller.deleteAppointment)

router.get('/patients', controller.getPatients)
router.post('/patients', controller.createPatient)
router.put('/patients/:id', controller.updatePatient)
router.delete('/patients/:id', controller.deletePatient)

router.get('/contacts', controller.getContacts)
router.get('/contacts/:id', controller.getContactById)
router.post('/contacts', controller.createContact)
router.put('/contacts/:id', controller.updateContact)
router.delete('/contacts/:id', controller.deleteContact)

router.get('/waitlist', controller.getWaitlist)
router.post('/waitlist', controller.createWaitlist)
router.put('/waitlist/:id', controller.updateWaitlist)
router.delete('/waitlist/:id', controller.deleteWaitlist)

router.get('/profile', controller.getProfile)
router.put('/profile', controller.updateProfile)

router.get('/details', controller.getClinicDetails)
router.put('/details', controller.updateClinicDetails)

router.get('/settings/integrations', controller.getIntegrations)
router.post('/settings/integrations', controller.createIntegration)
router.put('/settings/integrations/:id', controller.updateIntegration)
router.delete('/settings/integrations/:id', controller.deleteIntegration)

router.get('/settings/templates', controller.getSettingsTemplates)
router.post('/settings/templates', controller.createSettingsTemplate)
router.put('/settings/templates/:type/:id', controller.updateSettingsTemplate)
router.delete('/settings/templates/:type/:id', controller.deleteSettingsTemplate)
router.put('/settings/invoice-templates', controller.updateInvoiceTemplates)

router.get('/settings/services', controller.getServices)
router.post('/settings/services', controller.createService)
router.put('/settings/services/:id', controller.updateService)
router.delete('/settings/services/:id', controller.deleteService)

router.get('/settings/cancellation-reasons', controller.getCancellationReasons)
router.post('/settings/cancellation-reasons', controller.createCancellationReason)
router.put('/settings/cancellation-reasons/:id', controller.updateCancellationReason)
router.delete('/settings/cancellation-reasons/:id', controller.deleteCancellationReason)

router.get('/settings/tags', controller.getClientTags)
router.post('/settings/tags', controller.createClientTag)
router.put('/settings/tags/:id', controller.updateClientTag)
router.delete('/settings/tags/:id', controller.deleteClientTag)

module.exports = router


