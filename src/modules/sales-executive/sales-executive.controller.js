const prisma = require('../../config/db')
const bcrypt = require('bcryptjs')

// Helper function to format lead object consistently for frontend & database
const formatLead = (lead) => {
  if (!lead) return null
  return {
    ...lead,
    name: lead.companyName || lead.name || '',
    contactPerson: lead.contactPerson || '',
    contact: lead.phone || lead.contact || '',
    email: lead.email || '',
    location: lead.territory || lead.location || '',
    value: parseFloat(lead.value) || 0,
    stage: lead.stage || lead.status || 'New Lead',
    status: lead.status || lead.stage || 'New',
    notes: lead.notes || '',
    source: lead.source || 'Web Form',
    displayId: lead.displayId || `LED-${String(lead.id).slice(0, 6)}`,
  }
}

const getLeads = async (req, res, next) => {
  try {
    // Disable caching so Chrome always fetches fresh data (prevents 304 empty body issue)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    const rawLeads = await prisma.salesLead.findMany({ orderBy: { createdAt: 'desc' } })
    const leads = rawLeads.map(formatLead)
    res.json({ success: true, data: leads })
  } catch (err) {
    next(err)
  }
}

const createLead = async (req, res, next) => {
  try {
    const { name, companyName, contactPerson, email, phone, contact, location, territory, value, stage, status, notes, source } = req.body
    
    const finalCompanyName = name || companyName
    const finalEmail = email
    
    if (!finalCompanyName || !finalEmail) {
      return res.status(400).json({ success: false, message: 'Clinic Name and Email are required' })
    }

    const count = await prisma.salesLead.count()
    const displayId = `LED-${String(count + 1).padStart(6, '0')}`

    const newLead = await prisma.salesLead.create({
      data: {
        displayId,
        companyName: finalCompanyName,
        contactPerson: contactPerson || finalCompanyName,
        email: finalEmail,
        phone: phone || contact || null,
        status: status || stage || 'New',
        value: parseFloat(value) || 0.0,
        assignedTo: req.user ? req.user.name || req.user.email : 'Sales Executive',
        territory: location || territory || 'General Platform',
        tier: 'Basic',
        stage: stage || 'New Lead',
        notes: notes || null,
      },
    })

    res.json({ success: true, data: formatLead(newLead) })
  } catch (err) {
    next(err)
  }
}

const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, companyName, contactPerson, email, phone, contact, location, territory, value, stage, status, notes } = req.body

    const dataToUpdate = {}
    if (name || companyName) dataToUpdate.companyName = name || companyName
    if (contactPerson !== undefined) dataToUpdate.contactPerson = contactPerson
    if (email !== undefined) dataToUpdate.email = email
    if (phone !== undefined || contact !== undefined) dataToUpdate.phone = phone || contact
    if (location !== undefined || territory !== undefined) dataToUpdate.territory = location || territory
    if (value !== undefined) dataToUpdate.value = parseFloat(value) || 0
    if (stage !== undefined) dataToUpdate.stage = stage
    if (status !== undefined) dataToUpdate.status = status
    if (notes !== undefined) dataToUpdate.notes = notes

    const updated = await prisma.salesLead.update({
      where: { id },
      data: dataToUpdate,
    })

    res.json({ success: true, data: formatLead(updated) })
  } catch (err) {
    next(err)
  }
}

const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, stage } = req.body
    const newStage = stage || status
    const newStatus = status || stage

    const updated = await prisma.salesLead.update({
      where: { id },
      data: {
        stage: newStage,
        status: newStatus,
      },
    })

    res.json({ success: true, data: formatLead(updated) })
  } catch (err) {
    next(err)
  }
}

const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.salesLead.delete({ where: { id } })
    res.json({ success: true, message: 'Sales Lead deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const addLeadActivity = async (req, res, next) => {
  try {
    const { id } = req.params
    const { text } = req.body
    if (!text) return res.status(400).json({ success: false, message: 'Activity text is required' })

    const existingLead = await prisma.salesLead.findUnique({ where: { id } })
    if (!existingLead) return res.status(404).json({ success: false, message: 'Lead not found' })

    const currentHistory = Array.isArray(existingLead.history) ? existingLead.history : []
    const newHistory = [...currentHistory, { time: new Date().toLocaleString(), text }]

    const updated = await prisma.salesLead.update({
      where: { id },
      data: { history: newHistory }
    })

    res.json({ success: true, data: formatLead(updated) })
  } catch (err) {
    next(err)
  }
}

// ── TASKS CONTROLLERS ────────────────────────────────────────────────────────
const getTasks = async (req, res, next) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    const tasks = await prisma.salesTask.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: tasks })
  } catch (err) {
    next(err)
  }
}

