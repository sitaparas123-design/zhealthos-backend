const prisma = require('../../config/db')
const { emitEvent } = require('../../config/socket')
const crypto = require('crypto')

// Ensure live_chat_messages table exists in MySQL database
let tableInitialized = false
const initChatTable = async () => {
  if (tableInitialized) return
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`live_chat_messages\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`conversationId\` VARCHAR(191) NOT NULL,
        \`senderId\` VARCHAR(191) NOT NULL,
        \`senderName\` VARCHAR(191) NOT NULL,
        \`senderRole\` VARCHAR(191) NOT NULL,
        \`recipientId\` VARCHAR(191) NULL,
        \`recipientName\` VARCHAR(191) NULL,
        \`recipientRole\` VARCHAR(191) NULL,
        \`clinicId\` VARCHAR(191) NULL,
        \`text\` TEXT NOT NULL,
        \`attachments\` JSON NULL,
        \`isRead\` BOOLEAN NOT NULL DEFAULT FALSE,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX \`idx_conv_created\` (\`conversationId\`, \`createdAt\`),
        INDEX \`idx_sender_recip\` (\`senderId\`, \`recipientId\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    tableInitialized = true
  } catch (err) {
    console.warn('⚠️ live_chat_messages table init notice:', err.message)
  }
}

// Generate consistent 1-on-1 Room ID
const getConversationId = (id1, id2) => {
  return [String(id1), String(id2)].sort().join('__')
}

// Get dynamic scoped contacts for the logged-in user based on Role & Clinic
const getChatContacts = async (req, res, next) => {
  try {
    await initChatTable()
    const user = req.user
    const userRole = (user.role || '').toUpperCase()
    const currentUserId = user.id

    let clinicId = user.clinicId || user.profileData?.clinicId || null
    let contacts = []

    if (userRole === 'PATIENT') {
      // 1. Resolve Patient's Clinic
      const patient = await prisma.patient.findFirst({
        where: { OR: [{ userId: currentUserId }, { email: user.email }] }
      }).catch(() => null)

      if (patient?.clinicId) clinicId = patient.clinicId
      if (!clinicId && prisma.appointment) {
        const appt = await prisma.appointment.findFirst({
          where: { patientId: patient?.id, clinicId: { not: null } }
        }).catch(() => null)
        if (appt?.clinicId) clinicId = appt.clinicId
      }
      if (!clinicId) {
        const firstClinic = await prisma.clinic.findFirst().catch(() => null)
        if (firstClinic) clinicId = firstClinic.id
      }

      // Fetch ONLY this clinic's active practitioners
      const practitioners = clinicId
        ? await prisma.practitioner.findMany({ where: { clinicId, status: 'Active' }, orderBy: { name: 'asc' } }).catch(() => [])
        : await prisma.practitioner.findMany({ where: { status: 'Active' }, take: 5 }).catch(() => [])

      const clinic = clinicId ? await prisma.clinic.findUnique({ where: { id: clinicId } }).catch(() => null) : null
      const clinicName = clinic?.name || 'Clinic'

      practitioners.forEach((p, idx) => {
        contacts.push({
          id: p.userId || p.id,
          targetId: p.userId || p.id,
          name: p.name,
          role: p.specialty || 'Practitioner',
          roleCategory: 'PRACTITIONER',
          avatar: p.avatarUrl || (idx % 2 === 0 ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150' : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'),
          clinicName,
          online: true,
          badgeColor: '#30D2BE'
        })
      })

      contacts.push({
        id: `clinic_admin_${clinicId || 'main'}`,
        targetId: `clinic_admin_${clinicId || 'main'}`,
        name: `${clinicName} Front Desk & Reception`,
        role: 'Clinic Administration',
        roleCategory: 'CLINIC_ADMIN',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        clinicName,
        online: true,
        badgeColor: '#8C4BFF'
      })
    } else if (userRole === 'PRACTITIONER') {
      // 2. Practitioner Contacts: Clinic Patients & Clinic Admin & Fellow Doctors
      const pract = await prisma.practitioner.findFirst({
        where: { OR: [{ userId: currentUserId }, { email: user.email }] }
      }).catch(() => null)

      if (pract?.clinicId) clinicId = pract.clinicId

      const [patients, fellowDocs, clinic] = await Promise.all([
        clinicId ? prisma.patient.findMany({ where: { clinicId }, take: 15, orderBy: { fullName: 'asc' } }).catch(() => []) : [],
        clinicId ? prisma.practitioner.findMany({ where: { clinicId, id: { not: pract?.id } } }).catch(() => []) : [],
        clinicId ? prisma.clinic.findUnique({ where: { id: clinicId } }).catch(() => null) : null
      ])

      const clinicName = clinic?.name || 'Clinic'

      // Add Clinic Admin / Reception Desk
      contacts.push({
        id: `clinic_admin_${clinicId || 'main'}`,
        targetId: `clinic_admin_${clinicId || 'main'}`,
        name: `${clinicName} Reception & Front Desk`,
        role: 'Clinic Administration',
        roleCategory: 'CLINIC_ADMIN',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        clinicName,
        online: true,
        badgeColor: '#8C4BFF'
      })

      // Fellow Doctors
      fellowDocs.forEach(d => {
        contacts.push({
          id: d.userId || d.id,
          targetId: d.userId || d.id,
          name: d.name,
          role: d.specialty || 'Colleague Doctor',
          roleCategory: 'PRACTITIONER',
          avatar: d.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
          clinicName,
          online: true,
          badgeColor: '#30D2BE'
        })
      })

      // Patients
      patients.forEach(p => {
        contacts.push({
          id: p.userId || p.id,
          targetId: p.userId || p.id,
          name: p.fullName,
          role: 'Patient Client',
          roleCategory: 'PATIENT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          clinicName,
          online: true,
          badgeColor: '#3B82F6'
        })
      })
    } else if (userRole === 'CLINIC_ADMIN') {
      // 3. Clinic Admin Contacts: Clinic Practitioners & Patients
      if (prisma.clinic && !clinicId) {
        const c = await prisma.clinic.findFirst().catch(() => null)
        if (c) clinicId = c.id
      }

      const [practitioners, patients, clinic] = await Promise.all([
        clinicId ? prisma.practitioner.findMany({ where: { clinicId } }).catch(() => []) : [],
        clinicId ? prisma.patient.findMany({ where: { clinicId }, take: 15 }).catch(() => []) : [],
        clinicId ? prisma.clinic.findUnique({ where: { id: clinicId } }).catch(() => null) : null
      ])

      const clinicName = clinic?.name || 'Clinic'

      practitioners.forEach(p => {
        contacts.push({
          id: p.userId || p.id,
          targetId: p.userId || p.id,
          name: p.name,
          role: p.specialty || 'Practitioner Staff',
          roleCategory: 'PRACTITIONER',
          avatar: p.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
          clinicName,
          online: true,
          badgeColor: '#30D2BE'
        })
      })

      patients.forEach(p => {
        contacts.push({
          id: p.userId || p.id,
          targetId: p.userId || p.id,
          name: p.fullName,
          role: 'Registered Patient',
          roleCategory: 'PATIENT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          clinicName,
          online: true,
          badgeColor: '#3B82F6'
        })
      })
    } else if (userRole === 'SALES_EXECUTIVE') {
      // 4. Sales Executive Contacts: Leads & Sales Team
      const [leads, salesReps] = await Promise.all([
        prisma.salesLead ? prisma.salesLead.findMany({ take: 10, orderBy: { createdAt: 'desc' } }).catch(() => []) : [],
        prisma.salesUser ? prisma.salesUser.findMany({ take: 5 }).catch(() => []) : []
      ])

      salesReps.forEach(s => {
        if (s.email !== user.email) {
          contacts.push({
            id: s.id,
            targetId: s.id,
            name: s.name,
            role: 'Sales Representative',
            roleCategory: 'SALES_EXECUTIVE',
            avatar: s.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            clinicName: s.territory || 'National Sales',
            online: true,
            badgeColor: '#F59E0B'
          })
        }
      })

      leads.forEach(l => {
        contacts.push({
          id: `lead_${l.id}`,
          targetId: `lead_${l.id}`,
          name: l.contactPerson || l.companyName || 'Sales Prospect',
          role: `Lead (${l.stage || 'Pipeline'})`,
          roleCategory: 'LEAD',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
          clinicName: l.companyName || 'Clinic Prospect',
          online: true,
          badgeColor: '#10B981'
        })
      })
    } else {
      // 5. Super Admin: Platform Clinics & Admins
      const clinics = await prisma.clinic.findMany({ take: 10 }).catch(() => [])
      clinics.forEach(c => {
        contacts.push({
          id: `clinic_${c.id}`,
          targetId: `clinic_${c.id}`,
          name: `${c.name} (Admin Channel)`,
          role: `Clinic Partner (${c.tier || 'Enterprise'})`,
          roleCategory: 'CLINIC_ADMIN',
          avatar: c.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150',
          clinicName: c.name,
          online: true,
          badgeColor: '#0E1B33'
        })
      })
    }

    // Attach conversation IDs and load latest message snippet from MySQL table
    const contactListWithMeta = await Promise.all(
      contacts.map(async (c) => {
        const convId = getConversationId(currentUserId, c.targetId)
        let lastMsg = null
        let unreadCount = 0

        try {
          const rows = await prisma.$queryRawUnsafe(`
            SELECT * FROM \`live_chat_messages\`
            WHERE \`conversationId\` = ?
            ORDER BY \`createdAt\` DESC
            LIMIT 1
          `, convId)

          if (rows && rows.length > 0) {
            lastMsg = rows[0]
          }

          const unreadRows = await prisma.$queryRawUnsafe(`
            SELECT COUNT(*) as count FROM \`live_chat_messages\`
            WHERE \`conversationId\` = ? AND \`recipientId\` = ? AND \`isRead\` = 0
          `, convId, currentUserId)

          if (unreadRows && unreadRows.length > 0) {
            unreadCount = Number(unreadRows[0].count) || 0
          }
        } catch (e) {
          // fallback
        }

        return {
          ...c,
          conversationId: convId,
          lastMessage: lastMsg ? {
            text: lastMsg.text,
            time: new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senderName: lastMsg.senderName,
            isSelf: lastMsg.senderId === currentUserId
          } : null,
          unreadCount
        }
      })
    )

    res.json({ success: true, data: contactListWithMeta })
  } catch (err) {
    next(err)
  }
}

