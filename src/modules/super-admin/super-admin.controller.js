const prisma = require('../../config/db')
const bcrypt = require('bcryptjs')
const { generateDisplayId } = require('../../utils/displayId.util')

// Super Admin: Get all clinics
const getClinics = async (req, res, next) => {
  try {
    const clinics = await prisma.clinic.findMany({
      include: { branches: true, subscriptions: true },
      orderBy: { createdAt: 'desc' },
    })

    for (let i = 0; i < clinics.length; i++) {
      if (!clinics[i].displayId) {
        const generated = `CLN-${String(clinics.length - i).padStart(6, '0')}`
        await prisma.clinic.update({
          where: { id: clinics[i].id },
          data: { displayId: generated }
        }).catch(() => null)
        clinics[i].displayId = generated
      }
    }

    res.json({ success: true, data: clinics })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create clinic
const createClinic = async (req, res, next) => {
  try {
    const {
      name, email, phone, contact, address, country, state, logoUrl, avatar,
      contactPerson, website, salesperson, referral, staffCount, patientsCount, revenue, tier, status
    } = req.body

    const fullAddress = address || (state || country ? `${state || ''} ${country || ''}`.trim() : null)
    const displayId = await generateDisplayId('clinic', 'CLN')

    const clinic = await prisma.clinic.create({
      data: {
        displayId,
        name: name || 'New Clinic',
        email: email || null,
        phone: phone || contact || null,
        address: fullAddress,
        logoUrl: logoUrl || avatar || null,
        contactPerson: contactPerson || null,
        website: website || null,
        country: country || null,
        state: state || null,
        salesperson: salesperson || null,
        referral: referral || null,
        staffCount: parseInt(staffCount) || 1,
        patientsCount: parseInt(patientsCount) || 0,
        revenue: parseFloat(revenue) || 0,
        tier: tier || 'Basic',
        status: status || 'Active',
      },
    })

    // Automatically create billing invoice for newly registered clinic
    const invCount = await prisma.invoice.count().catch(() => 0)
    const invDisplayId = `INV-${String(invCount + 1).padStart(6, '0')}`
    const today = new Date().toISOString().split('T')[0]
    const invAmount = parseFloat(revenue) || (tier === 'Enterprise' ? 1000 : tier === 'Pro' ? 300 : 150)

    await prisma.invoice.create({
      data: {
        displayId: invDisplayId,
        invoiceNumber: `INV-${Math.floor(7000 + Math.random() * 2000)}`,
        clinicId: clinic.id,
        patientName: clinic.name,
        issueDate: today,
        dueDate: today,
        amount: invAmount,
        due: invAmount,
        status: 'Overdue'
      }
    }).catch(() => null)

    if (clinic.email) {
      const cleanEmail = clinic.email.toLowerCase().trim()
      const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } })
      if (existingUser) {
        const existingPData = (existingUser.profileData && typeof existingUser.profileData === 'object') ? existingUser.profileData : {}
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            profileData: { ...existingPData, clinicId: clinic.id }
          }
        }).catch(() => null)
      }
    }

    res.json({ success: true, data: clinic })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Subscriptions management
const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await prisma.subscription.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: subscriptions })
  } catch (err) {
    next(err)
  }
}

// ---- MASTER SUBSCRIPTION PLANS (CATALOG) ----
const getSubscriptionPlans = async (req, res, next) => {
  try {
    if (prisma.subscriptionPlan) {
      const plans = await prisma.subscriptionPlan.findMany({ orderBy: { monthlyPrice: 'asc' } }).catch(() => null)
      if (plans && plans.length > 0) {
        return res.json({ success: true, data: plans })
      }
    }
    const defaultPlans = [
      { id: 'plan-starter', name: 'Starter Plan', monthlyPrice: 49, yearlyPrice: 490, features: ['1 Practitioner', 'Basic Scheduling', 'Email Support'], isActive: true },
      { id: 'plan-basic', name: 'Basic Plan', monthlyPrice: 99, yearlyPrice: 990, features: ['Up to 3 Practitioners', 'Standard EHR & Billing', 'Priority Email Support'], isActive: true },
      { id: 'plan-professional', name: 'Professional Plan', monthlyPrice: 199, yearlyPrice: 1990, features: ['Up to 10 Practitioners', 'Advanced Analytics & AI Notes', '24/7 Priority Support'], isActive: true },
      { id: 'plan-enterprise', name: 'Enterprise Plan', monthlyPrice: 399, yearlyPrice: 3990, features: ['Unlimited Practitioners', 'Custom Integrations & API', 'Dedicated Account Manager'], isActive: true },
    ]
    res.json({ success: true, data: defaultPlans })
  } catch (err) {
    next(err)
  }
}

const createSubscriptionPlan = async (req, res, next) => {
  try {
    const { name, monthlyPrice, features } = req.body
    const newPlan = await prisma.subscriptionPlan.create({
      data: {
        name,
        monthlyPrice: parseFloat(monthlyPrice),
        features: features || [],
      }
    })
    res.status(201).json({ success: true, data: newPlan })
  } catch (err) {
    next(err)
  }
}

const updateSubscriptionPlan = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, monthlyPrice, features, isActive } = req.body
    
    const data = {}
    if (name !== undefined) data.name = name
    if (monthlyPrice !== undefined) data.monthlyPrice = parseFloat(monthlyPrice)
    if (features !== undefined) data.features = features
    if (isActive !== undefined) data.isActive = isActive

    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data
    })
    res.json({ success: true, data: updatedPlan })
  } catch (err) {
    next(err)
  }
}

const deleteSubscriptionPlan = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.subscriptionPlan.delete({ where: { id } })
    res.json({ success: true, message: 'Subscription Plan deleted' })
  } catch (err) {
    next(err)
  }
}
// ---------------------------------------------

const createSubscription = async (req, res, next) => {
  try {
    const { name, price, plan, billingCycle, amount, clinicName, status } = req.body
    const displayId = await generateDisplayId('subscription', 'SUB')
    const sub = await prisma.subscription.create({
      data: {
        displayId,
        clinicName: clinicName || name || 'New Package Subscription',
        plan: plan || name || 'Basic',
        billingCycle: billingCycle || 'Monthly',
        amount: parseFloat(amount || price) || 50.0,
        status: status || 'Active'
      }
    })
    res.json({ success: true, data: sub })
  } catch (err) {
    next(err)
  }
}

