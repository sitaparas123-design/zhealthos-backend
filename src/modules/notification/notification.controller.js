const prisma = require('../../config/db')
const { emitEvent } = require('../../config/socket')

// Format relative time (e.g., 'Just now', '5 mins ago', '2 hours ago', 'Yesterday', 'May 12')
const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Just now'
  const date = new Date(dateInput)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 45) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

// Normalize role from JWT / req.user
const normalizeRole = (role) => {
  const r = (role || '').toUpperCase().replace('-', '_')
  if (r.includes('SUPER') || r.includes('HEAD')) return 'SUPER_ADMIN'
  if (r.includes('CLINIC')) return 'CLINIC_ADMIN'
  if (r.includes('PRACTITIONER') || r.includes('DOCTOR')) return 'PRACTITIONER'
  if (r.includes('SALES')) return 'SALES_EXECUTIVE'
  if (r.includes('PATIENT')) return 'PATIENT'
  return 'ALL'
}

// Seed initial dynamic live notifications per role if none exist
const seedRoleNotifications = async (targetRole, userId, clinicName = 'Clinic') => {
  try {
    const roleSeeds = {
      SUPER_ADMIN: [
        { title: 'Global Platform Health', message: 'All 8 distributed API cluster nodes and MySQL databases are operational at 99.98% uptime.', target: 'SUPER_ADMIN', type: 'inbox' },
        { title: 'New Clinic Onboarded', message: 'Jupiter Specialist Care onboarded on Enterprise Tier with 12 practitioner seats.', target: 'SUPER_ADMIN', type: 'inbox' },
        { title: 'Subscription Upgraded', message: 'Bayview Family Practice upgraded to Enterprise Annual Plan.', target: 'SUPER_ADMIN', type: 'inbox' },
        { title: 'Audit Compliance Check', message: 'Quarterly HIPAA & Australian Privacy Principles audit report generated successfully.', target: 'SUPER_ADMIN', type: 'inbox' }
      ],
      CLINIC_ADMIN: [
        { title: 'New Practitioner Registered', message: 'Dr. Sarah Obrien was successfully verified and linked to your clinic branch.', target: 'CLINIC_ADMIN', type: 'inbox' },
        { title: 'Outstanding Invoice Alert', message: 'Patient claim INV-20831 ($1,200) has been approved by NDIS funding manager.', target: 'CLINIC_ADMIN', type: 'inbox' },
        { title: 'Waitlist Queue Update', message: '2 new patient referrals added to the occupational therapy intake queue.', target: 'CLINIC_ADMIN', type: 'inbox' },
        { title: 'Daily Settlement Report', message: 'Stripe Merchant payout of $4,850 processed for clinic bank account.', target: 'CLINIC_ADMIN', type: 'inbox' }
      ],
      PRACTITIONER: [
        { title: 'New Appointment Booked', message: 'Patient consultation booked for Monday, 9:00 AM in Room 3.', target: 'PRACTITIONER', type: 'inbox' },
        { title: 'Clinical Notes Due', message: 'Initial Assessment SOAP Notes for new client review are pending sign-off.', target: 'PRACTITIONER', type: 'inbox' },
        { title: 'Patient Document Uploaded', message: 'Medical History scan uploaded by patient into encrypted health records.', target: 'PRACTITIONER', type: 'inbox' },
        { title: 'Treatment Milestone Reached', message: 'Shoulder Mobility Exercise Phase 2 completed with 85% compliance score.', target: 'PRACTITIONER', type: 'inbox' }
      ],
      SALES_EXECUTIVE: [
        { title: 'Hot Lead Assigned', message: 'Melbourne Spinal & Wellness Hub lead ($18k ACV) assigned to your pipeline.', target: 'SALES_EXECUTIVE', type: 'inbox' },
        { title: 'Demo Session Reminder', message: 'Upcoming ZealthOS Platform walkthrough with Sydney Allied Health in 45 minutes.', target: 'SALES_EXECUTIVE', type: 'inbox' },
        { title: 'Commission Approved', message: 'Monthly commission payout ($3,200) has been cleared by Super Admin.', target: 'SALES_EXECUTIVE', type: 'inbox' }
      ],
      PATIENT: [
        { title: 'Consultation Confirmed', message: 'Your upcoming appointment with your clinic care provider is confirmed.', target: 'PATIENT', type: 'inbox' },
        { title: 'New Exercise Prescribed', message: 'Your therapist assigned a customized daily routine in your Exercise Portal.', target: 'PATIENT', type: 'inbox' },
        { title: 'Invoice & Rebate Generated', message: 'Invoice INV-20831 is ready. Medicare & Private Health rebates applied.', target: 'PATIENT', type: 'inbox' },
        { title: 'Welcome to Care Portal', message: 'Access your secure messaging, treatment plans, and test reports anytime.', target: 'PATIENT', type: 'inbox' }
      ]
    }

    const items = roleSeeds[targetRole] || roleSeeds['SUPER_ADMIN']
    await prisma.notification.createMany({
      data: items.map(it => ({
        ...it,
        userId: userId || null,
        isRead: false
      }))
    })
  } catch (err) {
    console.warn('Notification seeding notice:', err.message)
  }
}

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const user = req.user || {}
    const userId = user.id
    const targetRole = normalizeRole(user.role)

    // Check count for this specific target role
    const roleCount = await prisma.notification.count({
      where: {
        OR: [
          { target: 'ALL' },
          { target: 'All' },
          { target: targetRole },
          { target: userId }
        ]
      }
    }).catch(() => 0)

    if (roleCount === 0) {
      await seedRoleNotifications(targetRole, userId)
    }

    // Query notifications strictly scoped by target role, userId, or broadcast
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { target: 'ALL' },
          { target: 'All' },
          { target: targetRole },
          { target: userId },
          { userId: userId, type: 'sent' }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 30
    })

    const formatted = notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      target: n.target,
      type: n.type || 'inbox',
      isRead: Boolean(n.isRead),
      read: Boolean(n.isRead),
      date: formatTimeAgo(n.createdAt),
      time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: n.createdAt
    }))

    return res.json({
      success: true,
      data: formatted,
      unreadCount: formatted.filter(n => !n.isRead).length
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    })
  }
}