// Get all messages for a specific conversation ID
const getConversationMessages = async (req, res, next) => {
  try {
    await initChatTable()
    const { conversationId } = req.params
    if (!conversationId) {
      return res.status(400).json({ success: false, message: 'Conversation ID required' })
    }

    const messages = await prisma.$queryRawUnsafe(`
      SELECT * FROM \`live_chat_messages\`
      WHERE \`conversationId\` = ?
      ORDER BY \`createdAt\` ASC
    `, conversationId)

    const formatted = (messages || []).map(m => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.senderName,
      senderRole: m.senderRole,
      recipientId: m.recipientId,
      recipientName: m.recipientName,
      recipientRole: m.recipientRole,
      text: m.text,
      attachments: typeof m.attachments === 'string' ? JSON.parse(m.attachments || '[]') : m.attachments,
      isRead: Boolean(m.isRead),
      createdAt: m.createdAt,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    }))

    res.json({ success: true, data: formatted })
  } catch (err) {
    next(err)
  }
}

// Send a new Live Chat Message and broadcast real-time socket events
const sendLiveChatMessage = async (req, res, next) => {
  try {
    await initChatTable()
    const { conversationId, recipientId, recipientName, recipientRole, text, attachments } = req.body
    const user = req.user

    if (!text && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, message: 'Message text or attachment required' })
    }

    const convId = conversationId || getConversationId(user.id, recipientId)
    const msgId = `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
    const attachmentsJson = JSON.stringify(attachments || [])

    await prisma.$executeRawUnsafe(`
      INSERT INTO \`live_chat_messages\` (
        \`id\`, \`conversationId\`, \`senderId\`, \`senderName\`, \`senderRole\`,
        \`recipientId\`, \`recipientName\`, \`recipientRole\`, \`clinicId\`,
        \`text\`, \`attachments\`, \`isRead\`, \`createdAt\`, \`updatedAt\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(3), NOW(3))
    `,
      msgId,
      convId,
      user.id,
      user.name || 'User',
      user.role || 'USER',
      recipientId || null,
      recipientName || null,
      recipientRole || null,
      user.clinicId || null,
      text || '',
      attachmentsJson
    )

    const newMsg = {
      id: msgId,
      conversationId: convId,
      senderId: user.id,
      senderName: user.name || 'User',
      senderRole: user.role || 'USER',
      recipientId,
      recipientName,
      recipientRole,
      text: text || '',
      attachments: attachments || [],
      isRead: false,
      createdAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    }

    // 1. Broadcast real-time message to conversation room
    emitEvent('chat:message', newMsg, convId)

    // 2. Broadcast direct push notification to recipient user room
    if (recipientId) {
      emitEvent('chat:incoming', newMsg, `room:user_${recipientId}`)
      emitEvent('notification:new', {
        title: `💬 New Message from ${user.name || 'User'}`,
        message: text?.slice(0, 100) || 'Sent attachment',
        target: recipientRole || 'ALL'
      })
    }

    res.json({ success: true, data: newMsg })
  } catch (err) {
    next(err)
  }
}

// Mark messages as read in a conversation
const markMessagesAsRead = async (req, res, next) => {
  try {
    await initChatTable()
    const { conversationId } = req.params
    const currentUserId = req.user.id

    await prisma.$executeRawUnsafe(`
      UPDATE \`live_chat_messages\`
      SET \`isRead\` = 1
      WHERE \`conversationId\` = ? AND \`recipientId\` = ?
    `, conversationId, currentUserId)

    emitEvent('chat:read', { conversationId, readBy: currentUserId }, conversationId)
    res.json({ success: true, message: 'Messages marked as read' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getChatContacts,
  getConversationMessages,
  sendLiveChatMessage,
  markMessagesAsRead
}
