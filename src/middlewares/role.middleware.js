const normalizeRole = (role) => {
  if (!role) return ''
  const r = String(role).toUpperCase().replace(/[\s_-]+/g, '_')
  if (r === 'SUPERADMIN' || r === 'HEAD_ADMIN' || r === 'HEADADMIN' || r === 'ADMIN') return 'SUPER_ADMIN'
  if (r === 'CLINICADMIN' || r === 'CLINIC_ADMIN' || r === 'CLINIC') return 'CLINIC_ADMIN'
  if (r === 'DOCTOR' || r === 'PRACTITIONER') return 'PRACTITIONER'
  if (r === 'SALES' || r === 'SALESPERSON' || r === 'SALES_EXECUTIVE' || r === 'SALESEXECUTIVE') return 'SALES_EXECUTIVE'
  if (r === 'PATIENT' || r === 'CLIENT') return 'PATIENT'
  return r
}

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' })
    }

    const userRole = normalizeRole(req.user.role)
    const normalizedAllowed = allowedRoles.map(normalizeRole)

    // SUPER_ADMIN has master access across the platform
    if (userRole === 'SUPER_ADMIN') {
      return next()
    }

    // Allow GET read access for common clinic metadata and resources across user dashboards
    if (req.method === 'GET') {
      return next()
    }

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      })
    }

    next()
  }
}

module.exports = authorize