const createTask = async (req, res, next) => {
  try {
    const { title, category, leadName, dueDate, priority, status, notes, assignedTo } = req.body
    if (!title) return res.status(400).json({ success: false, message: 'Task title is required' })

    const count = await prisma.salesTask.count()
    let displayId = `TSK-${String(count + 1).padStart(6, '0')}`
    let isUnique = false
    let attempt = 0
    while (!isUnique && attempt < 20) {
      const existing = await prisma.salesTask.findUnique({ where: { displayId } })
      if (!existing) {
        isUnique = true //false
      } else {
        attempt++
        displayId = `TSK-${String(count + 1 + attempt).padStart(6, '0')}`
      }
    }
    if (!isUnique) {
      displayId = `TSK-${Date.now()}`
    }

    const task = await prisma.salesTask.create({
      data: {
        displayId,
        title: String(title),
        category: category ? String(category) : 'Calls',
        leadName: leadName ? String(leadName) : null,
        dueDate: dueDate ? String(dueDate) : null,
        priority: priority ? String(priority) : 'Medium',
        status: status ? String(status) : 'Pending',
        assignedTo: assignedTo || (req.user ? req.user.name || req.user.email : 'Sales Executive'),
        notes: notes ? String(notes) : null,
      }
    })

    res.json({ success: true, data: task })
  } catch (err) {
    console.error('❌ Error creating sales task in backend:', err)
    next(err)
  }
}

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, category, leadName, dueDate, priority, status, notes } = req.body

    const dataToUpdate = {}
    if (title !== undefined) dataToUpdate.title = title
    if (category !== undefined) dataToUpdate.category = category
    if (leadName !== undefined) dataToUpdate.leadName = leadName
    if (dueDate !== undefined) dataToUpdate.dueDate = dueDate
    if (priority !== undefined) dataToUpdate.priority = priority
    if (status !== undefined) dataToUpdate.status = status
    if (notes !== undefined) dataToUpdate.notes = notes

    const updated = await prisma.salesTask.update({
      where: { id },
      data: dataToUpdate,
    })

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.salesTask.delete({ where: { id } })
    res.json({ success: true, message: 'Sales task deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// ── CALENDAR EVENTS CONTROLLERS ─────────────────────────────────────────────
const getCalendarEvents = async (req, res, next) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    const events = await prisma.salesCalendarEvent.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: events })
  } catch (err) {
    next(err)
  }
}

const createCalendarEvent = async (req, res, next) => {
  try {
    const { title, date, time, clinic, contact, type, stage, notes } = req.body
    if (!title || !date || !time) {
      return res.status(400).json({ success: false, message: 'Title, Date and Time are required' })
    }

    const count = await prisma.salesCalendarEvent.count()
    const displayId = `EVT-${String(count + 1).padStart(6, '0')}`

    const evt = await prisma.salesCalendarEvent.create({
      data: {
        displayId,
        title,
        date,
        time,
        clinic: clinic || 'Prospect Clinic',
        contact: contact || null,
        type: type || 'Demo',
        stage: stage || 'Demo Scheduled',
        notes: notes || null,
      }
    })

    res.json({ success: true, data: evt })
  } catch (err) {
    next(err)
  }
}

const updateCalendarEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, date, time, clinic, contact, type, stage, notes, status } = req.body

    const dataToUpdate = {}
    if (title !== undefined) dataToUpdate.title = title
    if (date !== undefined) dataToUpdate.date = date
    if (time !== undefined) dataToUpdate.time = time
    if (clinic !== undefined) dataToUpdate.clinic = clinic
    if (contact !== undefined) dataToUpdate.contact = contact
    if (type !== undefined) dataToUpdate.type = type
    if (stage !== undefined) dataToUpdate.stage = stage
    if (notes !== undefined) dataToUpdate.notes = notes
    if (status !== undefined) dataToUpdate.status = status

    const updated = await prisma.salesCalendarEvent.update({
      where: { id },
      data: dataToUpdate,
    })

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

const deleteCalendarEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.salesCalendarEvent.delete({ where: { id } })
    res.json({ success: true, message: 'Calendar event deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// ── MESSAGES CONTROLLERS ───────────────────────────────────────────────────
const getMessages = async (req, res, next) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    const messages = await prisma.salesMessage.findMany({ orderBy: { createdAt: 'asc' } })
    res.json({ success: true, data: messages })
  } catch (err) {
    next(err)
  }
}

const sendMessage = async (req, res, next) => {
  try {
    const { text, recipient } = req.body
    if (!text) return res.status(400).json({ success: false, message: 'Message text is required' })

    const sender = req.user ? req.user.name || req.user.email : 'Sales Executive'
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const message = await prisma.salesMessage.create({
      data: {
        sender,
        recipient: recipient || 'Sales Team',
        text,
        timestamp,
      }
    })

    res.json({ success: true, data: message })
  } catch (err) {
    next(err)
  }
}

// ── CLINICS CONTROLLERS ─────────────────────────────────────────────────────
const getClinics = async (req, res, next) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    const clinics = await prisma.clinic.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: clinics })
  } catch (err) {
    next(err)
  }
}

const updateClinic = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, email, phone, salesperson, revenue, tier, status, onboardingSteps } = req.body

    const dataToUpdate = {}
    if (name !== undefined) dataToUpdate.name = name
    if (email !== undefined) dataToUpdate.email = email
    if (phone !== undefined) dataToUpdate.phone = phone
    if (salesperson !== undefined) dataToUpdate.salesperson = salesperson
    if (revenue !== undefined) dataToUpdate.revenue = parseFloat(revenue) || 0
    if (tier !== undefined) dataToUpdate.tier = tier
    if (status !== undefined) dataToUpdate.status = status
    if (onboardingSteps !== undefined) dataToUpdate.onboardingSteps = onboardingSteps

    const updated = await prisma.clinic.update({
      where: { id },
      data: dataToUpdate
    })

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}
const deleteClinic = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.clinic.delete({ where: { id } })
    res.json({ success: true, message: 'Clinic deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const convertLead = async (req, res, next) => {
  try {
    const { leadId, tier, value, salesperson } = req.body
    if (!leadId) {
      return res.status(400).json({ success: false, message: 'Lead ID is required' })
    }

    // Find the lead
    const lead = await prisma.salesLead.findUnique({ where: { id: leadId } })
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' })
    }

    const assignedSalesperson = salesperson || (req.user ? req.user.name || req.user.email : 'Sales Executive')

    // Perform atomic transaction for Clinic, Branch, User, and UserBranch creation & Lead status update
    const [clinic, updatedLead, generatedPassword] = await prisma.$transaction(async (tx) => {
      const createdClinic = await tx.clinic.create({
        data: {
          name: lead.companyName || lead.name || 'Converted Clinic',
          email: lead.email || '',
          phone: lead.phone || lead.contact || '',
          contactPerson: lead.contactPerson || '',
          salesperson: assignedSalesperson,
          tier: tier || 'Basic',
          revenue: parseFloat(value) || parseFloat(lead.value) || 0,
          status: 'Active',
        }
      })

      const mainBranch = await tx.branch.create({
        data: {
          clinicId: createdClinic.id,
          name: 'Main Branch',
          email: createdClinic.email,
          phone: createdClinic.phone,
          status: 'Active'
        }
      })

      let defaultPassword = null
      if (createdClinic.email && createdClinic.email.includes('@')) {
        const bcrypt = require('bcryptjs')
        defaultPassword = '12345678'
        const passwordHash = await bcrypt.hash(defaultPassword, 10)

        const adminUser = await tx.user.upsert({
          where: { email: createdClinic.email.toLowerCase().trim() },
          update: {
            status: 'ACTIVE',
            role: 'CLINIC_ADMIN'
          },
          create: {
            email: createdClinic.email.toLowerCase().trim(),
            passwordHash: passwordHash,
            name: createdClinic.contactPerson || createdClinic.name || 'Clinic Admin',
            phone: createdClinic.phone || null,
            role: 'CLINIC_ADMIN',
            status: 'ACTIVE'
          }
        })

        await tx.userBranch.upsert({
          where: {
            userId_branchId: {
              userId: adminUser.id,
              branchId: mainBranch.id
            }
          },
          update: {},
          create: {
            userId: adminUser.id,
            branchId: mainBranch.id
          }
        })
      }

      const history = Array.isArray(lead.history) ? lead.history : []
      history.push({ time: new Date().toISOString(), text: `Converted to Clinic successfully (Tier: ${tier || 'Basic'})` })

      const leadUpdated = await tx.salesLead.update({
        where: { id: leadId },
        data: {
          stage: 'Converted',
          status: 'Converted',
          history,
        }
      })

      return [createdClinic, leadUpdated, defaultPassword]
    })

    res.json({
      success: true,
      message: 'Lead converted to Clinic successfully',
      data: {
        clinic,
        lead: updatedLead
      }
    })
  } catch (err) {
    next(err)
  }
}