// POST /api/notifications/broadcast
const broadcastNotification = async (req, res) => {
  try {
    const { title, message, target } = req.body
    const user = req.user

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      })
    }

    const assignedTarget = target ? normalizeRole(target) : 'ALL'

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        target: assignedTarget,
        type: 'sent',
        userId: user?.id || null,
        isRead: false
      }
    })

    const formatted = {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      target: notification.target,
      type: notification.type,
      isRead: false,
      read: false,
      date: 'Just now',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: notification.createdAt
    }

    // Emit live WebSocket notification event to all connected clients
    emitEvent('notification:new', formatted)
    emitEvent('notification:refetch', { target: assignedTarget })

    return res.json({
      success: true,
      data: formatted
    })
  } catch (error) {
    console.error('Error broadcasting notification:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to broadcast notification'
    })
  }
}

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })

    return res.json({
      success: true,
      data: { ...notification, read: true, isRead: true }
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    })
  }
}

// PUT /api/notifications/mark-all-read
const markAllAsRead = async (req, res) => {
  try {
    const user = req.user
    const targetRole = normalizeRole(user.role)

    await prisma.notification.updateMany({
      where: {
        OR: [
          { target: 'ALL' },
          { target: 'All' },
          { target: targetRole },
          { target: user.id }
        ],
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return res.json({
      success: true,
      message: 'All notifications marked as read'
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all as read'
    })
  }
}

// DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.notification.delete({
      where: { id }
    })

    return res.json({
      success: true,
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    })
  }
}

module.exports = {
  getNotifications,
  broadcastNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
}
