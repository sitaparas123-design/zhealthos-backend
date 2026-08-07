const express = require('express')
const router = express.Router()
const controller = require('./super-admin.controller')
const authenticate = require('../../middlewares/auth.middleware')
const authorize = require('../../middlewares/role.middleware')

router.use(authenticate, authorize('SUPER_ADMIN'))

router.get('/clinics', controller.getClinics)
router.post('/clinics', controller.createClinic)
router.put('/clinics/:id', controller.updateClinic)
router.delete('/clinics/:id', controller.deleteClinic)
router.put('/clinics/:id/status', controller.updateClinicStatus)
router.put('/clinics/:id/tier', controller.updateClinicTier)
router.post('/clinics/:id/reset-billing', controller.resetClinicBilling)
router.post('/clinics/:id/impersonate', controller.impersonateClinicAdmin)
router.post('/clinics/:id/announcements', controller.sendClinicAnnouncement)
router.put('/clinics/:id/features', controller.updateClinicFeatures)
router.put('/clinics/:id/reset-password', controller.resetClinicPassword)
router.get('/clinics/:id/invoices', controller.getClinicInvoices)
router.get('/clinics/:id/tickets', controller.getClinicSupportTickets)
router.get('/clinics/:id/audit-logs', controller.getClinicAuditLogs)
router.get('/admins', controller.getAdmins)
router.post('/admins', controller.createAdmin)
router.put('/admins/:id', controller.updateAdmin)
router.delete('/admins/:id', controller.deleteAdmin)
router.get('/subscriptions', controller.getSubscriptions)
router.post('/subscriptions', controller.createSubscription)
router.put('/subscriptions/:id', controller.updateSubscription)
router.delete('/subscriptions/:id', controller.deleteSubscription)
router.get('/billing/overview', controller.getBillingOverview)
router.put('/invoices/:id', controller.updateInvoiceStatus)
router.put('/billing/invoices/:id', controller.updateInvoiceStatus)
router.delete('/billing/invoices/:id', controller.deleteSubscriptionInvoice)
router.get('/audit-logs', controller.getAuditLogs)
router.post('/audit-logs', controller.createAuditLog)

// Compliance Alerts
router.get('/compliance-alerts', controller.getComplianceAlerts)
router.post('/compliance-alerts', controller.createComplianceAlert)
router.put('/compliance-alerts/:id', controller.updateComplianceAlert)
router.delete('/compliance-alerts/:id', controller.deleteComplianceAlert)

// Data Governance Logs
router.get('/governance-logs', controller.getGovernanceLogs)
router.post('/governance-logs', controller.createGovernanceLog)

// Security Controls & Policies
router.get('/security-controls', controller.getSecurityControls)
router.put('/security-controls', controller.updateSecurityControls)

// Sales User Management
router.get('/sales-users', controller.getSalesUsers)
router.post('/sales-users', controller.createSalesUser)
router.put('/sales-users/:id', controller.updateSalesUser)
router.delete('/sales-users/:id', controller.deleteSalesUser)

// Affiliate Tracking
router.get('/affiliates', controller.getAffiliates)
router.post('/affiliates', controller.createAffiliate)
router.put('/affiliates/:id', controller.updateAffiliate)
router.delete('/affiliates/:id', controller.deleteAffiliate)

// Lead Pipeline
router.get('/sales-leads', controller.getSalesLeads)
router.post('/sales-leads', controller.createSalesLead)
router.put('/sales-leads/:id', controller.updateSalesLead)
router.delete('/sales-leads/:id', controller.deleteSalesLead)

// Support Centre
router.get('/support-tickets', controller.getSupportTickets)
router.post('/support-tickets', controller.createSupportTicket)
router.put('/support-tickets/:id', controller.updateSupportTicket)
router.delete('/support-tickets/:id', controller.deleteSupportTicket)

router.get('/support-bugs', controller.getSupportBugs)
router.post('/support-bugs', controller.createSupportBug)
router.put('/support-bugs/:id', controller.updateSupportBug)
router.delete('/support-bugs/:id', controller.deleteSupportBug)

router.get('/support-features', controller.getSupportFeatures)
router.post('/support-features', controller.createSupportFeature)
router.put('/support-features/:id/vote', controller.voteSupportFeature)

router.get('/support-chats', controller.getSupportChats)
router.post('/support-chats', controller.sendSupportChatMessage)

router.get('/support-history', controller.getSupportClinicHistory)

// Profile & Settings
router.get('/profile', controller.getProfile)
router.put('/profile', controller.updateProfile)
router.get('/settings/templates', controller.getTemplates)
router.post('/settings/templates', controller.createTemplate)
router.put('/settings/templates/:type/:id', controller.updateTemplate)
router.delete('/settings/templates/:type/:id', controller.deleteTemplate)
router.get('/settings/services', controller.getServices)
router.post('/settings/services', controller.createService)
router.put('/settings/services/:id', controller.updateService)
router.delete('/settings/services/:id', controller.deleteService)
router.get('/settings/tags', controller.getTags)
router.post('/settings/tags', controller.createTag)
router.put('/settings/tags/:id', controller.updateTag)
router.delete('/settings/tags/:id', controller.deleteTag)
router.get('/settings/cancellation-reasons', controller.getCancellationReasons)
router.post('/settings/cancellation-reasons', controller.createCancellationReason)
router.put('/settings/cancellation-reasons/:id', controller.updateCancellationReason)
router.delete('/settings/cancellation-reasons/:id', controller.deleteCancellationReason)
router.post('/settings/import', controller.processDataImport)
router.post('/settings/export', controller.logDataExport)
router.get('/settings/data-logs', controller.getDataLogs)
router.post('/change-password', controller.changePassword)
router.get('/login-history', controller.getLoginHistory)
router.delete('/sessions/:id', controller.revokeSession)

// Platform Analytics
router.get('/platform-analytics', controller.getPlatformAnalytics)

module.exports = router

