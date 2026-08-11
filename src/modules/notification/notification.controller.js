const prisma = require('../../config/db')

// Map JWT roles to Prisma Notification target role strings
const getNotificationRoleString = (role) => {
  if (!role) return 'All'
  // Roles are SUPER_ADMIN, CLINIC_ADMIN, PRACTITIONER, SALES_EXECUTIVE, PATIENT
  return role.toUpperCase()
}

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role // e.g. 'SUPER_ADMIN', 'CLINIC_ADMIN', etc.
    const targetRole = getNotificationRoleString(userRole)

    // Check if we have any notifications in the db at all
    const count = await prisma.notification.count()
    if (count === 0) {
      // Seed default mock notifications for all roles
      const defaultNotifications = [
        // SUPER_ADMIN (head_admin)
        { title: 'New Clinic Onboarded', message: 'West Coast Family Care joined on the Advanced plan', target: 'SUPER_ADMIN', type: 'inbox' },
        { title: 'Subscription Upgraded', message: 'Bayview Family Clinic upgraded from Advanced to Enterprise', target: 'SUPER_ADMIN', type: 'inbox' },
        { title: 'Failed payment alert', message: 'Admin session: Card ending in 4321 declined (insufficient funds)', target: 'SUPER_ADMIN', type: 'inbox' },
        { title: 'Compliance Logs Flushed', message: 'System log backup has completed successfully.', target: 'SUPER_ADMIN', type: 'inbox' },
        { title: 'System Notification Broadcast', message: 'Global system maintenance scheduled for Sunday at 02:00 AM UTC.', target: 'All', type: 'sent', userId },

        // CLINIC_ADMIN
        { title: 'Outstanding Invoice Warning', message: 'Lakeside Medical invoice INV-20831 ($1,200) is now 8 days overdue.', target: 'CLINIC_ADMIN', type: 'inbox' },
        { title: 'New Patient Registration', message: 'Alice Smith registered as a new clinic patient.', target: 'CLINIC_ADMIN', type: 'inbox' },
        { title: 'Waitlist Alert', message: 'Patient with Falls Risk added to the waitlist.', target: 'CLINIC_ADMIN', type: 'inbox' },
        { title: 'Stripe Integration Active', message: 'Stripe webhook payments sync completed successfully.', target: 'CLINIC_ADMIN', type: 'inbox' },

        // PRACTITIONER
        { title: 'New Appointment Booked', message: 'Patient John Miller scheduled a Consultation for Monday, Jun 8 at 9:00 AM.', target: 'PRACTITIONER', type: 'inbox' },
        { title: 'Clinical Notes Pending', message: 'SOAP Notes for Bob Johnson (Administrative OT review) are due.', target: 'PRACTITIONER', type: 'inbox' },
        { title: 'Patient Uploaded File', message: 'John Miller uploaded "Diagnostic Scan 2026.pdf" to patient records.', target: 'PRACTITIONER', type: 'inbox' },
        { title: 'System Broadcast Alert', message: 'Global Assessment Templates updated by Super Admin.', target: 'PRACTITIONER', type: 'inbox' },

        // SALES_EXECUTIVE (sales)
        { title: 'Lead Assigned', message: 'Hobart Spinal Adjustments lead has been assigned to Colin Edegbe.', target: 'SALES_EXECUTIVE', type: 'inbox' },
        { title: 'Demo Reminder', message: 'Upcoming Product Demo with Brisbane Kids OT Clinic starts in 2 hours.', target: 'SALES_EXECUTIVE', type: 'inbox' },
        { title: 'Commission Paid', message: 'Commission for Zoya Clinic ($2,400) has been approved and paid.', target: 'SALES_EXECUTIVE', type: 'inbox' },

        // PATIENT
        { title: 'Booking Confirmed', message: 'Your Consultation with Dr. Sarah Jenkins is confirmed for Monday, Jun 8 at 9:00 AM.', target: 'PATIENT', type: 'inbox' },
        { title: 'New Invoice Issued', message: 'Invoice INV-20831 for $1,200.00 has been generated for NDIS funding.', target: 'PATIENT', type: 'inbox' },
        { title: 'Exercise Prescribed', message: 'Dr. Sarah Jenkins assigned a new exercise plan: "Lower Back Stretch".', target: 'PATIENT', type: 'inbox' }
      ]

      await prisma.notification.createMany({
        data: defaultNotifications
      })
    }

    // Find notifications that are sent directly to this user, or targeted to their role, or targeted to 'All'
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { target: 'All' },
          { target: targetRole },
          { target: userId },
          { userId: userId, type: 'sent' }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.json({
      success: true,
      data: notifications
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
    const userId = req.user.id

    if (!title || !message || !target) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and target are required'
      })
    }

    // Save the broadcasted notification
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        target,
        type: 'sent',
        userId
      }
    })

    // If the target is 'All' or a specific role (e.g. CLINIC_ADMIN), it is treated as a broadcast.
    // Also, let's create a corresponding 'inbox' item for recipients or handle it dynamically in getNotifications.
    // By keeping it dynamic, `getNotifications` matches target: targetRole, which matches all users with that role automatically.
    // So we only need to write ONE record to the database! Beautiful and efficient.

    return res.json({
      success: true,
      data: notification
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
      data: notification
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
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
  deleteNotification
}