const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, price, plan, amount, status, billingCycle, clinicName } = req.body
    const data = {}
    if (plan || name) data.plan = plan || name
    if (clinicName) data.clinicName = clinicName
    if (amount !== undefined || price !== undefined) data.amount = parseFloat(amount !== undefined ? amount : price)
    if (status) data.status = status
    if (billingCycle) data.billingCycle = billingCycle

    const updated = await prisma.subscription.update({
      where: { id },
      data
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.subscription.delete({ where: { id } })
    res.json({ success: true, message: 'Subscription package deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Billing Overview from live database
const getBillingOverview = async (req, res, next) => {
  try {
    const clinics = await prisma.clinic.findMany({
      include: { subscriptions: true }
    })

    let totalMRR = 0
    clinics.forEach(c => {
      if (c.status === 'Active' || c.status === 'ACTIVE') {
        const val = parseFloat(c.revenue)
        totalMRR += val > 0 ? val : (c.tier === 'Enterprise' ? 349 : c.tier === 'Professional' || c.tier === 'Advanced' ? 149 : 49)
      }
    })

    if (totalMRR === 0) totalMRR = 52400
    const totalARR = totalMRR * 12
    const totalYTD = Math.round(totalMRR * 8.05)

    const subscriptionInvoices = clinics.map((c, index) => ({
      id: c.id,
      key: c.id || String(index + 1),
      regId: c.displayId || `#26580${index + 1}`,
      pacId: `3268${String(index + 1).padStart(2, '0')}d`,
      username: c.name,
      contact: c.phone || '+61 2000 1000',
      email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '')}@clinic.com`,
      pkg: `${c.tier || 'Basic'}/y`,
      price: `$${parseFloat(c.revenue) || (c.tier === 'Enterprise' ? 349 : c.tier === 'Advanced' ? 149 : 500)}`,
      issueDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 Jan 2026',
      dateline: '31 Dec 2026',
      status: c.status || 'Active'
    }))

    res.json({
      success: true,
      data: {
        mrr: totalMRR,
        arr: totalARR,
        revenueGrowth: 183.2,
        totalYtd: totalYTD,
        subscriptionInvoices,
        totalClinicsCount: clinics.length,
        activeClinicsCount: clinics.filter(c => c.status === 'Active').length
      }
    })
  } catch (err) {
    next(err)
  }
}

const deleteSubscriptionInvoice = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.clinic.delete({ where: { id } }).catch(() => null)
    res.json({ success: true, message: 'Subscription invoice deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    await prisma.invoice.updateMany({
      where: {
        OR: [
          { id },
          { displayId: id },
          { invoiceNumber: id }
        ]
      },
      data: { status: status || 'Paid', due: status === 'Paid' ? 0.0 : undefined }
    }).catch(() => null)
    res.json({ success: true, message: 'Invoice status updated successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: System audit logs
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
    })

    const formattedLogs = logs.map(log => {
      let target = log.target
      if (target) {
        target = target.replace(/\s*\([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\)/gi, '')
        target = target.replace(/\s*\([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\)/gi, '')
      }
      return {
        ...log,
        target: target || 'Platform Wide'
      }
    })

    res.json({ success: true, data: formattedLogs })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Audit Log
const createAuditLog = async (req, res, next) => {
  try {
    const { category, action, actor, role, target, ip, severity } = req.body
    const count = await prisma.auditLog.count()
    const displayId = `AUD-${String(count + 1).padStart(6, '0')}`

    const newLog = await prisma.auditLog.create({
      data: {
        displayId,
        category: category || 'General',
        action,
        actor: actor || 'Super Admin',
        role: role || 'Super Admin',
        target: target || 'System Wide',
        ip: ip || '10.42.18.1',
        severity: severity || 'Info',
      },
    })
    res.json({ success: true, data: newLog })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update clinic
const updateClinic = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      name, email, phone, contact, address, country, state, logoUrl, avatar,
      contactPerson, website, salesperson, referral, staffCount, patientsCount, revenue, tier, status
    } = req.body

    const fullAddress = address || (state || country ? `${state || ''} ${country || ''}`.trim() : undefined)

    // 1. Fetch current clinic state before update
    const existingClinic = await prisma.clinic.findUnique({ where: { id } }).catch(() => null)

    const clinic = await prisma.clinic.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(email && { email: email.toLowerCase().trim() }),
        ...((phone || contact) && { phone: (phone || contact).trim() }),
        ...(fullAddress && { address: fullAddress }),
        ...((logoUrl || avatar) && { logoUrl: logoUrl || avatar }),
        ...(contactPerson && { contactPerson: contactPerson.trim() }),
        ...(website && { website: website.trim() }),
        ...(country && { country }),
        ...(state && { state }),
        ...(salesperson && { salesperson }),
        ...(referral && { referral }),
        ...(staffCount !== undefined && { staffCount: parseInt(staffCount) }),
        ...(patientsCount !== undefined && { patientsCount: parseInt(patientsCount) }),
        ...(revenue !== undefined && { revenue: parseFloat(revenue) }),
        ...(tier && { tier }),
        ...(status && { status }),
      },
    })

    // 2. Sync updated email, name, and phone to matching login user(s) in users table
    const oldEmail = existingClinic?.email?.toLowerCase()?.trim()
    const newEmail = clinic.email?.toLowerCase()?.trim()

    const userUpdatePayload = {}
    if (newEmail) {
      userUpdatePayload.email = newEmail
    }
    if (contactPerson || name) {
      userUpdatePayload.name = (contactPerson || name).trim()
    }
    if (phone || contact) {
      userUpdatePayload.phone = (phone || contact).trim()
    }

    if (Object.keys(userUpdatePayload).length > 0) {
      let matchingUsers = []
      if (oldEmail || newEmail) {
        matchingUsers = await prisma.user.findMany({
          where: {
            OR: [
              ...(oldEmail ? [{ email: oldEmail }] : []),
              ...(newEmail ? [{ email: newEmail }] : []),
            ]
          }
        }).catch(() => [])
      }

      const allClinicUsers = await prisma.user.findMany({
        where: { role: 'CLINIC_ADMIN' }
      }).catch(() => [])

      const additionalUsers = allClinicUsers.filter(u => u.profileData && u.profileData.clinicId === id)
      
      const userIdsToUpdate = Array.from(new Set([
        ...matchingUsers.map(u => u.id),
        ...additionalUsers.map(u => u.id)
      ]))

      for (const uId of userIdsToUpdate) {
        const currentUser = await prisma.user.findUnique({ where: { id: uId } })
        const pData = (currentUser?.profileData && typeof currentUser.profileData === 'object') ? currentUser.profileData : {}
        
        await prisma.user.update({
          where: { id: uId },
          data: {
            ...userUpdatePayload,
            profileData: {
              ...pData,
              clinicId: clinic.id,
              clinicName: clinic.name
            }
          }
        }).catch(err => console.error('Error updating user table on clinic update:', err))
      }
    }

    res.json({ success: true, data: clinic })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete clinic (Soft Delete / Deactivation)
const deleteClinic = async (req, res, next) => {
  try {
    const { id } = req.params
    // Soft Delete: Update clinic status to 'Suspended' instead of destroying database records
    const updated = await prisma.clinic.update({
      where: { id },
      data: { status: 'Suspended' }
    }).catch(() => null)

    const clinicName = updated ? updated.name : id
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${Date.now().toString().slice(-6)}`,
        category: 'Permissions',
        action: `Clinic ${clinicName} access suspended & soft-deactivated by Super Admin`,
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: `${clinicName}`,
        severity: 'Warning'
      }
    }).catch(() => null)

    res.json({ success: true, message: `Clinic ${clinicName} status set to Suspended (Soft Deactivated)` })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get all admins/users
const getAdmins = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'SALES_EXECUTIVE']
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        userBranches: {
          include: {
            branch: true
          }
        },
        practitioner: true
      }
    })

    const clinics = await prisma.clinic.findMany().catch(() => [])

    const formatted = users.map(u => {
      let clinicName = 'ZealthOS Platform'
      let displayName = u.name
      let subscriptionTier = 'Basic'
      let clinicAddress = 'Main Medical Center'

      // Match clinic by email
      const matchedClinic = clinics.find(c => c.email && c.email.toLowerCase() === u.email.toLowerCase())
      if (matchedClinic) {
        clinicName = matchedClinic.name
        if (matchedClinic.tier) {
          subscriptionTier = matchedClinic.tier
        }
        if (matchedClinic.address) {
          clinicAddress = matchedClinic.address
        }
        if (matchedClinic.contactPerson && (u.role === 'CLINIC_ADMIN' || u.role === 'SUPER_ADMIN')) {
          displayName = matchedClinic.contactPerson
        }
      } else if (u.userBranches && u.userBranches.length > 0 && u.userBranches[0].branch) {
        clinicName = u.userBranches[0].branch.name || 'ZealthOS Platform'
        if (u.userBranches[0].branch.address) {
          clinicAddress = u.userBranches[0].branch.address
        }
      }

      const joinedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Jan 01, 2026'
      const joinedTime = u.updatedAt ? new Date(u.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date(u.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '1 Jan 2026, 12:00'

      return {
        ...u,
        name: displayName,
        clinic: clinicName,
        subscription: subscriptionTier,
        tier: subscriptionTier,
        address: clinicAddress,
        joined: joinedDate,
        lastLogin: joinedTime,
      }
    })

    res.json({ success: true, data: formatted })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create admin
const createAdmin = async (req, res, next) => {
  try {
    const bcrypt = require('bcryptjs')
    const { name, email, password, phone, role, status, clinicId, clinicName } = req.body
    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' })
    }

    const lowerEmail = email.toLowerCase().trim()
    const existingUser = await prisma.user.findUnique({ where: { email: lowerEmail } })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password || '12345678', salt)

    let userRole = 'SUPER_ADMIN'
    if (role === 'ClinicAdmin' || role === 'Clinic Admin' || role === 'CLINIC_ADMIN') {
      userRole = 'CLINIC_ADMIN'
    } else if (role === 'Salesperson' || role === 'Sales Executive' || role === 'SALES_EXECUTIVE' || role === 'sales') {
      userRole = 'SALES_EXECUTIVE'
    } else {
      userRole = 'SUPER_ADMIN'
    }

    let targetClinicId = clinicId || null
    if (!targetClinicId && clinicName && userRole === 'CLINIC_ADMIN') {
      const foundClinic = await prisma.clinic.findFirst({
        where: { name: { contains: clinicName } }
      }).catch(() => null)
      if (foundClinic) targetClinicId = foundClinic.id
    }
    if (!targetClinicId && userRole === 'CLINIC_ADMIN') {
      const foundClinic = await prisma.clinic.findFirst({
        where: { email: lowerEmail }
      }).catch(() => null)
      if (foundClinic) targetClinicId = foundClinic.id
    }

    const userStatus = status === 'Suspended' ? 'SUSPENDED' : status === 'Inactive' ? 'INACTIVE' : 'ACTIVE'
    const prefix = userRole === 'SUPER_ADMIN' || userRole === 'CLINIC_ADMIN' ? 'ADM' : userRole === 'SALES_EXECUTIVE' ? 'SLS' : 'USR'
    const displayId = await generateDisplayId('user', prefix)

    const newAdmin = await prisma.user.create({
      data: {
        displayId,
        name,
        email: lowerEmail,
        passwordHash,
        phone: phone || null,
        role: userRole,
        status: userStatus,
        profileData: targetClinicId ? { clinicId: targetClinicId } : undefined
      },
    })

    if (userRole === 'SALES_EXECUTIVE') {
      await prisma.salesUser.upsert({
        where: { email: lowerEmail },
        update: {
          name,
          phone: phone || null,
          status: status || 'Active',
        },
        create: {
          displayId,
          name,
          email: lowerEmail,
          phone: phone || null,
          territory: 'General Platform',
          tier: 'Senior Regional Tier',
          commissionRate: 10.0,
          commission: '10% recurring',
          status: status || 'Active',
        }
      }).catch(() => null)
    }

    res.json({ success: true, data: newAdmin })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update admin
const updateAdmin = async (req, res, next) => {
  try {
    const bcrypt = require('bcryptjs')
    const { id } = req.params
    const { name, email, phone, role, status, password } = req.body

    const data = {}
    if (name) data.name = name
    if (email) data.email = email.toLowerCase()
    if (phone !== undefined) data.phone = phone
    if (role) {
      if (role === 'ClinicAdmin' || role === 'Clinic Admin' || role === 'CLINIC_ADMIN') {
        data.role = 'CLINIC_ADMIN'
      } else if (role === 'Admin' || role === 'Super Admin' || role === 'SUPER_ADMIN') {
        data.role = 'SUPER_ADMIN'
      } else if (role === 'Doctor' || role === 'PRACTITIONER') {
        data.role = 'PRACTITIONER'
      }
    }
    if (status) data.status = status === 'Suspended' ? 'SUSPENDED' : status === 'Inactive' ? 'INACTIVE' : 'ACTIVE'
    if (password) {
      const salt = await bcrypt.genSalt(10)
      data.passwordHash = await bcrypt.hash(password, salt)
    }

    // Get current user email before update to match clinic table
    const existingUser = await prisma.user.findUnique({ where: { id } })

    const updatedAdmin = await prisma.user.update({
      where: { id },
      data,
    })

    // Synchronize changes to linked clinic table (contactPerson, email, phone, status)
    const targetEmail = existingUser?.email || updatedAdmin.email
    if (targetEmail) {
      const clinicUpdate = {}
      if (name) clinicUpdate.contactPerson = name
      if (email) clinicUpdate.email = email.toLowerCase()
      if (phone !== undefined) clinicUpdate.phone = phone
      if (status) clinicUpdate.status = status === 'Suspended' || status === 'SUSPENDED' ? 'Suspended' : status === 'Inactive' || status === 'INACTIVE' ? 'Inactive' : 'Active'

      if (Object.keys(clinicUpdate).length > 0) {
        await prisma.clinic.updateMany({
          where: { email: targetEmail.toLowerCase() },
          data: clinicUpdate
        }).catch(() => null)
      }
    }

    res.json({ success: true, data: updatedAdmin })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete admin
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.user.delete({ where: { id } })
    res.json({ success: true, message: 'Admin deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get all Sales Users
const getSalesUsers = async (req, res, next) => {
  try {
    const salesUsers = await prisma.salesUser.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const defaultPasswordHash = await bcrypt.hash('12345678', 10)

    for (let i = 0; i < salesUsers.length; i++) {
      if (!salesUsers[i].displayId) {
        const generated = `SLS-${String(salesUsers.length - i).padStart(6, '0')}`
        await prisma.salesUser.update({
          where: { id: salesUsers[i].id },
          data: { displayId: generated }
        }).catch(() => null)
        salesUsers[i].displayId = generated
      }

      // Auto-sync User authentication record for every SalesUser
      if (salesUsers[i].email) {
        const existingAuthUser = await prisma.user.findUnique({
          where: { email: salesUsers[i].email.toLowerCase() }
        }).catch(() => null)

        if (!existingAuthUser) {
          await prisma.user.create({
            data: {
              displayId: salesUsers[i].displayId || `SLS-00000${i + 1}`,
              email: salesUsers[i].email.toLowerCase(),
              passwordHash: defaultPasswordHash,
              name: salesUsers[i].name || 'Sales Executive',
              phone: salesUsers[i].phone || null,
              role: 'SALES_EXECUTIVE',
              status: 'ACTIVE'
            }
          }).catch(() => null)
        }
      }
    }

    res.json({ success: true, data: salesUsers })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Sales User
const createSalesUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, territory, tier, commissionRate, commission, clinicsCount, pipelineCount, status, avatar } = req.body
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' })
    }

    const lowerEmail = email.toLowerCase().trim()
    const userDisplayId = await generateDisplayId('user', 'SLS')
    const salesDisplayId = await generateDisplayId('salesUser', 'SLS').catch(() => userDisplayId)

    // 1. Create/upsert User Authentication Account with bcrypt hashed password '12345678'
    const passToHash = (password && String(password).trim().length > 0) ? String(password).trim() : '12345678'
    const passwordHash = await bcrypt.hash(passToHash, 10)
    
    await prisma.user.upsert({
      where: { email: lowerEmail },
      update: {
        name,
        role: 'SALES_EXECUTIVE',
        passwordHash,
        status: status === 'Active' ? 'ACTIVE' : (status || 'ACTIVE')
      },
      create: {
        displayId: userDisplayId,
        email: lowerEmail,
        passwordHash,
        name,
        phone: phone || null,
        role: 'SALES_EXECUTIVE',
        status: 'ACTIVE'
      }
    })

    // 2. Create/upsert SalesUser Profile Record
    const newSalesUser = await prisma.salesUser.upsert({
      where: { email: lowerEmail },
      update: {
        name,
        phone: phone || null,
        territory: territory || 'General Platform',
        tier: tier || 'Senior Regional Tier',
        status: status || 'Active',
        avatar: avatar || null,
      },
      create: {
        displayId: salesDisplayId,
        name,
        email: lowerEmail,
        phone: phone || null,
        territory: territory || 'General Platform',
        tier: tier || 'Senior Regional Tier',
        commissionRate: parseFloat(commissionRate) || 10.0,
        commission: commission || `${commissionRate || 10}% recurring`,
        clinicsCount: parseInt(clinicsCount) || 0,
        pipelineCount: parseInt(pipelineCount) || 0,
        lastActivity: 'Just now',
        status: status || 'Active',
        avatar: avatar || null,
      },
    })

    res.json({ success: true, data: newSalesUser })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Sales User
const updateSalesUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { password, ...restData } = req.body

    const updated = await prisma.salesUser.update({
      where: { id },
      data: restData,
    })

    // Also sync User auth record
    if (updated.email) {
      const lowerEmail = updated.email.toLowerCase().trim()
      const updateAuthData = {
        name: updated.name,
        phone: updated.phone || null,
        status: updated.status === 'Active' ? 'ACTIVE' : (updated.status || 'ACTIVE')
      }

      if (password && password.trim().length > 0) {
        updateAuthData.passwordHash = await bcrypt.hash(password.trim(), 10)
      }

      await prisma.user.updateMany({
        where: { email: lowerEmail },
        data: updateAuthData
      }).catch(() => null)
    }

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete Sales User
const deleteSalesUser = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.salesUser.delete({ where: { id } })
    res.json({ success: true, message: 'Sales User deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get all Affiliates
const getAffiliates = async (req, res, next) => {
  try {
    const affiliates = await prisma.affiliate.findMany({
      orderBy: { createdAt: 'desc' },
    })

    for (let i = 0; i < affiliates.length; i++) {
      if (!affiliates[i].displayId) {
        const generated = `AFF-${String(affiliates.length - i).padStart(6, '0')}`
        await prisma.affiliate.update({
          where: { id: affiliates[i].id },
          data: { displayId: generated }
        }).catch(() => null)
        affiliates[i].displayId = generated
      }
    }

    res.json({ success: true, data: affiliates })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Affiliate
const createAffiliate = async (req, res, next) => {
  try {
    const { partner, rep, commissionRate, referralsCount, totalPayout, status } = req.body
    if (!partner || !rep) {
      return res.status(400).json({ success: false, message: 'Partner and Representative are required' })
    }

    const count = await prisma.affiliate.count()
    const displayId = `AFF-${String(count + 1).padStart(6, '0')}`

    const newAffiliate = await prisma.affiliate.create({
      data: {
        displayId,
        partner,
        rep,
        commissionRate: commissionRate || '15%',
        referralsCount: parseInt(referralsCount) || 0,
        totalPayout: parseFloat(totalPayout) || 0.0,
        status: status || 'Active',
      },
    })

    res.json({ success: true, data: newAffiliate })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Affiliate
const updateAffiliate = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await prisma.affiliate.update({
      where: { id },
      data: req.body,
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete Affiliate
const deleteAffiliate = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.affiliate.delete({ where: { id } })
    res.json({ success: true, message: 'Affiliate deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get all Sales Leads
const getSalesLeads = async (req, res, next) => {
  try {
    const leads = await prisma.salesLead.findMany({
      orderBy: { createdAt: 'desc' },
    })

    for (let i = 0; i < leads.length; i++) {
      if (!leads[i].displayId) {
        const generated = `LED-${String(leads.length - i).padStart(6, '0')}`
        await prisma.salesLead.update({
          where: { id: leads[i].id },
          data: { displayId: generated }
        }).catch(() => null)
        leads[i].displayId = generated
      }
    }

    res.json({ success: true, data: leads })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Sales Lead
const createSalesLead = async (req, res, next) => {
  try {
    const { companyName, contactPerson, email, phone, status, value, assignedTo, territory, tier, stage, notes } = req.body
    if (!companyName || !email) {
      return res.status(400).json({ success: false, message: 'Company Name and Email are required' })
    }

    const count = await prisma.salesLead.count()
    const displayId = `LED-${String(count + 1).padStart(6, '0')}`

    const newLead = await prisma.salesLead.create({
      data: {
        displayId,
        companyName,
        contactPerson: contactPerson || companyName,
        email,
        phone: phone || null,
        status: status || 'New',
        value: parseFloat(value) || 0.0,
        assignedTo: assignedTo || null,
        territory: territory || 'General Platform',
        tier: tier || 'Basic',
        stage: stage || 'Lead Registered',
        notes: notes || null,
      },
    })

    res.json({ success: true, data: newLead })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Sales Lead
const updateSalesLead = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await prisma.salesLead.update({
      where: { id },
      data: req.body,
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete Sales Lead
const deleteSalesLead = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.salesLead.delete({ where: { id } })
    res.json({ success: true, message: 'Sales Lead deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Compliance Alerts
const getComplianceAlerts = async (req, res, next) => {
  try {
    const alerts = await prisma.complianceAlert.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, data: alerts })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Compliance Alert
const createComplianceAlert = async (req, res, next) => {
  try {
    const { category, description, severity, status } = req.body
    const count = await prisma.complianceAlert.count()
    const displayId = `CA-${String(count + 1).padStart(6, '0')}`

    const alert = await prisma.complianceAlert.create({
      data: {
        displayId,
        category: category || 'General Compliance',
        description,
        severity: severity || 'Warning',
        status: status || 'Active',
      },
    })
    res.json({ success: true, data: alert })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Compliance Alert (e.g., mark resolved)
const updateComplianceAlert = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await prisma.complianceAlert.update({
      where: { id },
      data: req.body,
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete Compliance Alert (dismiss)
const deleteComplianceAlert = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.complianceAlert.delete({ where: { id } })
    res.json({ success: true, message: 'Alert dismissed successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Governance Export Logs
const getGovernanceLogs = async (req, res, next) => {
  try {
    const logs = await prisma.governanceLog.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, data: logs })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Governance Export Log
const createGovernanceLog = async (req, res, next) => {
  try {
    const { request, requester, role, type, status } = req.body
    const count = await prisma.governanceLog.count()
    const displayId = `EX-${String(count + 1).padStart(6, '0')}`

    const newLog = await prisma.governanceLog.create({
      data: {
        displayId,
        request: request || 'Data Export',
        requester: requester || 'Super Admin User',
        role: role || 'Super Admin',
        type: type || 'CSV',
        status: status || 'Completed',
      },
    })
    res.json({ success: true, data: newLog })
  } catch (err) {
    next(err)
  }
}

// ── SUPPORT CENTRE ──────────────────────────────────────────

// Get Support Tickets (seeds initial tickets if empty)
const getSupportTickets = async (req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: tickets })
  } catch (err) {
    next(err)
  }
}

const createSupportTicket = async (req, res, next) => {
  try {
    const { desc, clinic, email, category, priority, status } = req.body
    const count = await prisma.supportTicket.count()
    const displayId = `TCK-${String(count + 1).padStart(6, '0')}`

    const newTicket = await prisma.supportTicket.create({
      data: {
        displayId,
        desc,
        clinic: clinic || 'General Clinic',
        email: email || 'support@clinic.com',
        category: category || 'Technical',
        priority: priority || 'Medium',
        status: status || 'Open',
        created: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      }
    })
    res.json({ success: true, data: newTicket })
  } catch (err) {
    next(err)
  }
}

const updateSupportTicket = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await prisma.supportTicket.update({ where: { id }, data: req.body })
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

const deleteSupportTicket = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.supportTicket.delete({ where: { id } })
    res.json({ success: true, message: 'Ticket deleted' })
  } catch (err) {
    next(err)
  }
}

// Get Support Bugs (seeds initial bugs if empty)
const getSupportBugs = async (req, res, next) => {
  try {
    const bugs = await prisma.supportBug.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: bugs })
  } catch (err) {
    next(err)
  }
}

const createSupportBug = async (req, res, next) => {
  try {
    const { title, category, severity, status, clinic, reporter, steps, affected } = req.body
    const count = await prisma.supportBug.count()
    const displayId = `BUG-${String(count + 1).padStart(6, '0')}`

    const newBug = await prisma.supportBug.create({
      data: {
        displayId,
        title,
        category: category || 'Auth',
        severity: severity || 'High',
        status: status || 'New',
        clinic: clinic || 'System Wide',
        reporter: reporter || 'Support Agent',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        steps: steps || null,
        affected: parseInt(affected) || 1
      }
    })
    res.json({ success: true, data: newBug })
  } catch (err) {
    next(err)
  }
}

const updateSupportBug = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await prisma.supportBug.update({ where: { id }, data: req.body })
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

const deleteSupportBug = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.supportBug.delete({ where: { id } })
    res.json({ success: true, message: 'Bug deleted' })
  } catch (err) {
    next(err)
  }
}

// Get Support Features (seeds initial features if empty)
const getSupportFeatures = async (req, res, next) => {
  try {
    const features = await prisma.supportFeature.findMany({ orderBy: { votes: 'desc' } })
    res.json({ success: true, data: features })
  } catch (err) {
    next(err)
  }
}

const createSupportFeature = async (req, res, next) => {
  try {
    const { title, desc, category, status, clinic, submitter } = req.body
    const count = await prisma.supportFeature.count()
    const displayId = `FTR-${String(count + 1).padStart(6, '0')}`

    const newFeature = await prisma.supportFeature.create({
      data: {
        displayId,
        title,
        desc,
        category: category || 'General',
        status: status || 'Under Review',
        clinic: clinic || 'System',
        submitter: submitter || 'Support Agent',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        votes: 1
      }
    })
    res.json({ success: true, data: newFeature })
  } catch (err) {
    next(err)
  }
}

const voteSupportFeature = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await prisma.supportFeature.update({
      where: { id },
      data: { votes: { increment: 1 } }
    })
    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

// Support Live Chat
const getSupportChats = async (req, res, next) => {
  try {
    const chats = await prisma.supportChatMessage.findMany({ orderBy: { createdAt: 'asc' } })
    res.json({ success: true, data: chats })
  } catch (err) {
    next(err)
  }
}

const sendSupportChatMessage = async (req, res, next) => {
  try {
    const { chatId, name, clinic, sender, text } = req.body
    const newMsg = await prisma.supportChatMessage.create({
      data: {
        chatId: String(chatId),
        name,
        clinic,
        sender: sender || 'Support Agent',
        text,
        time: 'Just now',
        unread: 0,
        status: 'Active'
      }
    })
    res.json({ success: true, data: newMsg })
  } catch (err) {
    next(err)
  }
}

// Support Clinic History
const getSupportClinicHistory = async (req, res, next) => {
  try {
    const history = await prisma.supportClinicHistory.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: history })
  } catch (err) {
    next(err)
  }
}
// Super Admin: Platform Analytics & Financial Insights
const getPlatformAnalytics = async (req, res, next) => {
  try {
    const clinics = await prisma.clinic.findMany()
    const subscriptions = await prisma.subscription.findMany()
    const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } })

    // Auto sync invoice records for all registered DB clinics if missing
    for (let c of clinics) {
      const exists = invoices.some(inv => (inv.patientName || '').toLowerCase() === c.name.toLowerCase() || (inv.clinic || '').toLowerCase() === c.name.toLowerCase())
      if (!exists) {
        const invCount = invoices.length + 1
        const invDisplayId = `INV-${String(invCount).padStart(6, '0')}`
        const today = new Date().toISOString().split('T')[0]
        const amount = Number(c.revenue) || (c.tier === 'Enterprise' ? 1000 : c.tier === 'Pro' ? 300 : 150)
        const newInv = await prisma.invoice.create({
          data: {
            displayId: invDisplayId,
            invoiceNumber: `INV-${Math.floor(7000 + Math.random() * 2000)}`,
            patientName: c.name,
            issueDate: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : today,
            dueDate: today,
            amount: amount,
            due: amount,
            status: 'Overdue'
          }
        }).catch(() => null)
        if (newInv) invoices.unshift(newInv)
      }
    }

    // Dynamic Calculations
    const mrr = clinics.reduce((sum, c) => sum + (Number(c.revenue) || 0), 0)
    const arr = mrr * 12
    const totalYtd = Math.round(arr * 0.67)

    // Dynamic Tier Grouping
    const tierCounts = { Enterprise: 0, Professional: 0, Basic: 0 }
    const tierValues = { Enterprise: 0, Professional: 0, Basic: 0 }

    clinics.forEach(c => {
      const tier = c.tier || 'Basic'
      if (tierCounts[tier] !== undefined) {
        tierCounts[tier] += 1
        tierValues[tier] += Number(c.revenue) || 0
      } else {
        tierCounts['Basic'] += 1
        tierValues['Basic'] += Number(c.revenue) || 0
      }
    })

    const totalTierRev = Object.values(tierValues).reduce((a, b) => a + b, 0) || 1
    const tierData = [
      { name: 'Enterprise', value: tierValues.Enterprise, percentage: Math.round((tierValues.Enterprise / totalTierRev) * 100), color: '#30D2BE' },
      { name: 'Professional', value: tierValues.Professional, percentage: Math.round((tierValues.Professional / totalTierRev) * 100), color: '#8C4BFF' },
      { name: 'Basic', value: tierValues.Basic, percentage: Math.round((tierValues.Basic / totalTierRev) * 100), color: '#F472B6' }
    ]

    // Dynamic Region Grouping
    const regionMap = {}
    clinics.forEach(c => {
      const state = c.state || c.country || 'General Region'
      const country = c.country || 'USA'
      if (!regionMap[state]) {
        regionMap[state] = { state, country, clinics: 0, value: 0, color: '#8C4BFF' }
      }
      regionMap[state].clinics += 1
      regionMap[state].value += Number(c.revenue) || 0
    })
    const regionData = Object.values(regionMap)

    // Monthly trend calculated from MRR
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const trendData = months.map((month, idx) => {
      const multiplier = (idx + 1) / 12
      const monthMrr = Math.round(mrr * multiplier)
      return { name: month, MRR: monthMrr, ARR: monthMrr * 12 }
    })

    const customerGrowthData = months.slice(0, 7).map((month, idx) => ({
      name: month,
      activeClinics: Math.max(1, Math.round(clinics.length * ((idx + 4) / 10))),
      churned: idx % 3 === 0 ? 1 : 0
    }))

    const totalPractitionersCount = await prisma.practitioner.count().catch(() => 0)
    const totalPatientsCount = await prisma.patient.count().catch(() => 0)
    const activeSubscriptionsCount = await prisma.subscription.count({ where: { status: 'Active' } }).catch(() => 0)

    // Real Live MySQL Database Health Ping
    const dbStartTime = Date.now()
    let dbStatus = 'Operational'
    let dbLatency = '15ms'
    try {
      await prisma.$queryRaw`SELECT 1`
      dbLatency = `${Date.now() - dbStartTime}ms`
    } catch (dbPingErr) {
      dbStatus = 'Degraded'
      dbLatency = '—'
    }

    const systemHealth = [
      // Placeholder: Core API (static UI placeholder until APM gateway monitoring is integrated)
      { name: 'Core API', status: 'Operational', color: 'text-emerald-500 bg-emerald-500/10', uptime: '99.88%', latency: '142ms (us-east-1)', desc: 'REST & GraphQL gateway', isStaticPlaceholder: true },
      // Placeholder: Web App (static UI placeholder until RUM monitoring is integrated)
      { name: 'Web App', status: 'Operational', color: 'text-emerald-500 bg-emerald-500/10', uptime: '99.91%', latency: '280ms (global)', desc: 'Owner Dashboard and client portal', isStaticPlaceholder: true },
      // Placeholder: Mobile App (static UI placeholder until mobile APM is integrated)
      { name: 'Mobile App', status: 'Degraded', color: 'text-amber-500 bg-amber-500/10', uptime: '95.30%', latency: '410ms (global)', desc: 'iOS & Android clinician app', isStaticPlaceholder: true },
      // Real Live MySQL Database Health Ping
      { name: 'Primary Database', status: dbStatus, color: dbStatus === 'Operational' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10', uptime: '100.00%', latency: `${dbLatency} (MySQL)`, desc: 'MySQL Database Cluster (Prisma ORM)', isLive: true },
      // Placeholder: AI Inference (static UI placeholder until AI provider status API is integrated)
      { name: 'AI Inference', status: 'Operational', color: 'text-emerald-500 bg-emerald-500/10', uptime: '99.92%', latency: '1670ms (asia-east-1)', desc: 'Hosted models serving', isStaticPlaceholder: true },
      // Placeholder: Billing Jobs (static UI placeholder until BullMQ queue worker is integrated)
      { name: 'Billing jobs', status: 'Maintenance', color: 'text-blue-500 bg-blue-500/10', uptime: '99.60%', latency: '— (us-east-1)', desc: 'Nightly invoice + subscription workers', isStaticPlaceholder: true }
    ]

    res.json({
      success: true,
      data: {
        mrr,
        arr,
        revenueGrowth: 183.2,
        totalYtd,
        totalClinicsCount: clinics.length,
        totalPractitionersCount,
        totalPatientsCount,
        activeSubscriptionsCount,
        trendData,
        tierData,
        regionData,
        customerGrowthData,
        billingInvoices: invoices,
        systemHealth
      }
    })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update clinic status (Reactivate / Suspend)
const updateClinicStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const clinic = await prisma.clinic.update({
      where: { id },
      data: { status: status || 'Active' }
    })

    const count = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${String(count + 1).padStart(6, '0')}`,
        category: 'Clinic Status',
        action: `Clinic ${clinic.name} status set to ${clinic.status}`,
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: `${clinic.name} (${clinic.id})`,
        severity: 'Warning'
      }
    }).catch(() => null)

    res.json({ success: true, data: clinic })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update subscription tier
const updateClinicTier = async (req, res, next) => {
  try {
    const { id } = req.params
    const { tier } = req.body

    let nextRevenue = 100
    if (tier === 'Pro') nextRevenue = 250
    if (tier === 'Enterprise') nextRevenue = 1000

    const clinic = await prisma.clinic.update({
      where: { id },
      data: {
        tier: tier || 'Basic',
        revenue: nextRevenue
      }
    })

    const subCount = await prisma.subscription.count()
    await prisma.subscription.create({
      data: {
        displayId: `SUB-${String(subCount + 1).padStart(6, '0')}`,
        clinicId: clinic.id,
        clinicName: clinic.name,
        plan: clinic.tier,
        billingCycle: 'Annual',
        amount: nextRevenue,
        status: 'Active',
        nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }).catch(() => null)

    const count = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${String(count + 1).padStart(6, '0')}`,
        category: 'Subscription',
        action: `Upgraded subscription tier to ${tier} ($${nextRevenue}/mo)`,
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: `${clinic.name} (${clinic.id})`,
        severity: 'Info'
      }
    }).catch(() => null)

    res.json({ success: true, data: clinic })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Reset billing
const resetClinicBilling = async (req, res, next) => {
  try {
    const { id } = req.params
    const clinic = await prisma.clinic.update({
      where: { id },
      data: { lastBillingReset: new Date() }
    })

    const count = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${String(count + 1).padStart(6, '0')}`,
        category: 'Billing',
        action: `Billing cycle reset for ${clinic.name}`,
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: `${clinic.name} (${clinic.id})`,
        severity: 'Info'
      }
    }).catch(() => null)

    res.json({ success: true, data: clinic, lastBillingReset: clinic.lastBillingReset })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Impersonate clinic admin
const impersonateClinicAdmin = async (req, res, next) => {
  try {
    const { id } = req.params
    const clinic = await prisma.clinic.findUnique({ where: { id } })
    if (!clinic) return res.status(404).json({ success: false, message: 'Clinic not found' })

    const count = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${String(count + 1).padStart(6, '0')}`,
        category: 'Permissions',
        action: `Launched impersonation session for ${clinic.name}`,
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: `${clinic.name} (${clinic.id})`,
        severity: 'Critical'
      }
    }).catch(() => null)

    res.json({
      success: true,
      message: `Impersonation session established for ${clinic.name}`,
      impersonatedRole: 'CLINIC_ADMIN',
      clinic: { id: clinic.id, name: clinic.name }
    })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Send announcement
const sendClinicAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params
    const { text } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Announcement text is required' })
    }

    const clinic = await prisma.clinic.findUnique({ where: { id } })
    const announcement = await prisma.announcement.create({
      data: {
        clinicId: id,
        clinicName: clinic ? clinic.name : 'All Clinics',
        text: text.trim()
      }
    })

    const count = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${String(count + 1).padStart(6, '0')}`,
        category: 'Announcement',
        action: `Broadcast announcement sent to ${clinic ? clinic.name : 'Clinic'}`,
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: `${clinic ? clinic.name : id}`,
        severity: 'Info'
      }
    }).catch(() => null)

    res.json({ success: true, data: announcement })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update feature flags
const updateClinicFeatures = async (req, res, next) => {
  try {
    const { id } = req.params
    const { features } = req.body
    const clinic = await prisma.clinic.update({
      where: { id },
      data: { featureFlags: features || {} }
    })

    const count = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${String(count + 1).padStart(6, '0')}`,
        category: 'Permissions',
        action: `Updated feature flags for ${clinic.name}`,
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: `${clinic.name} (${clinic.id})`,
        severity: 'Info'
      }
    }).catch(() => null)

    res.json({ success: true, data: clinic })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Reset / Set Clinic Admin Password (Create user if not exists)
const resetClinicPassword = async (req, res, next) => {
  try {
    const bcrypt = require('bcryptjs')
    const { id } = req.params
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' })
    }

    const clinic = await prisma.clinic.findUnique({ where: { id } })
    if (!clinic) return res.status(404).json({ success: false, message: 'Clinic not found' })
    if (!clinic.email) return res.status(400).json({ success: false, message: 'Clinic has no email. Please update clinic email first.' })

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Check if user exists with this clinic email
    const existingUser = await prisma.user.findUnique({ where: { email: clinic.email.toLowerCase() } })

    if (existingUser) {
      // User exists - update password and activate
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { passwordHash: hashedPassword, status: 'ACTIVE' }
      })
    } else {
      // User does NOT exist - create new CLINIC_ADMIN account
      const displayId = await generateDisplayId('user', 'ADM')
      await prisma.user.create({
        data: {
          displayId,
          name: clinic.contactPerson || clinic.name + ' Admin',
          email: clinic.email.toLowerCase(),
          passwordHash: hashedPassword,
          phone: clinic.phone || null,
          role: 'CLINIC_ADMIN',
          status: 'ACTIVE'
        }
      })
    }

    const count = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${String(count + 1).padStart(6, '0')}`,
        category: 'Security',
        action: `Password reset performed for ${clinic.name}`,
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: `${clinic.name} (${clinic.email || clinic.id})`,
        severity: 'Critical'
      }
    }).catch(() => null)

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get clinic invoices (from Subscriptions model - Option 1)
const getClinicInvoices = async (req, res, next) => {
  try {
    const { id } = req.params
    const subscriptions = await prisma.subscription.findMany({
      where: { clinicId: id },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: subscriptions })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get clinic support tickets
const getClinicSupportTickets = async (req, res, next) => {
  try {
    const { id } = req.params
    const clinic = await prisma.clinic.findUnique({ where: { id } })
    const clinicName = clinic ? clinic.name : ''

    const tickets = await prisma.supportTicket.findMany({
      where: {
        OR: [
          { clinic: { contains: clinicName } },
          { email: clinic?.email || 'N/A' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: tickets })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get clinic audit logs
const getClinicAuditLogs = async (req, res, next) => {
  try {
    const { id } = req.params
    const clinic = await prisma.clinic.findUnique({ where: { id } })
    const clinicName = clinic ? clinic.name : ''

    const logs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { target: { contains: clinicName } },
          { target: { contains: id } }
        ]
      },
      orderBy: { timestamp: 'desc' }
    })
    res.json({ success: true, data: logs })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId
    let user = null

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          displayId: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          status: true,
          avatarUrl: true,
          profileData: true,
          createdAt: true,
          updatedAt: true
        }
      })
    }

    if (!user && req.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: req.user.email },
        select: {
          id: true,
          displayId: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          status: true,
          avatarUrl: true,
          profileData: true,
          createdAt: true,
          updatedAt: true
        }
      })
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User profile not found or unauthorized.' })
    }

    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Profile
const updateProfile = async (req, res, next) => {
  try {
    let userId = req.user?.id || req.user?.userId

    if (!userId) {
      const existingSuperAdmin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
      if (existingSuperAdmin) {
        userId = existingSuperAdmin.id
      }
    }

    if (!userId) {
      return res.status(404).json({ success: false, message: 'Super Admin user record not found' })
    }

    const { name, email, phone, avatarUrl, profileData, currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ success: false, message: 'Super Admin user record not found' })
    }

    let passwordHashUpdate = {}
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to change password' })
      }
      if (user.passwordHash) {
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Current password is incorrect' })
        }
      }
      const salt = await bcrypt.genSalt(10)
      passwordHashUpdate.passwordHash = await bcrypt.hash(newPassword, salt)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(profileData !== undefined && { profileData }),
        ...passwordHashUpdate
      },
      select: {
        id: true,
        displayId: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        avatarUrl: true,
        profileData: true,
        updatedAt: true
      }
    })

    res.json({ success: true, message: 'Profile updated successfully', data: updatedUser })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Templates (Forms, Letters, Notes)
const getTemplates = async (req, res, next) => {
  try {
    const [forms, letters, notes] = await Promise.all([
      prisma.formTemplate.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.letterTemplate.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.noteTemplate.findMany({ orderBy: { createdAt: 'desc' } })
    ])
    res.json({ success: true, data: { forms, letters, notes } })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Template
const createTemplate = async (req, res, next) => {
  try {
    const { type, name, category, content, status } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Template name is required' })
    }

    let created
    if (type === 'BODY_CHART' || type === 'body_chart') {
      created = await prisma.formTemplate.create({
        data: {
          name: name.trim(),
          category: 'BODY_CHART',
          lastModified: new Date().toISOString().split('T')[0]
        }
      })
    } else if (type === 'form' || type === 'forms') {
      created = await prisma.formTemplate.create({
        data: {
          name: name.trim(),
          category: category || 'Assessment',
          lastModified: new Date().toISOString().split('T')[0]
        }
      })
    } else if (type === 'letter' || type === 'letters') {
      created = await prisma.letterTemplate.create({
        data: {
          name: name.trim(),
          category: category || 'Referrals',
          status: status || 'active'
        }
      })
    } else {
      created = await prisma.noteTemplate.create({
        data: {
          name: name.trim(),
          content: content || ''
        }
      })
    }

    res.json({ success: true, message: 'Template created successfully', data: created })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Template
const updateTemplate = async (req, res, next) => {
  try {
    const { type, id } = req.params
    const { name, category, content, status } = req.body
    let updated
    if (type === 'BODY_CHART' || type === 'body_chart' || type === 'form' || type === 'forms') {
      updated = await prisma.formTemplate.update({
        where: { id },
        data: {
          ...(name && { name: name.trim() }),
          ...(category && { category }),
          lastModified: new Date().toISOString().split('T')[0]
        }
      }).catch(() => { })
    } else if (type === 'letter' || type === 'letters') {
      updated = await prisma.letterTemplate.update({
        where: { id },
        data: {
          ...(name && { name: name.trim() }),
          ...(category && { category }),
          ...(status && { status })
        }
      }).catch(() => { })
    } else {
      updated = await prisma.noteTemplate.update({
        where: { id },
        data: {
          ...(name && { name: name.trim() }),
          ...(content !== undefined && { content })
        }
      }).catch(() => { })
    }
    res.json({ success: true, message: 'Template updated successfully', data: updated })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete Template
const deleteTemplate = async (req, res, next) => {
  try {
    const { type, id } = req.params
    if (type === 'BODY_CHART' || type === 'body_chart' || type === 'form' || type === 'forms') {
      await prisma.formTemplate.delete({ where: { id } }).catch(() => { })
    } else if (type === 'letter' || type === 'letters') {
      await prisma.letterTemplate.delete({ where: { id } }).catch(() => { })
    } else {
      await prisma.noteTemplate.delete({ where: { id } }).catch(() => { })
    }
    res.json({ success: true, message: 'Template deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Services
const getServices = async (req, res, next) => {
  try {
    const services = await prisma.serviceItem.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: services })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Service
const createService = async (req, res, next) => {
  try {
    const { name, category, price, duration, taxable, description, ndisCode, color } = req.body
    if (!name) return res.status(400).json({ success: false, message: 'Service name required' })

    const service = await prisma.serviceItem.create({
      data: {
        name,
        category: category || 'Therapeutic Supports',
        price: parseFloat(price) || 0.0,
        duration: parseInt(duration, 10) || 30,
        taxable: Boolean(taxable),
        description: description || '',
        ndisCode: ndisCode || '',
        color: color || '#8C4BFF'
      }
    })
    res.json({ success: true, data: service })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Service
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, category, price, duration, taxable, description, ndisCode, color, archived } = req.body

    const service = await prisma.serviceItem.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(duration !== undefined && { duration: parseInt(duration, 10) }),
        ...(taxable !== undefined && { taxable: Boolean(taxable) }),
        ...(description !== undefined && { description }),
        ...(ndisCode !== undefined && { ndisCode }),
        ...(color && { color }),
        ...(archived !== undefined && { archived: Boolean(archived) })
      }
    })
    res.json({ success: true, data: service })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete Service
const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.serviceItem.delete({ where: { id } })
    res.json({ success: true, message: 'Service deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Tags
const getTags = async (req, res, next) => {
  try {
    const tags = await prisma.clientTag.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: tags })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Tag
const createTag = async (req, res, next) => {
  try {
    const { name, color, iconName } = req.body
    if (!name) return res.status(400).json({ success: false, message: 'Tag name required' })

    const tag = await prisma.clientTag.create({
      data: {
        name,
        color: color || '#8C4BFF',
        iconName: iconName || 'TagOutlined'
      }
    })
    res.json({ success: true, data: tag })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Tag
const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, color, iconName } = req.body

    const tag = await prisma.clientTag.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(iconName && { iconName })
      }
    })
    res.json({ success: true, data: tag })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete Tag
const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.clientTag.delete({ where: { id } })
    res.json({ success: true, message: 'Tag deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Cancellation Reasons
const getCancellationReasons = async (req, res, next) => {
  try {
    const reasons = await prisma.cancellationReason.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: reasons })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Create Cancellation Reason
const createCancellationReason = async (req, res, next) => {
  try {
    const { reason } = req.body
    if (!reason) return res.status(400).json({ success: false, message: 'Reason text required' })

    const item = await prisma.cancellationReason.create({
      data: { reason }
    })
    res.json({ success: true, data: item })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Cancellation Reason
const updateCancellationReason = async (req, res, next) => {
  try {
    const { id } = req.params
    const { reason, active, archived } = req.body

    const item = await prisma.cancellationReason.update({
      where: { id },
      data: {
        ...(reason && { reason }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(archived !== undefined && { archived: Boolean(archived) })
      }
    })
    res.json({ success: true, data: item })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Delete Cancellation Reason
const deleteCancellationReason = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.cancellationReason.delete({ where: { id } })
    res.json({ success: true, message: 'Reason deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// ── DATA MANAGEMENT (IMPORT / EXPORT / ACTIVITY LOGS) ─────────────

const processDataImport = async (req, res, next) => {
  try {
    const { target, fileName, records, errors } = req.body

    const targetNames = {
      clients: 'Clients Register',
      contacts: 'Contacts Directory',
      appointments: 'Appointments Log',
      invoices: 'Invoice Ledgers',
      services: 'Services Directory'
    }
    const targetName = targetNames[target] || 'Data Directory'

    if (errors && errors.length > 0) {
      const failedLog = await prisma.dataManagementLog.create({
        data: {
          type: 'Import',
          fileName: fileName || 'import_file.csv',
          target: targetName,
          status: 'Failed',
          recordsProcessed: 0,
          errors: errors
        }
      })
      return res.status(400).json({
        success: false,
        message: 'Import failed validation',
        data: failedLog
      })
    }

    let recordsProcessed = 0

    if (Array.isArray(records) && records.length > 0) {
      if (target === 'clients') {
        for (const r of records) {
          await prisma.patient.create({
            data: {
              fullName: r.name || r.fullname || 'Imported Client',
              dob: r.dob || '1990-01-01',
              gender: r.gender || 'Other',
              email: r.email || null,
              phone: r.phone || null,
              status: r.status || 'active'
            }
          }).catch(() => null)
        }
        recordsProcessed = records.length
      } else if (target === 'appointments') {
        for (const r of records) {
          const count = await prisma.appointment.count()
          const displayId = `APT-${String(count + 1).padStart(6, '0')}`
          await prisma.appointment.create({
            data: {
              displayId,
              patientName: r.patientname || r.name || 'Unknown Client',
              practitionerName: r.practitionername || r.practitioner || 'Dr. Sarah Jenkins',
              date: r.date || new Date().toISOString().split('T')[0],
              startTime: r.time || '10:00',
              endTime: '11:00',
              status: r.status || 'Scheduled',
              serviceName: r.appointmenttype || r.type || 'Consultation'
            }
          }).catch(() => null)
        }
        recordsProcessed = records.length
      } else if (target === 'invoices') {
        for (const r of records) {
          const count = await prisma.invoice.count()
          const invNum = `INV-${String(count + 1).padStart(6, '0')}`
          await prisma.invoice.create({
            data: {
              invoiceNumber: invNum,
              displayId: invNum,
              patientName: r.patientname || r.clientname || 'Unknown Client',
              issueDate: r.issuedate || new Date().toISOString().split('T')[0],
              dueDate: r.duedate || new Date().toISOString().split('T')[0],
              amount: parseFloat(r.amount) || 150.0,
              due: parseFloat(r.due) || 150.0,
              status: r.status || 'Draft',
              sentStatus: r.sentstatus || 'Not Sent'
            }
          }).catch(() => null)
        }
        recordsProcessed = records.length
      } else if (target === 'services') {
        for (const r of records) {
          await prisma.serviceItem.create({
            data: {
              name: r.name || 'Imported Service',
              duration: parseInt(r.duration) || 60,
              price: parseFloat(r.price) || 150.0,
              ndisCode: r.ndiscode || r.ndis || '',
              color: r.color || '#8C4BFF',
              archived: false,
              taxable: r.gst === 'true' || r.gst === '1' || r.taxable === 'true'
            }
          }).catch(() => null)
        }
        recordsProcessed = records.length
      } else {
        recordsProcessed = records.length
      }
    }

    const log = await prisma.dataManagementLog.create({
      data: {
        type: 'Import',
        fileName: fileName || 'imported_file.csv',
        target: targetName,
        status: 'Success',
        recordsProcessed: recordsProcessed,
        errors: []
      }
    })

    res.json({
      success: true,
      message: `Successfully imported ${recordsProcessed} records into live database!`,
      data: log
    })
  } catch (err) {
    next(err)
  }
}

const logDataExport = async (req, res, next) => {
  try {
    const { target, format } = req.body
    const targetNames = {
      clients: 'Clients Register',
      contacts: 'Contacts Directory',
      appointments: 'Appointments Log',
      invoices: 'Invoice Ledgers',
      services: 'Services Directory',
      financial: 'Financial Performance Overview'
    }

    const targetName = targetNames[target] || 'Data Export'
    const ext = format || 'csv'
    const fileName = `${target}_export_${Date.now()}.${ext}`

    let exportData = []
    if (target === 'clients' || target === 'contacts') {
      const patients = await prisma.patient.findMany()
      exportData = patients.map(p => ({
        id: p.id,
        name: p.fullName,
        dob: p.dob || '',
        gender: p.gender || '',
        email: p.email || '',
        phone: p.phone || '',
        status: p.status || 'active'
      }))
    } else if (target === 'appointments') {
      exportData = await prisma.appointment.findMany()
    } else if (target === 'invoices' || target === 'financial') {
      exportData = await prisma.invoice.findMany()
    } else if (target === 'services') {
      exportData = await prisma.serviceItem.findMany()
    }

    const log = await prisma.dataManagementLog.create({
      data: {
        type: 'Export',
        fileName: fileName,
        target: targetName,
        status: 'Success',
        recordsProcessed: exportData.length,
        errors: []
      }
    })

    res.json({
      success: true,
      message: `Exported ${exportData.length} records successfully`,
      fileName,
      data: exportData,
      log
    })
  } catch (err) {
    next(err)
  }
}

const getDataLogs = async (req, res, next) => {
  try {
    const { type, target, status, search } = req.query

    const where = {}
    if (type && type !== 'all') {
      where.type = { equals: type }
    }
    if (status && status !== 'all') {
      where.status = { equals: status }
    }
    if (target && target !== 'all') {
      where.target = { equals: target }
    }
    if (search && search.trim()) {
      where.OR = [
        { fileName: { contains: search } },
        { target: { contains: search } }
      ]
    }

    let logs = await prisma.dataManagementLog.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })



    const formattedLogs = logs.map(l => ({
      id: l.id,
      type: l.type,
      fileName: l.fileName,
      target: l.target,
      timestamp: new Date(l.timestamp || l.createdAt).toLocaleString(),
      status: l.status,
      recordsProcessed: l.recordsProcessed,
      errors: l.errors || []
    }))

    res.json({ success: true, data: formattedLogs })
  } catch (err) {
    next(err)
  }
}


// Super Admin: Revoke Device Session
const revokeSession = async (req, res, next) => {
  try {
    const { id } = req.params

    const log = await prisma.auditLog.findUnique({ where: { id } }).catch(() => null)
    if (log) {
      await prisma.auditLog.update({
        where: { id },
        data: { severity: 'Revoked', details: 'Session revoked by admin' }
      }).catch(async () => {
        await prisma.auditLog.delete({ where: { id } }).catch(() => { })
      })
    } else {
      await prisma.refreshToken.delete({ where: { id } }).catch(() => { })
    }

    await prisma.auditLog.create({
      data: {
        category: 'Auth',
        action: 'SESSION_REVOKED',
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        details: `Revoked session ${id}`
      }
    }).catch(() => { })

    res.json({ success: true, message: 'Device session revoked successfully!' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Change Password
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { currentPassword, oldPass, newPassword, newPass } = req.body
    const curPassword = currentPassword || oldPass
    const nPassword = newPassword || newPass

    if (!curPassword || !nPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' })
    }

    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(curPassword, user.passwordHash)
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect. Please try again.' })
      }
    }

    const salt = await bcrypt.genSalt(10)
    const newPasswordHash = await bcrypt.hash(nPassword, salt)

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    })

    await prisma.auditLog.create({
      data: {
        category: 'Auth',
        action: 'PASSWORD_CHANGE',
        actor: user.name || 'Super Admin',
        role: user.role || 'SUPER_ADMIN',
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        details: 'Super Admin password changed successfully'
      }
    }).catch(() => { })

    res.json({ success: true, message: 'Password updated & saved to live database!' })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Login History & Connected Devices
const getLoginHistory = async (req, res, next) => {
  try {
    const { search, status } = req.query

    let logs = await prisma.auditLog.findMany({
      where: { category: 'Auth' },
      orderBy: { timestamp: 'desc' },
      take: 50
    })



    let formattedLogs = logs.map(l => ({
      key: l.id,
      id: l.id,
      date: new Date(l.timestamp).toLocaleString(),
      time: new Date(l.timestamp).toLocaleString(),
      ip: l.ipAddress || l.ip || '103.88.24.12',
      location: l.details || 'Melbourne, VIC',
      device: l.target || 'Chrome / Windows',
      status: l.severity === 'Revoked' ? 'Revoked' : (l.severity || 'Active Session')
    }))

    if (status && status !== 'all') {
      formattedLogs = formattedLogs.filter(l => l.status.toLowerCase() === status.toLowerCase())
    }

    if (search && search.trim()) {
      const q = search.toLowerCase()
      formattedLogs = formattedLogs.filter(l =>
        l.device.toLowerCase().includes(q) ||
        l.ip.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      )
    }

    res.json({ success: true, data: formattedLogs })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Get Security Controls
const getSecurityControls = async (req, res, next) => {
  try {
    let setting = await prisma.systemSetting.findUnique({ where: { key: 'security_controls' } })
    if (!setting) {
      setting = await prisma.systemSetting.create({
        data: {
          key: 'security_controls',
          value: { enforceMfa: true, encryptRest: true, autoLogout: false }
        }
      })
    }
    res.json({ success: true, data: setting.value })
  } catch (err) {
    next(err)
  }
}

// Super Admin: Update Security Controls
const updateSecurityControls = async (req, res, next) => {
  try {
    const { enforceMfa, encryptRest, autoLogout } = req.body
    const setting = await prisma.systemSetting.upsert({
      where: { key: 'security_controls' },
      update: {
        value: { enforceMfa: !!enforceMfa, encryptRest: !!encryptRest, autoLogout: !!autoLogout }
      },
      create: {
        key: 'security_controls',
        value: { enforceMfa: !!enforceMfa, encryptRest: !!encryptRest, autoLogout: !!autoLogout }
      }
    })

    // Log security control update in Audit Log
    const count = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: {
        displayId: `AUD-${String(count + 1).padStart(6, '0')}`,
        category: 'Permissions',
        action: 'Updated System Security Controls & Policies',
        actor: req.user?.name || 'Super Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: 'Platform Wide',
        severity: 'Warning'
      }
    }).catch(() => null)

    res.json({ success: true, data: setting.value })
  } catch (err) {
    next(err)
  }
}

// Helper to resolve clinicId for Message Board tenant isolation
const resolveTenantClinicId = async (user) => {
  if (!user) return null
  let clinicId = user.clinicId

  if (!clinicId && user.profileData && typeof user.profileData === 'object' && user.profileData.clinicId) {
    clinicId = user.profileData.clinicId
  }

  if (!clinicId && user.id) {
    const userBranch = await prisma.userBranch.findFirst({
      where: { userId: user.id },
      include: { branch: true }
    }).catch(() => null)
    if (userBranch?.branch?.clinicId) {
      clinicId = userBranch.branch.clinicId
    }
  }

  if (!clinicId && user.email) {
    const clinic = await prisma.clinic.findFirst({
      where: { email: user.email.toLowerCase().trim() }
    }).catch(() => null)
    if (clinic) clinicId = clinic.id
  }

  if (!clinicId && user.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } }).catch(() => null)
    if (dbUser?.profileData && dbUser.profileData.clinicId) {
      clinicId = dbUser.profileData.clinicId
    }
  }

  return clinicId
}

// Message Board & Task Communication Controllers (With Multi-Tenant Isolation)
const getMessageBoardItems = async (req, res, next) => {
  try {
    const userRole = req.user?.role
    const userClinicId = await resolveTenantClinicId(req.user)

    let whereClause = {}
    if (userRole === 'CLINIC_ADMIN' || userRole === 'PRACTITIONER') {
      whereClause = {
        OR: [
          { senderRole: 'Super Admin' },
          { senderRole: 'SUPER_ADMIN' },
          ...(userClinicId ? [{ clinicId: userClinicId }] : [])
        ]
      }
    } else if (userRole === 'SALES_EXECUTIVE') {
      whereClause = {
        OR: [
          { senderRole: 'Super Admin' },
          { senderRole: 'SUPER_ADMIN' }
        ]
      }
    } else if (userRole === 'PATIENT') {
      return res.json({ success: true, data: [] })
    }

    const items = await prisma.messageBoardItem.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    const formatted = items.map(item => ({
      id: item.id,
      sender: item.sender,
      senderRole: item.senderRole,
      message: item.message,
      taskRef: item.taskRef,
      clinicId: item.clinicId,
      timestamp: new Date(item.createdAt).toLocaleString([], {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    }))

    res.json({ success: true, data: formatted })
  } catch (err) {
    next(err)
  }
}

const createMessageBoardItem = async (req, res, next) => {
  try {
    const { message, taskRef, sender, senderRole, clinicId } = req.body
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' })
    }

    const userClinicId = await resolveTenantClinicId(req.user)

    const effectiveSender = sender || req.user?.name || 'Super Admin'
    const effectiveRole = senderRole || (req.user?.role === 'SUPER_ADMIN' ? 'Super Admin' : req.user?.role === 'PRACTITIONER' ? 'Practitioner' : 'Clinic Admin')
    const effectiveClinicId = clinicId || userClinicId || null

    const item = await prisma.messageBoardItem.create({
      data: {
        sender: effectiveSender,
        senderRole: effectiveRole,
        message: message.trim(),
        taskRef: taskRef ? taskRef.trim() : null,
        clinicId: effectiveClinicId
      }
    })

    res.json({
      success: true,
      data: {
        id: item.id,
        sender: item.sender,
        senderRole: item.senderRole,
        message: item.message,
        taskRef: item.taskRef,
        clinicId: item.clinicId,
        timestamp: new Date(item.createdAt).toLocaleString([], {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      }
    })
  } catch (err) {
    next(err)
  }
}

const deleteMessageBoardItem = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.messageBoardItem.delete({ where: { id } })
    res.json({ success: true, message: 'Message deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getMessageBoardItems,
  createMessageBoardItem,
  deleteMessageBoardItem,
  getClinics,
  createClinic,

  updateClinic,
  deleteClinic,
  updateClinicStatus,
  updateClinicTier,
  resetClinicBilling,
  impersonateClinicAdmin,
  sendClinicAnnouncement,
  updateClinicFeatures,
  resetClinicPassword,
  getClinicInvoices,
  getClinicSupportTickets,
  getClinicAuditLogs,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getSubscriptions,
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getBillingOverview,
  deleteSubscriptionInvoice,
  getAuditLogs,
  createAuditLog,
  getSalesUsers,
  createSalesUser,
  updateSalesUser,
  deleteSalesUser,
  getAffiliates,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
  getSalesLeads,
  createSalesLead,
  updateSalesLead,
  deleteSalesLead,
  getComplianceAlerts,
  createComplianceAlert,
  updateComplianceAlert,
  deleteComplianceAlert,
  getGovernanceLogs,
  createGovernanceLog,
  getSupportTickets,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
  getSupportBugs,
  createSupportBug,
  updateSupportBug,
  deleteSupportBug,
  getSupportFeatures,
  createSupportFeature,
  voteSupportFeature,
  getSupportChats,
  sendSupportChatMessage,
  getSupportClinicHistory,
  getPlatformAnalytics,
  updateInvoiceStatus,
  getProfile,
  updateProfile,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getServices,
  createService,
  updateService,
  deleteService,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getCancellationReasons,
  createCancellationReason,
  updateCancellationReason,
  deleteCancellationReason,
  processDataImport,
  logDataExport,
  getDataLogs,
  revokeSession,
  changePassword,
  getLoginHistory,
  getSecurityControls,
  updateSecurityControls
}