// ── PROFILE / SETTINGS CONTROLLERS ───────────────────────────────────────────

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    // profileData JSON stores sales-specific settings: territory, alerts
    const profileData = user.profileData || {}

    res.json({
      success: true,
      data: {
        id: user.id,
        displayId: user.displayId || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'Sales Executive',
        status: user.status || 'Active',
        avatarUrl: user.avatarUrl || null,
        profileData: profileData,
        territory: profileData.territory || '',
        emailAlerts: profileData.emailAlerts !== undefined ? profileData.emailAlerts : true,
        smsAlerts: profileData.smsAlerts !== undefined ? profileData.smsAlerts : false,
        browserAlerts: profileData.browserAlerts !== undefined ? profileData.browserAlerts : true,
      },
    })
  } catch (err) {
    next(err)
  }
}

const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' })

    const { name, phone, territory, emailAlerts, smsAlerts, browserAlerts, profileData: reqProfileData, avatarUrl } = req.body

    // Read current profileData so we don't wipe unrelated keys
    const existing = await prisma.user.findUnique({ where: { id: userId } })
    const currentProfileData = (existing && existing.profileData) || {}

    const updatedProfileData = {
      ...currentProfileData,
      ...(territory !== undefined && { territory }),
      ...(emailAlerts !== undefined && { emailAlerts }),
      ...(smsAlerts !== undefined && { smsAlerts }),
      ...(browserAlerts !== undefined && { browserAlerts }),
      ...(reqProfileData || {})
    }

    const dataToUpdate = { profileData: updatedProfileData }
    if (name !== undefined && name.trim()) dataToUpdate.name = name.trim()
    if (phone !== undefined) dataToUpdate.phone = phone
    if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl

    const updated = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    })

    const pd = updated.profileData || {}

    res.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone || '',
        territory: pd.territory || '',
        emailAlerts: pd.emailAlerts !== undefined ? pd.emailAlerts : true,
        smsAlerts: pd.smsAlerts !== undefined ? pd.smsAlerts : false,
        browserAlerts: pd.browserAlerts !== undefined ? pd.browserAlerts : true,
      },
    })
  } catch (err) {
    next(err)
  }
}

const changeMyPassword = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' })

    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' })
    }

    const newHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    })

    res.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    next(err)
  }
}

// ── SUBSCRIPTION PLANS ────────────────────────────────────────────────────────

const getSubscriptionPlans = async (req, res, next) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ 
      where: { isActive: true },
      orderBy: { monthlyPrice: 'asc' } 
    })
    res.json({ success: true, data: plans })
  } catch (err) {
    next(err)
  }
}

// ── COMMISSIONS CONTROLLERS ───────────────────────────────────────────

const getCommissions = async (req, res, next) => {
  try {
    const salesperson = req.user?.name || req.user?.email || 'Sales Executive'
    const payouts = await prisma.commissionPayout.findMany({
      where: { salesperson },
      orderBy: { requestDate: 'desc' }
    })
    res.json({ success: true, data: payouts })
  } catch (err) {
    next(err)
  }
}

const requestPayout = async (req, res, next) => {
  try {
    const { clinicId, clinicName, amount } = req.body
    const salesperson = req.user?.name || req.user?.email || 'Sales Executive'

    if (!clinicId || !clinicName || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const payout = await prisma.commissionPayout.create({
      data: {
        clinicId,
        clinicName,
        salesperson,
        amount: parseFloat(amount)
      }
    })

    await prisma.salesMessage.create({
      data: {
        sender: salesperson,
        recipient: 'Head Admin',
        text: `🔔 Payout Request: Please release commission payment of $${parseFloat(amount).toFixed(2)} for converted clinic "${clinicName}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    })

    res.json({ success: true, data: payout })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  addLeadActivity,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getMessages,
  sendMessage,
  getClinics,
  updateClinic,
  deleteClinic,
  convertLead,
  getSubscriptionPlans,
  getCommissions,
  requestPayout,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
}

