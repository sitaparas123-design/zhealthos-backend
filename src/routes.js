const express = require('express')
const router = express.Router()

const authRoutes = require('./modules/auth/auth.routes')
const superAdminRoutes = require('./modules/super-admin/super-admin.routes')
const clinicAdminRoutes = require('./modules/clinic-admin/clinic-admin.routes')
const practitionerRoutes = require('./modules/practitioner/practitioner.routes')
const salesRoutes = require('./modules/sales-executive/sales-executive.routes')
const patientRoutes = require('./modules/patient/patient.routes')

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ZHealth Clinic Backend API',
    timestamp: new Date().toISOString(),
  })
})

// Mount modules
router.use('/auth', authRoutes)
router.use('/super-admin', superAdminRoutes)
router.use('/clinic-admin', clinicAdminRoutes)
router.use('/practitioner', practitionerRoutes)
router.use('/sales', salesRoutes)
router.use('/patient', patientRoutes)

module.exports = router
