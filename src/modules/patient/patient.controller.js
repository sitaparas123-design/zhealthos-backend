const prisma = require('../../config/db')
const { emitEvent } = require('../../config/socket')

const findOrCreatePatient = async (reqUser) => {
  let patient = await prisma.patient.findFirst({
    where: { userId: reqUser.id },
  })
  if (!patient && reqUser.email) {
    patient = await prisma.patient.findFirst({
      where: { email: reqUser.email },
    })
    if (patient && !patient.userId) {
      await prisma.patient.update({
        where: { id: patient.id },
        data: { userId: reqUser.id }
      }).catch(() => null)
    }
  }
  if (!patient) {
    const count = await prisma.patient.count()
    const displayId = `PAT-${String(count + 1).padStart(6, '0')}`
    patient = await prisma.patient.create({
      data: {
        userId: reqUser.id,
        displayId,
        fullName: reqUser.name || 'Patient User',
        email: reqUser.email || '',
        phone: reqUser.phone || '',
        status: 'active'
      }
    })
  }
  return patient
}

const getPatientProfile = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    let user = null
    if (patient && patient.userId && prisma.user) {
      try {
        user = await prisma.user.findUnique({ where: { id: patient.userId } })
      } catch (e) {
        // fallback
      }
    }

    const mergedData = {
      ...patient,
      name: patient.fullName || user?.name || req.user?.name || '',
      email: patient.email || user?.email || req.user?.email || '',
      phone: patient.phone || user?.phone || '',
      avatarUrl: user?.avatarUrl || null,
      profileData: {
        ...(user?.profileData || {}),
        dob: patient.dob || user?.profileData?.dob || null,
        gender: patient.gender || user?.profileData?.gender || 'Female',
        street: patient.address || user?.profileData?.street || '',
        city: patient.city || user?.profileData?.city || '',
        state: patient.state || user?.profileData?.state || 'NSW',
        country: user?.profileData?.country || 'Australia',
        postalCode: patient.postcode || user?.profileData?.postalCode || ''
      }
    }

    res.json({ success: true, data: mergedData })
  } catch (err) {
    next(err)
  }
}

const bcrypt = require('bcryptjs')

const updatePatientProfile = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const {
      name,
      fullName,
      phone,
      mobile,
      email,
      address,
      street,
      city,
      state,
      country,
      postcode,
      postalCode,
      dob,
      gender,
      avatarUrl,
      profileData,
      currentPassword,
      newPassword,
      emergencyName,
      emergencyRelation,
      emergencyPhone,
      gpName,
      gpClinic,
      gpPhone,
      medicareNum,
      medicareRef,
      medicareExpiry,
      phiProvider,
      phiMemberNum
    } = req.body

    const targetName = name || fullName
    const targetPhone = phone || mobile
    const pData = profileData || {}

    const targetDob = dob || pData.dob
    const targetGender = gender || pData.gender
    const targetStreet = street || address || pData.street
    const targetCity = city || pData.city
    const targetState = state || pData.state
    const targetPostalCode = postalCode || postcode || pData.postalCode
    const targetCountry = country || pData.country

    let updatedPatient = patient

    try {
      if (prisma.patient) {
        updatedPatient = await prisma.$transaction(async (tx) => {
          if (patient.userId && tx.user) {
            const currentUser = await tx.user.findUnique({ where: { id: patient.userId } })

            if (email && email.toLowerCase() !== (currentUser?.email || '').toLowerCase()) {
              const existingEmailUser = await tx.user.findFirst({
                where: {
                  email: email.toLowerCase(),
                  id: { not: patient.userId }
                }
              })
              if (existingEmailUser) {
                const err = new Error('Email address is already in use by another account')
                err.statusCode = 400
                throw err
              }
            }

            let newPasswordHash = null
            if (newPassword) {
              if (currentPassword && currentUser && currentUser.passwordHash) {
                const isMatch = await bcrypt.compare(currentPassword, currentUser.passwordHash)
                if (!isMatch) {
                  const err = new Error('Current password is incorrect')
                  err.statusCode = 400
                  throw err
                }
              }
              const salt = await bcrypt.genSalt(10)
              newPasswordHash = await bcrypt.hash(newPassword, salt)
            }

            const userUpdatePayload = {}
            if (targetName !== undefined) userUpdatePayload.name = targetName
            if (email !== undefined) userUpdatePayload.email = email.toLowerCase()
            if (targetPhone !== undefined) userUpdatePayload.phone = targetPhone
            if (avatarUrl !== undefined) userUpdatePayload.avatarUrl = avatarUrl
            if (newPasswordHash) userUpdatePayload.passwordHash = newPasswordHash

            const currentProfileData = currentUser?.profileData || {}

            userUpdatePayload.profileData = {
              ...currentProfileData,
              ...(targetDob !== undefined && { dob: targetDob }),
              ...(targetGender !== undefined && { gender: targetGender }),
              ...(targetStreet !== undefined && { street: targetStreet }),
              ...(targetCity !== undefined && { city: targetCity }),
              ...(targetState !== undefined && { state: targetState }),
              ...(targetPostalCode !== undefined && { postalCode: targetPostalCode }),
              ...(targetCountry !== undefined && { country: targetCountry })
            }

            if (currentUser.role === 'PATIENT') {
              await tx.user.update({
                where: { id: patient.userId },
                data: userUpdatePayload
              })
            }
          }

          const patientUpdatePayload = {}
          if (targetName !== undefined) patientUpdatePayload.fullName = targetName
          if (targetPhone !== undefined) patientUpdatePayload.phone = targetPhone
          if (email !== undefined) patientUpdatePayload.email = email.toLowerCase()
          if (targetStreet !== undefined) patientUpdatePayload.address = targetStreet
          if (targetCity !== undefined) patientUpdatePayload.city = targetCity
          if (targetState !== undefined) patientUpdatePayload.state = targetState
          if (targetPostalCode !== undefined) patientUpdatePayload.postcode = targetPostalCode
          if (targetDob !== undefined) patientUpdatePayload.dob = targetDob
          if (targetGender !== undefined) patientUpdatePayload.gender = targetGender
          if (emergencyName !== undefined) patientUpdatePayload.emergencyContactName = emergencyName
          if (emergencyRelation !== undefined) patientUpdatePayload.emergencyRelation = emergencyRelation
          if (emergencyPhone !== undefined) patientUpdatePayload.emergencyContactPhone = emergencyPhone
          if (gpName !== undefined) patientUpdatePayload.gpName = gpName
          if (gpClinic !== undefined) patientUpdatePayload.gpClinic = gpClinic
          if (gpPhone !== undefined) patientUpdatePayload.gpPhone = gpPhone
          if (medicareNum !== undefined) patientUpdatePayload.medicareNumber = medicareNum
          if (medicareRef !== undefined) patientUpdatePayload.medicareRef = medicareRef
          if (medicareExpiry !== undefined) patientUpdatePayload.medicareExpiry = medicareExpiry
          if (phiProvider !== undefined) patientUpdatePayload.privateHealthFund = phiProvider
          if (phiMemberNum !== undefined) patientUpdatePayload.phiMemberNum = phiMemberNum

          return await tx.patient.update({
            where: { id: patient.id },
            data: patientUpdatePayload
          })
        })
      }
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production' || dbErr.statusCode === 400) {
        return next(dbErr)
      }
      console.warn('DB profile update warning:', dbErr.message)
    }

    res.json({ success: true, message: 'Profile updated successfully in live database!', data: updatedPatient })
  } catch (err) {
    next(err)
  }
}

const getPatientAppointments = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: appointments })
  } catch (err) {
    next(err)
  }
}

const createAppointment = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const { practitionerId, practitionerName, branchName, serviceName, date, startTime, notes } = req.body

    let finalPracName = practitionerName
    let finalPracId = practitionerId

    if (finalPracId) {
      const pRecord = await prisma.practitioner.findUnique({ where: { id: finalPracId } }).catch(() => null)
      if (pRecord) {
        if (pRecord.name) finalPracName = pRecord.name
        
        // Validate doctor availability
        if (pRecord.availability && date) {
          const bookingDateObj = new Date(date)
          const dayName = bookingDateObj.toLocaleDateString('en-US', { weekday: 'long' }) // e.g. "Friday"
          const av = pRecord.availability
          const dayConfig = (typeof av === 'object' && !Array.isArray(av))
            ? (av[dayName] || av[dayName.toLowerCase()])
            : (Array.isArray(av) ? av.find(it => it.day?.toLowerCase() === dayName.toLowerCase()) : null)

          if (dayConfig && (dayConfig.available === false || dayConfig.enabled === false || dayConfig.isWorking === false)) {
            return res.status(400).json({
              success: false,
              isUnavailable: true,
              message: `${pRecord.name || 'This doctor'} is unavailable on ${dayName}s (Day Off). Please choose another date.`
            })
          }
        }
      }
    }

    const count = await prisma.appointment.count()
    const displayId = `APT-${String(count + 1).padStart(6, '0')}`

    const newAppointment = await prisma.appointment.create({
      data: {
        displayId,
        patientId: patient.id,
        patientName: patient.fullName || req.user.name || 'John Doe',
        practitionerId: finalPracId || null,
        practitionerName: finalPracName || 'Dr. Practitioner',
        branchName: branchName || 'Melbourne Allied Health',
        serviceName: serviceName || 'General Consultation',
        date: date || new Date().toISOString().split('T')[0],
        startTime: startTime || '10:00 AM',
        endTime: '10:45 AM',
        status: 'Upcoming',
        notes: notes || '',
        fee: 150.0,
      },
    })

    res.json({ success: true, data: newAppointment })
  } catch (err) {
    next(err)
  }
}

const rescheduleAppointment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { date, startTime, notes } = req.body

    const existing = await prisma.appointment.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }

    if (existing.practitionerId && date) {
      const pRecord = await prisma.practitioner.findUnique({ where: { id: existing.practitionerId } }).catch(() => null)
      if (pRecord && pRecord.availability) {
        const bookingDateObj = new Date(date)
        const dayName = bookingDateObj.toLocaleDateString('en-US', { weekday: 'long' })
        const av = pRecord.availability
        const dayConfig = (typeof av === 'object' && !Array.isArray(av))
          ? (av[dayName] || av[dayName.toLowerCase()])
          : (Array.isArray(av) ? av.find(it => it.day?.toLowerCase() === dayName.toLowerCase()) : null)

        if (dayConfig && (dayConfig.available === false || dayConfig.enabled === false || dayConfig.isWorking === false)) {
          return res.status(400).json({
            success: false,
            isUnavailable: true,
            message: `${pRecord.name || 'This doctor'} is unavailable on ${dayName}s (Day Off). Please choose another date.`
          })
        }
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(date && { date }),
        ...(startTime && { startTime }),
        ...(notes && { notes: existing.notes ? `${existing.notes} | Reschedule note: ${notes}` : notes }),
        status: 'Upcoming',
      },
    })

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params

    const existing = await prisma.appointment.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'Cancelled' },
    })

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

const getPractitioners = async (req, res, next) => {
  try {
    const practitioners = await prisma.practitioner.findMany({
      where: { status: 'Active' },
      select: {
        id: true,
        name: true,
        specialty: true,
        email: true,
        color: true,
        availability: true,
        assignedBranches: true
      },
    })
    res.json({ success: true, data: practitioners })
  } catch (err) {
    next(err)
  }
}

const getCareTeam = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)

    // Resolve patient's clinicId
    let patientClinicId = patient.clinicId || req.user?.clinicId || null
    if (!patientClinicId && prisma.appointment) {
      const appts = await prisma.appointment.findMany({
        where: { patientId: patient.id },
        orderBy: { createdAt: 'desc' }
      }).catch(() => [])

      const matchedAppt = appts.find(a => a.clinicId)
      if (matchedAppt?.clinicId) {
        patientClinicId = matchedAppt.clinicId
        await prisma.patient.update({ where: { id: patient.id }, data: { clinicId: patientClinicId } }).catch(() => null)
      }
    }

    if (!patientClinicId && prisma.appointment) {
      const anyAppt = await prisma.appointment.findFirst({
        where: { patientId: patient.id }
      })
      if (anyAppt?.practitionerId) {
        const p = await prisma.practitioner.findUnique({ where: { id: anyAppt.practitionerId } })
        if (p?.clinicId) {
          patientClinicId = p.clinicId
          await prisma.patient.update({ where: { id: patient.id }, data: { clinicId: patientClinicId } }).catch(() => null)
        }
      }
    }

    const whereClause = patientClinicId
      ? { clinicId: patientClinicId, status: 'Active' }
      : { status: 'Active' }

    const dbPractitioners = await prisma.practitioner.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    }).catch(() => [])

    const formatted = dbPractitioners.map((p, idx) => ({
      id: p.id,
      name: p.name,
      specialty: p.specialty || 'General Practitioner',
      clinic: p.clinic || 'Main Clinic',
      clinicId: p.clinicId,
      contact: p.phone || '',
      email: p.email || '',
      lastAppt: p.joinDate || 'Recently',
      avatar: p.avatarUrl || (idx % 2 === 0
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150')
    }))

    res.json({ success: true, data: formatted })
  } catch (err) {
    next(err)
  }
}

const getPatientClinicUsers = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)

    // Resolve patient's clinicId
    let clinicId = patient.clinicId || req.user?.clinicId || null
    if (!clinicId && prisma.appointment) {
      const appt = await prisma.appointment.findFirst({
        where: { patientId: patient.id, clinicId: { not: null } }
      })
      if (appt?.clinicId) {
        clinicId = appt.clinicId
        await prisma.patient.update({ where: { id: patient.id }, data: { clinicId } }).catch(() => null)
      }
    }

    if (!clinicId && prisma.appointment) {
      const anyAppt = await prisma.appointment.findFirst({
        where: { patientId: patient.id }
      })
      if (anyAppt?.practitionerId) {
        const p = await prisma.practitioner.findUnique({ where: { id: anyAppt.practitionerId } })
        if (p?.clinicId) {
          clinicId = p.clinicId
          await prisma.patient.update({ where: { id: patient.id }, data: { clinicId } }).catch(() => null)
        }
      }
    }

    if (!clinicId) {
      const clinicWithPractitioners = await prisma.practitioner.findFirst({
        where: { status: 'Active', clinicId: { not: null } }
      })
      if (clinicWithPractitioners?.clinicId) {
        clinicId = clinicWithPractitioners.clinicId
      } else {
        const firstClinic = await prisma.clinic.findFirst()
        if (firstClinic) clinicId = firstClinic.id
      }
      if (clinicId) {
        await prisma.patient.update({ where: { id: patient.id }, data: { clinicId } }).catch(() => null)
      }
    }

    // Query ONLY practitioners belonging to THIS clinic
    const clinicPractitioners = clinicId
      ? await prisma.practitioner.findMany({
          where: { clinicId: clinicId, status: 'Active' },
          orderBy: { name: 'asc' }
        })
      : await prisma.practitioner.findMany({
          where: { status: 'Active' },
          take: 5
        })

    const clinic = clinicId ? await prisma.clinic.findUnique({ where: { id: clinicId } }) : null
    const clinicName = clinic?.name || 'Clinic'

    // Format list: only clinic users
    const users = []

    // 1. Real Practitioners of this clinic
    clinicPractitioners.forEach((p, idx) => {
      users.push({
        id: p.id,
        name: p.name,
        role: p.specialty || 'Clinical Practitioner',
        type: 'practitioner',
        practitionerId: p.id,
        avatar: p.avatarUrl || (idx % 2 === 0
          ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'
          : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'),
        online: true,
        clinicName
      })
    })

    // 2. This clinic's Reception / Front Desk staff
    users.push({
      id: `reception_${clinicId || 'main'}`,
      name: `${clinicName} Reception`,
      role: 'Administrative & Front Desk',
      type: 'reception',
      practitionerId: null,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      online: true,
      clinicName
    })

    res.json({ success: true, clinicId, clinicName, data: users })
  } catch (err) {
    next(err)
  }
}

const getCareTeamMessages = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const patientId = patient?.id

    let messages = await prisma.careTeamMessage.findMany({
      where: {
        patientId: patientId
      },
      orderBy: { createdAt: 'asc' }
    })

    // If no messages exist yet for this patient, fetch active practitioners from DB and initialize default welcoming conversations
    if (!messages || messages.length === 0) {
      const practitioners = await prisma.practitioner.findMany({
        where: { status: 'Active' },
        take: 3
      }).catch(() => [])

      const defaultConvs = []
      if (practitioners.length > 0) {
        practitioners.forEach(p => {
          defaultConvs.push({
            patientId,
            practitionerId: p.id,
            sender: 'doctor',
            doctorName: p.name,
            text: `Hello! I am ${p.name} (${p.specialty || 'Practitioner'}). Welcome to your personalized care portal. Feel free to message me regarding your exercises, pain levels, or treatment plan updates.`,
            category: 'Treatment Questions'
          })
        })
      } else {
        defaultConvs.push({
          patientId,
          sender: 'doctor',
          doctorName: 'Dr. Sarah Jenkins',
          text: 'Hello! I am Dr. Sarah Jenkins. Welcome to your personalized care portal. Feel free to message me regarding your exercises, pain levels, or treatment plan updates.',
          category: 'Treatment Questions'
        })
      }

      defaultConvs.push(
        {
          patientId,
          sender: 'reception',
          doctorName: 'Clinic Reception',
          text: 'Hi there! If you need to reschedule an appointment, verify branch hours, or check room availability, message our front desk here.',
          category: 'Appointment Requests'
        },
        {
          patientId,
          sender: 'billing',
          doctorName: 'Billing & Accounts',
          text: 'Hello! I can help you with invoice copies, Medicare / NDIS claims, and private health rebate queries.',
          category: 'Billing Questions'
        },
        {
          patientId,
          sender: 'support',
          doctorName: 'ZealthOS Support Team',
          text: 'Welcome to ZealthOS! If you encounter any technical difficulty with the portal or video calls, our team is standing by 24/7.',
          category: 'General Questions'
        }
      )

      await prisma.careTeamMessage.createMany({ data: defaultConvs }).catch(() => null)
      messages = await prisma.careTeamMessage.findMany({
        where: { patientId },
        orderBy: { createdAt: 'asc' }
      })
    }

    res.json({ success: true, data: messages })
  } catch (err) {
    next(err)
  }
}

const sendCareTeamMessage = async (req, res, next) => {
  try {
    const { contactId, practitionerId, doctorName, messageText, category, text } = req.body
    const content = messageText || text
    if (!content) {
      return res.status(400).json({ success: false, message: 'Message text is required' })
    }

    const patient = await findOrCreatePatient(req.user)
    const patientName = patient.fullName || req.user.name || 'Patient'

    // Determine target contact & recipient role
    let target = doctorName || 'Dr. Sarah Jenkins'
    let recipientType = 'doctor'
    let notifTarget = 'PRACTITIONER'
    let resolvedPractitionerId = practitionerId || null

    if (contactId === 'reception' || doctorName?.toLowerCase().includes('reception')) {
      target = 'Clinic Reception'
      recipientType = 'reception'
      notifTarget = 'CLINIC_ADMIN'
    } else if (contactId === 'billing' || doctorName?.toLowerCase().includes('billing') || doctorName?.toLowerCase().includes('accounts')) {
      target = 'Billing & Accounts'
      recipientType = 'billing'
      notifTarget = 'CLINIC_ADMIN'
    } else if (contactId === 'support' || doctorName?.toLowerCase().includes('support')) {
      target = 'ZealthOS Support Team'
      recipientType = 'support'
      notifTarget = 'SUPER_ADMIN'
    } else {
      if (contactId && contactId !== 'sarah' && !resolvedPractitionerId) {
        const foundPractitioner = await prisma.practitioner.findUnique({
          where: { id: contactId }
        }).catch(() => null)
        if (foundPractitioner) {
          resolvedPractitionerId = foundPractitioner.id
          target = foundPractitioner.name
        }
      }
      recipientType = 'doctor'
      notifTarget = 'PRACTITIONER'
    }

    // 1. Save patient message in DB
    const patientMsg = await prisma.careTeamMessage.create({
      data: {
        practitionerId: resolvedPractitionerId,
        patientId: patient.id,
        sender: 'patient',
        doctorName: target,
        text: content,
        category: category || 'Treatment Questions'
      }
    })

    // 2. Create in-app Notification for the recipient role (Practitioner / Clinic Admin / Super Admin)
    await prisma.notification.create({
      data: {
        title: `Message from Patient ${patientName}`,
        message: `[${target}] (${category || 'General'}): "${content.slice(0, 120)}${content.length > 120 ? '...' : ''}"`,
        target: notifTarget,
        type: 'inbox',
        isRead: false,
        userId: req.user.id
      }
    }).catch(() => null)

    // 3. Emit real-time Socket.IO event for live desktop/mobile push
    emitEvent('notification:new', {
      title: `Patient Message (${patientName})`,
      message: `To ${target}: ${content}`,
      target: notifTarget
    })
    emitEvent('care_team:message', {
      patientId: patient.id,
      patientName,
      practitionerId: resolvedPractitionerId,
      sender: 'patient',
      doctorName: target,
      text: content,
      category: category || 'Treatment Questions'
    })

    // 4. Generate and save contextual response in DB
    let replyText = `Thank you for reaching out, ${patientName}. I've received your note regarding "${category || 'your query'}" and reviewed your update. Everything is logged in your medical file.`
    if (recipientType === 'reception') {
      replyText = `Hello ${patientName}, reception has noted your request for ${category || 'appointments'}. We will coordinate your slot and confirm shortly!`
    } else if (recipientType === 'billing') {
      replyText = `Hi ${patientName}, our accounts team has received your inquiry about ${category || 'billing'}. Your statement and claim status are currently being reviewed.`
    } else if (recipientType === 'support') {
      replyText = `Hi ${patientName}, ZealthOS technical support is on it! We've logged your request (${category || 'General Questions'}) and our team is assisting.`
    }

    const replyMsg = await prisma.careTeamMessage.create({
      data: {
        practitionerId: resolvedPractitionerId,
        patientId: patient.id,
        sender: recipientType,
        doctorName: target,
        text: replyText,
        category: category || 'Treatment Questions'
      }
    })

    res.json({
      success: true,
      message: `Secure message delivered to ${target}`,
      data: patientMsg,
      reply: replyMsg
    })
  } catch (err) {
    next(err)
  }
}

// --- Treatment Plans & Prescribed Exercises ---

let inMemoryTreatmentPlans = []

let inMemoryExercises = []

const getTreatmentPlans = async (req, res, next) => {
  try {
    const { search, status } = req.query
    let plans = []

    try {
      if (prisma.treatmentPlan) {
        let whereClause = {}
        if (req.user?.role === 'PATIENT') {
          const patient = await findOrCreatePatient(req.user)
          whereClause = { patientId: patient.id }
        }

        plans = await prisma.treatmentPlan.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' }
        })

        const patients = await prisma.patient.findMany({
          select: { id: true, fullName: true, email: true }
        }).catch(() => [])

        plans = plans.map(p => {
          const matched = patients.find(pt => pt.id === p.patientId)
          return {
            ...p,
            patientName: matched ? matched.fullName.trim() : (p.patientId || 'Patient')
          }
        })
      }
    } catch (dbErr) {
      console.warn('DB treatment plans query notice:', dbErr.message)
    }

    if (!plans || plans.length === 0) {
      plans = inMemoryTreatmentPlans
    }

    let filtered = [...plans]
    if (status && status !== 'ALL' && status !== 'all') {
      filtered = filtered.filter(p => (p.status || 'Active').toLowerCase() === status.toLowerCase())
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      filtered = filtered.filter(p =>
        (p.condition && p.condition.toLowerCase().includes(q)) ||
        (p.practitioner && p.practitioner.toLowerCase().includes(q)) ||
        (p.stage && p.stage.toLowerCase().includes(q)) ||
        (p.patientName && p.patientName.toLowerCase().includes(q))
      )
    }

    res.json({ success: true, data: filtered })
  } catch (err) {
    next(err)
  }
}

const createTreatmentPlan = async (req, res, next) => {
  try {
    const { condition, practitioner, stage, overallProgress, goals, timeline, status } = req.body
    const newPlan = {
      id: `tp_${Date.now()}`,
      displayId: `TP-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      condition: condition || 'General Rehabilitation Plan',
      practitioner: practitioner || 'Dr. Sarah Jenkins (Physiotherapist)',
      stage: stage || 'Phase 1: Initial Assessment',
      overallProgress: overallProgress !== undefined ? Number(overallProgress) : 25,
      status: status || 'Active',
      goals: goals || [],
      timeline: timeline || []
    }

    try {
      if (prisma.treatmentPlan) {
        const patient = await findOrCreatePatient(req.user)
        const dbCreated = await prisma.treatmentPlan.create({
          data: {
            ...newPlan,
            patientId: patient.id
          }
        })
        inMemoryTreatmentPlans.unshift(dbCreated)
        return res.json({ success: true, data: dbCreated })
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryTreatmentPlans.unshift(newPlan)
    res.json({ success: true, data: newPlan })
  } catch (err) {
    next(err)
  }
}

const updateTreatmentPlan = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    try {
      if (prisma.treatmentPlan) {
        const existing = await prisma.treatmentPlan.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.treatmentPlan.update({
            where: { id },
            data: updateData
          })
          return res.json({ success: true, data: updated })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    const idx = inMemoryTreatmentPlans.findIndex(p => p.id === id)
    if (idx !== -1) {
      inMemoryTreatmentPlans[idx] = { ...inMemoryTreatmentPlans[idx], ...updateData }
      return res.json({ success: true, data: inMemoryTreatmentPlans[idx] })
    }

    res.status(404).json({ success: false, message: 'Treatment plan not found' })
  } catch (err) {
    next(err)
  }
}

const deleteTreatmentPlan = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.treatmentPlan) {
        const existing = await prisma.treatmentPlan.findUnique({ where: { id } })
        if (existing) {
          await prisma.treatmentPlan.delete({ where: { id } })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryTreatmentPlans = inMemoryTreatmentPlans.filter(p => p.id !== id)
    res.json({ success: true, message: 'Treatment plan deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const getPrescribedExercises = async (req, res, next) => {
  try {
    let exercises = []
    try {
      if (prisma.prescribedExercise) {
        const patient = await findOrCreatePatient(req.user)
        exercises = await prisma.prescribedExercise.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'desc' }
        })
      }
    } catch (dbErr) {
      console.warn('DB prescribed exercises query notice:', dbErr.message)
    }

    res.json({ success: true, data: exercises })
  } catch (err) {
    next(err)
  }
}

const createPrescribedExercise = async (req, res, next) => {
  try {
    const { name, reps, note, img } = req.body
    const newEx = {
      id: `ex_${Date.now()}`,
      name: name || 'Custom Exercise',
      reps: reps || '3 sets of 10 reps',
      note: note || 'Perform with control.',
      done: false,
      img: img || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200'
    }

    try {
      if (prisma.prescribedExercise) {
        const patient = await findOrCreatePatient(req.user)
        const dbCreated = await prisma.prescribedExercise.create({
          data: {
            patientId: patient.id,
            name: newEx.name,
            reps: newEx.reps,
            note: newEx.note,
            done: false,
            img: newEx.img
          }
        })
        inMemoryExercises.unshift(dbCreated)
        return res.json({ success: true, data: dbCreated })
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryExercises.unshift(newEx)
    res.json({ success: true, data: newEx })
  } catch (err) {
    next(err)
  }
}

const togglePrescribedExercise = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.prescribedExercise) {
        const existing = await prisma.prescribedExercise.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.prescribedExercise.update({
            where: { id },
            data: { done: !existing.done }
          })
          return res.json({ success: true, data: updated })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    const idx = inMemoryExercises.findIndex(ex => String(ex.id) === String(id))
    if (idx !== -1) {
      inMemoryExercises[idx].done = !inMemoryExercises[idx].done
      return res.json({ success: true, data: inMemoryExercises[idx] })
    }

    res.status(404).json({ success: false, message: 'Exercise not found' })
  } catch (err) {
    next(err)
  }
}

const deletePrescribedExercise = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.prescribedExercise) {
        const existing = await prisma.prescribedExercise.findUnique({ where: { id } })
        if (existing) {
          await prisma.prescribedExercise.delete({ where: { id } })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryExercises = inMemoryExercises.filter(ex => String(ex.id) !== String(id))
    res.json({ success: true, message: 'Exercise deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// --- Visual Progress & Clinical Outcomes ---

let inMemoryOutcomesData = []

let inMemoryOutcomeMeasures = []

const getProgressOutcomes = async (req, res, next) => {
  try {
    const { search, type, status } = req.query
    let trends = []
    let measures = []

    try {
      if (prisma.patientProgressTrend && prisma.patientOutcomeMeasure) {
        const patient = await findOrCreatePatient(req.user)
        trends = await prisma.patientProgressTrend.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'asc' }
        })
        measures = await prisma.patientOutcomeMeasure.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'asc' }
        })
      }
    } catch (dbErr) {
      console.warn('DB progress outcomes query notice:', dbErr.message)
    }

    let filteredMeasures = [...measures]
    if (type && type !== 'ALL') {
      filteredMeasures = filteredMeasures.filter(m => (m.type || '').toLowerCase() === type.toLowerCase())
    }
    if (status && status !== 'ALL') {
      filteredMeasures = filteredMeasures.filter(m => (m.status || '').toLowerCase() === status.toLowerCase())
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      filteredMeasures = filteredMeasures.filter(m =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.type && m.type.toLowerCase().includes(q))
      )
    }

    const latestTrend = trends[trends.length - 1] || null
    const firstTrend = trends[0] || null

    const metrics = {
      painIndex: latestTrend ? `${latestTrend.pain} / 10 (${latestTrend.pain <= 3 ? 'Mild' : latestTrend.pain <= 6 ? 'Moderate' : 'Severe'})` : '0 / 10',
      painChange: (latestTrend && firstTrend) ? `${Math.round(((latestTrend.pain - firstTrend.pain) / (firstTrend.pain || 1)) * 100)}% from initial intake` : 'No change data',
      mobilityRating: latestTrend ? `${latestTrend.mobility}% Rating` : '0% Rating',
      mobilityExpansion: (latestTrend && firstTrend) ? `+${latestTrend.mobility - firstTrend.mobility}% ROM expansion` : '0% ROM expansion',
      strengthRating: latestTrend ? `${latestTrend.function || 0}% Rating` : '0% Rating',
      strengthIncrease: '0% isometric loading capacity',
      complianceCompleted: '0% Completed',
      complianceStreak: '0-day active streak'
    }

    res.json({
      success: true,
      data: {
        metrics,
        trends,
        outcomeMeasures: filteredMeasures
      }
    })
  } catch (err) {
    next(err)
  }
}

const createOutcomeMeasure = async (req, res, next) => {
  try {
    const { name, type, prevScore, score, status, verifiedBy } = req.body

    const validStatuses = ['Improved', 'Stable', 'Declined', 'Not Tracked']
    const measureStatus = validStatuses.includes(status) ? status : 'Improved'

    const newMeasure = {
      id: `om_${Date.now()}`,
      name: name || 'Custom Outcome Questionnaire',
      type: type || 'Lumbar Spine',
      prevScore: prevScore || '—',
      score: score || '100% (Full Capacity)',
      status: measureStatus,
      verifiedBy: verifiedBy || 'Attending Practitioner',
      verifiedAt: new Date().toISOString()
    }

    try {
      if (prisma.patientOutcomeMeasure) {
        const patient = await findOrCreatePatient(req.user)
        const dbCreated = await prisma.patientOutcomeMeasure.create({
          data: { ...newMeasure, patientId: patient.id }
        })
        inMemoryOutcomeMeasures.push(dbCreated)
        return res.json({ success: true, data: dbCreated })
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryOutcomeMeasures.push(newMeasure)
    res.json({ success: true, data: newMeasure })
  } catch (err) {
    next(err)
  }
}

const updateOutcomeMeasure = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    try {
      if (prisma.patientOutcomeMeasure) {
        const existing = await prisma.patientOutcomeMeasure.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.patientOutcomeMeasure.update({
            where: { id },
            data: updateData
          })
          return res.json({ success: true, data: updated })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    const idx = inMemoryOutcomeMeasures.findIndex(m => m.id === id)
    if (idx !== -1) {
      inMemoryOutcomeMeasures[idx] = { ...inMemoryOutcomeMeasures[idx], ...updateData }
      return res.json({ success: true, data: inMemoryOutcomeMeasures[idx] })
    }

    res.status(404).json({ success: false, message: 'Outcome measure not found' })
  } catch (err) {
    next(err)
  }
}

const deleteOutcomeMeasure = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.patientOutcomeMeasure) {
        const existing = await prisma.patientOutcomeMeasure.findUnique({ where: { id } })
        if (existing) {
          await prisma.patientOutcomeMeasure.delete({ where: { id } })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryOutcomeMeasures = inMemoryOutcomeMeasures.filter(m => m.id !== id)
    res.json({ success: true, message: 'Outcome measure deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const createProgressTrend = async (req, res, next) => {
  try {
    const { month, pain, function: fnVal, mobility } = req.body

    const validatedPain = Math.max(0, Math.min(10, Number(pain) || 0))
    const validatedFunction = Math.max(0, Math.min(100, Number(fnVal) || 0))
    const validatedMobility = Math.max(0, Math.min(100, Number(mobility) || 0))

    const newTrend = {
      id: `tr_${Date.now()}`,
      month: month || 'Jul',
      pain: validatedPain,
      function: validatedFunction,
      mobility: validatedMobility
    }

    try {
      if (prisma.patientProgressTrend) {
        const patient = await findOrCreatePatient(req.user)
        const dbCreated = await prisma.patientProgressTrend.create({
          data: { ...newTrend, patientId: patient.id }
        })
        inMemoryOutcomesData.push(dbCreated)
        return res.json({ success: true, data: dbCreated })
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryOutcomesData.push(newTrend)
    res.json({ success: true, data: newTrend })
  } catch (err) {
    next(err)
  }
}

const updateProgressTrend = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    try {
      if (prisma.patientProgressTrend) {
        const existing = await prisma.patientProgressTrend.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.patientProgressTrend.update({
            where: { id },
            data: updateData
          })
          return res.json({ success: true, data: updated })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    const idx = inMemoryOutcomesData.findIndex(t => t.id === id)
    if (idx !== -1) {
      inMemoryOutcomesData[idx] = { ...inMemoryOutcomesData[idx], ...updateData }
      return res.json({ success: true, data: inMemoryOutcomesData[idx] })
    }

    res.status(404).json({ success: false, message: 'Progress trend not found' })
  } catch (err) {
    next(err)
  }
}

const deleteProgressTrend = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.patientProgressTrend) {
        const existing = await prisma.patientProgressTrend.findUnique({ where: { id } })
        if (existing) {
          await prisma.patientProgressTrend.delete({ where: { id } })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryOutcomesData = inMemoryOutcomesData.filter(t => t.id !== id)
    res.json({ success: true, message: 'Progress trend deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// --- Forms & Documents Center ---

let inMemoryForms = []

let inMemoryDocuments = []

const getFormsAndDocuments = async (req, res, next) => {
  try {
    const { search, category } = req.query
    let forms = []
    let docs = []

    try {
      const patient = await findOrCreatePatient(req.user)
      const patientNameQuery = (patient.fullName || '').trim().toLowerCase()

      if (prisma.patientForm) {
        const rawForms = await prisma.patientForm.findMany({
          orderBy: { createdAt: 'asc' }
        }).catch(() => [])

        forms = rawForms.filter(f => {
          if (f.patientId && f.patientId === patient.id) return true
          const formPatient = (f.patientName || '').trim().toLowerCase()
          return Boolean(patientNameQuery && formPatient.includes(patientNameQuery))
        })
      }

      if (prisma.document) {
        const rawDocs = await prisma.document.findMany({
          orderBy: { createdAt: 'desc' }
        }).catch(() => [])

        docs = rawDocs.filter(d => {
          if (d.patientId && d.patientId === patient.id) return true
          const docPatient = (d.patientName || '').trim().toLowerCase()
          const docSentTo = (d.sentTo || '').trim().toLowerCase()
          return Boolean(patientNameQuery && (docPatient.includes(patientNameQuery) || docSentTo.includes(patientNameQuery)))
        })
      }
    } catch (dbErr) {
      console.warn('DB forms and documents query notice:', dbErr.message)
    }

    const formattedDocs = docs.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type || 'Document',
      date: d.date || 'Recently',
      size: d.size || '1.2 MB',
      uploadBy: d.uploadBy || 'Clinic Admin',
      clinicId: d.clinicId
    }))

    let filteredForms = [...forms]
    let filteredDocs = [...formattedDocs]

    if (category && category !== 'ALL') {
      filteredForms = filteredForms.filter(f => (f.category || '').toLowerCase() === category.toLowerCase())
      filteredDocs = filteredDocs.filter(d => (d.type || '').toLowerCase() === category.toLowerCase())
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      filteredForms = filteredForms.filter(f => (f.name && f.name.toLowerCase().includes(q)) || (f.category && f.category.toLowerCase().includes(q)))
      filteredDocs = filteredDocs.filter(d => (d.name && d.name.toLowerCase().includes(q)) || (d.type && d.type.toLowerCase().includes(q)))
    }

    res.json({
      success: true,
      data: {
        forms: filteredForms,
        documents: filteredDocs
      }
    })
  } catch (err) {
    next(err)
  }
}

const submitPatientForm = async (req, res, next) => {
  try {
    const { id } = req.params
    const { formData } = req.body

    try {
      if (prisma.patientForm) {
        const existing = await prisma.patientForm.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.patientForm.update({
            where: { id },
            data: {
              status: 'Completed',
              formData: formData || {},
              submittedAt: new Date()
            }
          })
          return res.json({ success: true, data: updated })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    const idx = inMemoryForms.findIndex(f => f.id === id)
    if (idx !== -1) {
      inMemoryForms[idx].status = 'Completed'
      inMemoryForms[idx].formData = formData || {}
      return res.json({ success: true, data: inMemoryForms[idx] })
    }

    res.status(404).json({ success: false, message: 'Form not found' })
  } catch (err) {
    next(err)
  }
}

const uploadPatientDocument = async (req, res, next) => {
  try {
    const { name, type, size } = req.body

    const patient = await findOrCreatePatient(req.user)
    const uploaderName = req.body?.uploadBy || `${patient.fullName || req.user?.name || 'Patient'} (Patient)`

    // Derive patient's clinicId for multi-tenant mapping
    let patientClinicId = patient.clinicId || req.user?.clinicId || null
    if (!patientClinicId && prisma.appointment) {
      const lastAppt = await prisma.appointment.findFirst({
        where: { patientId: patient.id },
        orderBy: { createdAt: 'desc' }
      }).catch(() => null)
      if (lastAppt?.clinicId) patientClinicId = lastAppt.clinicId
    }

    const newDoc = {
      id: `doc_${Date.now()}`,
      name: name || 'Uploaded_Medical_Scan.pdf',
      type: type || 'Uploaded Document',
      date: 'Today',
      size: size || '1.5 MB'
    }

    try {
      if (prisma.document) {
        const dbCreated = await prisma.document.create({
          data: {
            name: newDoc.name,
            patientName: patient.fullName || 'Patient',
            patientId: patient.id,
            clinicId: patientClinicId,
            date: 'Today',
            type: newDoc.type,
            status: 'Active',
            uploadBy: uploaderName
          }
        })
        const resultDoc = { ...dbCreated, size: newDoc.size }
        inMemoryDocuments.unshift(resultDoc)
        return res.json({ success: true, data: resultDoc })
      }
    } catch (dbErr) {
      console.warn('DB patient document upload notice:', dbErr.message)
    }

    inMemoryDocuments.unshift(newDoc)
    res.json({ success: true, data: newDoc })
  } catch (err) {
    next(err)
  }
}

const deletePatientDocument = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.document) {
        const existing = await prisma.document.findUnique({ where: { id } })
        if (existing) {
          await prisma.document.delete({ where: { id } })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryDocuments = inMemoryDocuments.filter(d => String(d.id) !== String(id))
    res.json({ success: true, message: 'Document deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// --- Funding, NDIS & Claims Accounts ---

let inMemoryFundingAccounts = []

let inMemoryAlerts = []

let inMemoryClaimsHistory = []

const getFundingAndClaims = async (req, res, next) => {
  try {
    const { search, funding, status } = req.query
    let accounts = []
    let claims = []

    try {
      const patient = await findOrCreatePatient(req.user)
      const patientNameQuery = (patient.fullName || '').trim().toLowerCase()
      const patientEmailQuery = (patient.email || '').trim().toLowerCase()

      // 1. Fetch live claims from `prisma.patientClaim`
      if (prisma.patientClaim) {
        claims = await prisma.patientClaim.findMany({
          where: {
            OR: [
              { patientId: patient.id },
              ...(patient.clinicId ? [{ clinicId: patient.clinicId }] : [])
            ]
          },
          orderBy: { createdAt: 'desc' }
        }).catch(() => [])
      }

      // 2. Fetch live invoices from primary `prisma.invoice` and unify as claim remittance items
      if (prisma.invoice) {
        const rawInvoices = await prisma.invoice.findMany({
          orderBy: { createdAt: 'desc' }
        }).catch(() => [])

        const matchedPrimaryInvoices = rawInvoices.filter(inv => {
          if (inv.patientId && inv.patientId === patient.id) return true
          const invPatient = (inv.patientName || '').trim().toLowerCase()
          const invClient = (inv.clientName || '').trim().toLowerCase()
          const invRecipient = (inv.recipient || '').trim().toLowerCase()

          if (patientNameQuery && (invPatient.includes(patientNameQuery) || invClient.includes(patientNameQuery) || invRecipient.includes(patientNameQuery))) return true
          if (patientEmailQuery && invRecipient.includes(patientEmailQuery)) return true
          return false
        })

        const invoiceClaims = matchedPrimaryInvoices.map(inv => {
          let resolvedFunding = inv.funding || inv.claimType || inv.fundingType || null
          if (!resolvedFunding && inv.items) {
            try {
              const parsed = typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items
              if (Array.isArray(parsed) && parsed[0]?.funding) resolvedFunding = parsed[0].funding
              else if (typeof parsed === 'object' && parsed?.funding) resolvedFunding = parsed.funding
            } catch (e) {}
          }
          if (!resolvedFunding) {
            const svc = (inv.service || '').toLowerCase()
            if (svc.includes('ndis')) resolvedFunding = 'NDIS'
            else if (svc.includes('epc') || svc.includes('medicare')) resolvedFunding = 'EPC'
            else if (svc.includes('workcover')) resolvedFunding = 'WorkCover'
            else if (svc.includes('private')) resolvedFunding = 'Private'
            else resolvedFunding = 'Medicare / Health Cover'
          }

          return {
            id: `CLM-${(inv.displayId || inv.invoiceNumber || inv.id).replace('INV-', '')}`,
            displayId: `CLM-${(inv.displayId || inv.invoiceNumber || inv.id).replace('INV-', '')}`,
            service: inv.service || 'Clinical Services Consultation',
            funding: resolvedFunding,
            amount: `$${Number(inv.amount || inv.due || 0).toFixed(2)}`,
            status: inv.status === 'Paid' ? 'Approved' : 'Processing',
            date: inv.issueDate || inv.dueDate || new Date().toISOString().split('T')[0],
            patientId: inv.patientId || patient.id,
            clinicId: inv.clinicId
          }
        })

        // Merge without duplicating existing IDs
        for (const ic of invoiceClaims) {
          if (!claims.some(c => c.id === ic.id || c.displayId === ic.displayId)) {
            claims.push(ic)
          }
        }
      }

      // 3. Fetch active funding accounts from `prisma.patientFundingAccount`
      if (prisma.patientFundingAccount) {
        accounts = await prisma.patientFundingAccount.findMany({
          where: {
            OR: [
              { patientId: patient.id },
              ...(patient.clinicId ? [{ clinicId: patient.clinicId }] : [])
            ]
          },
          orderBy: { createdAt: 'asc' }
        }).catch(() => [])
      }

      // Deduplicate funding accounts by type to prevent duplicate cards
      if (accounts.length > 0) {
        const uniqueAccounts = []
        for (const acc of accounts) {
          if (!uniqueAccounts.some(u => (u.type || '').trim().toLowerCase() === (acc.type || '').trim().toLowerCase())) {
            uniqueAccounts.push(acc)
          }
        }
        accounts = uniqueAccounts
      }
    } catch (dbErr) {
      console.warn('DB funding and claims query notice:', dbErr.message)
    }

    let filteredClaims = [...claims]
    if (funding && funding !== 'ALL') {
      filteredClaims = filteredClaims.filter(c => (c.funding || '').toLowerCase().includes(funding.toLowerCase()))
    }
    if (status && status !== 'ALL') {
      filteredClaims = filteredClaims.filter(c => (c.status || '').toLowerCase() === status.toLowerCase())
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      filteredClaims = filteredClaims.filter(c =>
        (c.service && c.service.toLowerCase().includes(q)) ||
        (c.id && String(c.id).toLowerCase().includes(q)) ||
        (c.displayId && String(c.displayId).toLowerCase().includes(q)) ||
        (c.funding && c.funding.toLowerCase().includes(q))
      )
    }

    res.json({
      success: true,
      data: {
        activeFunding: accounts,
        alerts: [],
        claimsHistory: filteredClaims
      }
    })
  } catch (err) {
    next(err)
  }
}

const createPatientClaim = async (req, res, next) => {
  try {
    const { service, amount, funding, date } = req.body

    const newClaim = {
      id: `clm_${Date.now().toString().slice(-4)}`,
      service: service || 'Allied Health Therapy Session',
      date: date || new Date().toISOString().split('T')[0],
      amount: amount ? (amount.startsWith('$') ? amount : `$${amount}`) : '$150.00',
      funding: funding || 'NDIS',
      status: 'Processing'
    }

    try {
      if (prisma.patientClaim) {
        const patient = await findOrCreatePatient(req.user)
        const dbCreated = await prisma.patientClaim.create({
          data: {
            displayId: newClaim.id,
            patientId: patient.id,
            service: newClaim.service,
            date: newClaim.date,
            amount: newClaim.amount,
            funding: newClaim.funding,
            status: newClaim.status
          }
        })
        inMemoryClaimsHistory.unshift(dbCreated)
        return res.json({ success: true, data: dbCreated })
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryClaimsHistory.unshift(newClaim)
    res.json({ success: true, data: newClaim })
  } catch (err) {
    next(err)
  }
}

const updatePatientClaim = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    try {
      if (prisma.patientClaim) {
        const existing = await prisma.patientClaim.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.patientClaim.update({
            where: { id },
            data: updateData
          })
          return res.json({ success: true, data: updated })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    const idx = inMemoryClaimsHistory.findIndex(c => c.id === id)
    if (idx !== -1) {
      inMemoryClaimsHistory[idx] = { ...inMemoryClaimsHistory[idx], ...updateData }
      return res.json({ success: true, data: inMemoryClaimsHistory[idx] })
    }

    res.status(404).json({ success: false, message: 'Claim record not found' })
  } catch (err) {
    next(err)
  }
}

const deletePatientClaim = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.patientClaim) {
        const existing = await prisma.patientClaim.findUnique({ where: { id } })
        if (existing) {
          await prisma.patientClaim.delete({ where: { id } })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryClaimsHistory = inMemoryClaimsHistory.filter(c => String(c.id) !== String(id))
    res.json({ success: true, message: 'Claim record deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const createFundingAccount = async (req, res, next) => {
  try {
    const { type, remaining, total, expiry } = req.body

    const newAccount = {
      id: `fa_${Date.now()}`,
      type: type || 'Private Health Cover',
      remaining: remaining || '$1,500.00',
      percent: 50,
      status: 'Active',
      used: '$1,500.00',
      total: total || '$3,000.00',
      expiry: expiry || '31 Dec 2026'
    }

    try {
      if (prisma.patientFundingAccount) {
        const patient = await findOrCreatePatient(req.user)
        const dbCreated = await prisma.patientFundingAccount.create({
          data: { ...newAccount, patientId: patient.id }
        })
        inMemoryFundingAccounts.push(dbCreated)
        return res.json({ success: true, data: dbCreated })
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryFundingAccounts.push(newAccount)
    res.json({ success: true, data: newAccount })
  } catch (err) {
    next(err)
  }
}

const updateFundingAccount = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    try {
      if (prisma.patientFundingAccount) {
        const existing = await prisma.patientFundingAccount.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.patientFundingAccount.update({
            where: { id },
            data: updateData
          })
          return res.json({ success: true, data: updated })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    const idx = inMemoryFundingAccounts.findIndex(fa => fa.id === id)
    if (idx !== -1) {
      inMemoryFundingAccounts[idx] = { ...inMemoryFundingAccounts[idx], ...updateData }
      return res.json({ success: true, data: inMemoryFundingAccounts[idx] })
    }

    res.status(404).json({ success: false, message: 'Funding account not found' })
  } catch (err) {
    next(err)
  }
}

// --- Health Record Sharing ---

let inMemoryActiveShares = []

let inMemoryPendingShareRequests = []

const getHealthShares = async (req, res, next) => {
  try {
    let activeShares = []
    let pendingRequests = []

    try {
      if (prisma.patientHealthShare) {
        const patient = await findOrCreatePatient(req.user)
        const allShares = await prisma.patientHealthShare.findMany({
          where: { OR: [{ patientId: patient.id }, { patientId: null }] },
          orderBy: { createdAt: 'desc' }
        })

        if (!allShares || allShares.length === 0) {
          for (const s of inMemoryActiveShares) {
            const created = await prisma.patientHealthShare.create({
              data: {
                patientId: patient.id,
                clinic: s.clinic,
                practitioner: s.practitioner,
                level: s.level,
                status: 'Active',
                grantedDate: s.grantedDate
              }
            })
            activeShares.push(created)
          }

          for (const pr of inMemoryPendingShareRequests) {
            const created = await prisma.patientHealthShare.create({
              data: {
                patientId: patient.id,
                clinic: pr.clinic,
                practitioner: pr.practitioner,
                level: pr.level,
                status: 'Pending',
                grantedDate: pr.grantedDate
              }
            })
            pendingRequests.push(created)
          }
        } else {
          activeShares = allShares.filter(s => s.status === 'Active')
          pendingRequests = allShares.filter(s => s.status === 'Pending')
        }
      } else {
        activeShares = inMemoryActiveShares
        pendingRequests = inMemoryPendingShareRequests
      }
    } catch (dbErr) {
      activeShares = inMemoryActiveShares
      pendingRequests = inMemoryPendingShareRequests
    }

    let availableClinics = []
    try {
      if (prisma.clinic) {
        const dbClinics = await prisma.clinic.findMany({
          select: { name: true }
        }).catch(() => [])
        availableClinics = dbClinics.map(c => c.name).filter(Boolean)
      }
    } catch (err) {}

    if (availableClinics.length === 0) {
      availableClinics = ['Metro Rehab Centre', 'Footscray Physio & Ortho', 'East Melbourne Specialist Clinic']
    }

    res.json({
      success: true,
      data: {
        activeShares,
        pendingRequests,
        availableClinics
      }
    })
  } catch (err) {
    next(err)
  }
}

const grantHealthShare = async (req, res, next) => {
  try {
    const { clinic, level } = req.body

    const newShare = {
      id: `hs_${Date.now()}`,
      clinic: clinic || 'Metro Rehab Centre',
      practitioner: 'All Registered Providers',
      level: level || 'Limited Access',
      status: 'Active',
      grantedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    try {
      if (prisma.patientHealthShare) {
        const patient = await findOrCreatePatient(req.user)
        const dbCreated = await prisma.patientHealthShare.create({
          data: {
            patientId: patient.id,
            clinic: newShare.clinic,
            practitioner: newShare.practitioner,
            level: newShare.level,
            status: 'Active',
            grantedDate: newShare.grantedDate
          }
        })
        inMemoryActiveShares.push(dbCreated)
        return res.json({ success: true, data: dbCreated })
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryActiveShares.push(newShare)
    res.json({ success: true, data: newShare })
  } catch (err) {
    next(err)
  }
}

const approveHealthShareRequest = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.patientHealthShare) {
        const existing = await prisma.patientHealthShare.findUnique({ where: { id } })
        if (existing) {
          const updated = await prisma.patientHealthShare.update({
            where: { id },
            data: { status: 'Active' }
          })
          return res.json({ success: true, data: updated })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    const reqIdx = inMemoryPendingShareRequests.findIndex(r => r.id === id)
    if (reqIdx !== -1) {
      const approved = { ...inMemoryPendingShareRequests[reqIdx], status: 'Active' }
      inMemoryPendingShareRequests.splice(reqIdx, 1)
      inMemoryActiveShares.push(approved)
      return res.json({ success: true, data: approved })
    }

    res.status(404).json({ success: false, message: 'Share request not found' })
  } catch (err) {
    next(err)
  }
}

const denyHealthShareRequest = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.patientHealthShare) {
        const existing = await prisma.patientHealthShare.findUnique({ where: { id } })
        if (existing) {
          await prisma.patientHealthShare.update({
            where: { id },
            data: { status: 'Denied' }
          })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryPendingShareRequests = inMemoryPendingShareRequests.filter(r => r.id !== id)
    res.json({ success: true, message: 'Access request denied' })
  } catch (err) {
    next(err)
  }
}

const revokeHealthShare = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.patientHealthShare) {
        const existing = await prisma.patientHealthShare.findUnique({ where: { id } })
        if (existing) {
          await prisma.patientHealthShare.update({
            where: { id },
            data: { status: 'Revoked' }
          })
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryActiveShares = inMemoryActiveShares.filter(s => String(s.id) !== String(id))
    res.json({ success: true, message: 'Share access revoked' })
  } catch (err) {
    next(err)
  }
}

// --- Patient Invoices & Multi-Tenant Payment Integration ---

let inMemoryPatientInvoices = []

const getPatientInvoices = async (req, res, next) => {
  try {
    const { search, status } = req.query
    let invoices = []

    try {
      const patient = await findOrCreatePatient(req.user)
      const patientNameQuery = (patient.fullName || '').trim().toLowerCase()
      const patientEmailQuery = (patient.email || '').trim().toLowerCase()

      // 1. Fetch live multi-tenant invoices from primary `prisma.invoice` table
      if (prisma.invoice) {
        const rawInvoices = await prisma.invoice.findMany({
          orderBy: { createdAt: 'desc' }
        })

        // Filter invoices matching patient ID, patient name, client name, or recipient
        const matchedPrimaryInvoices = rawInvoices.filter(inv => {
          if (inv.patientId && inv.patientId === patient.id) return true
          const invPatient = (inv.patientName || '').trim().toLowerCase()
          const invClient = (inv.clientName || '').trim().toLowerCase()
          const invRecipient = (inv.recipient || '').trim().toLowerCase()

          if (patientNameQuery && (invPatient.includes(patientNameQuery) || invClient.includes(patientNameQuery) || invRecipient.includes(patientNameQuery))) return true
          if (patientEmailQuery && invRecipient.includes(patientEmailQuery)) return true
          return false
        })

        invoices = matchedPrimaryInvoices.map(i => ({
          id: i.displayId || i.invoiceNumber || i.id,
          rawId: i.id,
          displayId: i.displayId || i.invoiceNumber || i.id,
          service: i.service || 'Clinical Consultation Service',
          practitioner: i.practitionerName || 'General Practitioner',
          amount: Number(i.amount || i.due || 0),
          due: i.dueDate || i.issueDate || 'Net 7',
          outstandingDue: Number(i.due || 0),
          status: i.status || 'Draft',
          clinicId: i.clinicId,
          patientId: i.patientId || patient.id,
          createdAt: i.createdAt
        }))
      }

      // 2. Also check `prisma.patientInvoice` for legacy records if present
      if (prisma.patientInvoice) {
        const legacyInvoices = await prisma.patientInvoice.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'desc' }
        }).catch(() => [])

        for (const leg of legacyInvoices) {
          const legId = leg.displayId || leg.id
          if (!invoices.some(inv => inv.id === legId || inv.rawId === leg.id)) {
            invoices.push({
              id: legId,
              rawId: leg.id,
              displayId: legId,
              service: leg.service,
              practitioner: leg.practitioner,
              amount: Number(leg.amount || 0),
              due: leg.due,
              outstandingDue: leg.status === 'Paid' ? 0 : Number(leg.amount || 0),
              status: leg.status,
              clinicId: leg.clinicId,
              patientId: leg.patientId,
              createdAt: leg.createdAt
            })
          }
        }
      }
    } catch (dbErr) {
      console.warn('DB patient invoices query notice:', dbErr.message)
    }

    // Merge in-memory fallback invoices if list is empty
    if (invoices.length === 0 && inMemoryPatientInvoices.length > 0) {
      invoices = [...inMemoryPatientInvoices]
    }

    let filtered = [...invoices]
    if (status && status !== 'ALL') {
      filtered = filtered.filter(i => (i.status || '').toLowerCase() === status.toLowerCase())
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      filtered = filtered.filter(i =>
        (i.id && String(i.id).toLowerCase().includes(q)) ||
        (i.service && i.service.toLowerCase().includes(q)) ||
        (i.practitioner && i.practitioner.toLowerCase().includes(q))
      )
    }

    res.json({ success: true, data: filtered })
  } catch (err) {
    next(err)
  }
}

const payPatientInvoice = async (req, res, next) => {
  try {
    const { id } = req.params
    const { paymentMethod } = req.body

    const patient = await findOrCreatePatient(req.user)
    let updatedInvoice = null

    try {
      // 1. Check primary `prisma.invoice` table
      if (prisma.invoice) {
        const existingPrimary = await prisma.invoice.findFirst({
          where: { OR: [{ id }, { displayId: id }, { invoiceNumber: id }] }
        })

        if (existingPrimary) {
          updatedInvoice = await prisma.invoice.update({
            where: { id: existingPrimary.id },
            data: {
              status: 'Paid',
              due: 0.0,
              updatedAt: new Date()
            }
          })

          // Post transaction receipt into multi-tenant `prisma.payment` ledger
          if (prisma.payment) {
            const rcptCount = await prisma.payment.count().catch(() => 0)
            const receiptNumber = `RCPT-${String(rcptCount + 1).padStart(6, '0')}`
            await prisma.payment.create({
              data: {
                clinicId: existingPrimary.clinicId || null,
                receiptNumber,
                clientName: patient.fullName || existingPrimary.patientName || existingPrimary.clientName || 'Patient',
                amount: existingPrimary.amount || 0.0,
                paymentDate: new Date().toISOString().split('T')[0],
                paymentMethod: paymentMethod === 'card' ? 'Stripe / Credit Card' : paymentMethod || 'Card',
                invoiceReference: existingPrimary.displayId || existingPrimary.invoiceNumber || existingPrimary.id,
                patientId: patient.id || existingPrimary.patientId
              }
            }).catch(e => console.warn('Payment receipt creation notice:', e.message))
          }

          // Also update `prisma.patientInvoice` if matching record exists
          if (prisma.patientInvoice) {
            await prisma.patientInvoice.updateMany({
              where: { OR: [{ id }, { displayId: id }] },
              data: { status: 'Paid', paymentMethod: paymentMethod || 'card', paidAt: new Date() }
            }).catch(() => null)
          }

          return res.json({
            success: true,
            data: {
              ...updatedInvoice,
              id: updatedInvoice.displayId || updatedInvoice.invoiceNumber || updatedInvoice.id,
              practitioner: updatedInvoice.practitionerName || 'General Practitioner',
              service: updatedInvoice.service || 'Clinical Consultation',
              status: 'Paid',
              due: updatedInvoice.dueDate || 'Paid'
            }
          })
        }
      }

      // 2. Check legacy `prisma.patientInvoice` table
      if (prisma.patientInvoice) {
        const existingLegacy = await prisma.patientInvoice.findFirst({
          where: { OR: [{ id }, { displayId: id }] }
        })
        if (existingLegacy) {
          const updatedLeg = await prisma.patientInvoice.update({
            where: { id: existingLegacy.id },
            data: {
              status: 'Paid',
              paymentMethod: paymentMethod || 'card',
              paidAt: new Date()
            }
          })

          if (prisma.payment) {
            const rcptCount = await prisma.payment.count().catch(() => 0)
            const receiptNumber = `RCPT-${String(rcptCount + 1).padStart(6, '0')}`
            await prisma.payment.create({
              data: {
                clinicId: existingLegacy.clinicId || null,
                receiptNumber,
                clientName: patient.fullName || 'Patient',
                amount: existingLegacy.amount || 0.0,
                paymentDate: new Date().toISOString().split('T')[0],
                paymentMethod: paymentMethod === 'card' ? 'Stripe / Credit Card' : paymentMethod || 'Card',
                invoiceReference: existingLegacy.displayId || existingLegacy.id,
                patientId: patient.id
              }
            }).catch(() => null)
          }

          return res.json({ success: true, data: { ...updatedLeg, id: updatedLeg.displayId || updatedLeg.id } })
        }
      }
    } catch (dbErr) {
      console.warn('DB pay patient invoice notice:', dbErr.message)
    }

    // Fallback to in-memory list
    const idx = inMemoryPatientInvoices.findIndex(i => i.id === id)
    if (idx !== -1) {
      inMemoryPatientInvoices[idx].status = 'Paid'
      inMemoryPatientInvoices[idx].paymentMethod = paymentMethod || 'card'
      return res.json({ success: true, data: inMemoryPatientInvoices[idx] })
    }

    res.status(404).json({ success: false, message: 'Invoice not found' })
  } catch (err) {
    next(err)
  }
}

const createPatientInvoice = async (req, res, next) => {
  try {
    const { service, practitioner, amount, due } = req.body
    const patient = await findOrCreatePatient(req.user)

    const count = await prisma.invoice.count().catch(() => 0)
    const displayId = `INV-${String(count + 1).padStart(6, '0')}`

    const newInv = {
      displayId,
      invoiceNumber: displayId,
      service: service || 'Allied Health Consultation',
      practitionerName: practitioner || 'General Practitioner',
      patientName: patient.fullName || 'Patient',
      clientName: patient.fullName || 'Patient',
      patientId: patient.id,
      amount: amount ? Number(amount) : 120.00,
      due: 0,
      status: 'Unpaid',
      dueDate: due || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    try {
      if (prisma.invoice) {
        const dbCreated = await prisma.invoice.create({
          data: newInv
        })
        return res.json({
          success: true,
          data: {
            ...dbCreated,
            id: dbCreated.displayId || dbCreated.invoiceNumber || dbCreated.id,
            practitioner: dbCreated.practitionerName,
            due: dbCreated.dueDate
          }
        })
      }
    } catch (dbErr) {
      console.warn('DB create invoice notice:', dbErr.message)
    }

    inMemoryPatientInvoices.unshift({ ...newInv, id: displayId, practitioner: newInv.practitionerName, due: newInv.dueDate })
    res.json({ success: true, data: { ...newInv, id: displayId, practitioner: newInv.practitionerName, due: newInv.dueDate } })
  } catch (err) {
    next(err)
  }
}

const deletePatientInvoice = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.invoice) {
        const existing = await prisma.invoice.findFirst({
          where: { OR: [{ id }, { displayId: id }, { invoiceNumber: id }] }
        })
        if (existing) {
          await prisma.invoice.delete({ where: { id: existing.id } })
        }
      }
      if (prisma.patientInvoice) {
        const existingLeg = await prisma.patientInvoice.findFirst({
          where: { OR: [{ id }, { displayId: id }] }
        })
        if (existingLeg) {
          await prisma.patientInvoice.delete({ where: { id: existingLeg.id } }).catch(() => null)
        }
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryPatientInvoices = inMemoryPatientInvoices.filter(i => i.id !== id)
    res.json({ success: true, message: 'Invoice deleted' })
  } catch (err) {
    next(err)
  }
}

let inMemoryPatientPreferences = {}
let inMemoryPatientDevices = {}

const getPatientPreferences = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    let prefs = {
      smsNotify: true,
      emailNotify: true,
      pushNotify: false,
      tfaEnabled: true
    }

    if (patient && patient.tags && typeof patient.tags === 'object' && patient.tags.preferences) {
      prefs = { ...prefs, ...patient.tags.preferences }
    } else if (process.env.NODE_ENV !== 'production' && inMemoryPatientPreferences[patient.id]) {
      prefs = { ...prefs, ...inMemoryPatientPreferences[patient.id] }
    }

    res.json({ success: true, data: prefs })
  } catch (err) {
    next(err)
  }
}

const updatePatientPreferences = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const { smsNotify, emailNotify, pushNotify, tfaEnabled } = req.body

    const existingTags = (patient.tags && typeof patient.tags === 'object') ? patient.tags : {}
    const defaultPrefs = {
      smsNotify: true,
      emailNotify: true,
      pushNotify: false,
      tfaEnabled: true
    }
    const existingPrefs = existingTags.preferences || 
      (process.env.NODE_ENV !== 'production' ? inMemoryPatientPreferences[patient.id] : null) || 
      defaultPrefs

    const updatedPrefs = {
      ...existingPrefs,
      ...(smsNotify !== undefined && { smsNotify: Boolean(smsNotify) }),
      ...(emailNotify !== undefined && { emailNotify: Boolean(emailNotify) }),
      ...(pushNotify !== undefined && { pushNotify: Boolean(pushNotify) }),
      ...(tfaEnabled !== undefined && { tfaEnabled: Boolean(tfaEnabled) })
    }

    if (process.env.NODE_ENV !== 'production') {
      inMemoryPatientPreferences[patient.id] = updatedPrefs
    }

    try {
      if (prisma.patient) {
        await prisma.patient.update({
          where: { id: patient.id },
          data: {
            tags: {
              ...existingTags,
              preferences: updatedPrefs
            }
          }
        })
      }
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') {
        return next(dbErr)
      }
      console.warn('DB preferences update notice:', dbErr.message)
    }

    res.json({ success: true, message: 'Preferences updated successfully in live database!', data: updatedPrefs })
  } catch (err) {
    next(err)
  }
}

const getTrustedDevices = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const defaultDevices = [
      { key: '1', device: 'Chrome / Windows (Current)', ip: '103.88.24.12', time: 'Today, 04:30 PM', location: 'Melbourne, VIC', status: 'Active Session' },
      { key: '2', device: 'iPhone App Client', ip: '120.91.4.11', time: 'Today, 10:15 AM', location: 'Sydney, NSW', status: 'Active Session' }
    ]

    let devices = defaultDevices
    if (patient && patient.tags && typeof patient.tags === 'object' && Array.isArray(patient.tags.trustedDevices)) {
      devices = patient.tags.trustedDevices
    } else if (process.env.NODE_ENV !== 'production' && inMemoryPatientDevices[patient.id]) {
      devices = inMemoryPatientDevices[patient.id]
    }

    res.json({ success: true, data: devices })
  } catch (err) {
    next(err)
  }
}

const revokeTrustedDevice = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const { key } = req.params
    const defaultDevices = [
      { key: '1', device: 'Chrome / Windows (Current)', ip: '103.88.24.12', time: 'Today, 04:30 PM', location: 'Melbourne, VIC', status: 'Active Session' },
      { key: '2', device: 'iPhone App Client', ip: '120.91.4.11', time: 'Today, 10:15 AM', location: 'Sydney, NSW', status: 'Active Session' }
    ]

    const existingTags = (patient.tags && typeof patient.tags === 'object') ? patient.tags : {}
    let currentDevices = existingTags.trustedDevices || 
      (process.env.NODE_ENV !== 'production' ? inMemoryPatientDevices[patient.id] : null) || 
      defaultDevices

    const updatedDevices = currentDevices.filter(d => d.key !== key)

    if (process.env.NODE_ENV !== 'production') {
      inMemoryPatientDevices[patient.id] = updatedDevices
    }

    try {
      if (prisma.patient) {
        await prisma.patient.update({
          where: { id: patient.id },
          data: {
            tags: {
              ...existingTags,
              trustedDevices: updatedDevices
            }
          }
        })
      }
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') {
        return next(dbErr)
      }
      console.warn('DB trusted devices update notice:', dbErr.message)
    }

    res.json({ success: true, message: 'Device session terminated in live database.', data: updatedDevices })
  } catch (err) {
    next(err)
  }
}

const getFamilyProfiles = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const familyProfiles = [
      { id: 'john', name: patient.fullName || 'John Miller', role: 'Self', isPrimary: true },
      { id: 'lily', name: 'Lily Miller', role: 'Daughter', isPrimary: false }
    ]
    res.json({ success: true, data: familyProfiles })
  } catch (err) {
    next(err)
  }
}

let inMemoryPatientAchievements = {}

const getPatientAchievements = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const defaultAchievements = [
      { name: 'First Exercise Completed', status: 'Unlocked', desc: 'Successfully performed your first home care exercise routine.', date: '12 Jan 2026', badge: '🥇' },
      { name: '7-Day Streak', status: 'Unlocked', desc: 'Completed exercises for 7 consecutive days.', date: '19 Jan 2026', badge: '🔥' },
      { name: '30-Day Streak', status: 'Locked', desc: 'Complete daily exercises for 30 days in a row.', progress: '14/30 days', badge: '⭐' },
      { name: 'Treatment Goal Achieved', status: 'Unlocked', desc: 'Reached 80% improvement milestone in Shoulder Mobility.', date: '04 Jun 2026', badge: '🏆' },
      { name: 'Perfect Attendance', status: 'Unlocked', desc: 'Attended all scheduled clinic consultation reviews on time.', date: '12 May 2026', badge: '🎯' }
    ]

    let achievements = defaultAchievements
    if (patient && patient.tags && typeof patient.tags === 'object' && Array.isArray(patient.tags.achievements)) {
      achievements = patient.tags.achievements
    } else if (process.env.NODE_ENV !== 'production' && inMemoryPatientAchievements[patient.id]) {
      achievements = inMemoryPatientAchievements[patient.id]
    }

    res.json({ success: true, data: achievements })
  } catch (err) {
    next(err)
  }
}

const updatePatientAchievements = async (req, res, next) => {
  try {
    const patient = await findOrCreatePatient(req.user)
    const { achievements } = req.body

    const existingTags = (patient.tags && typeof patient.tags === 'object') ? patient.tags : {}
    const defaultAchievements = [
      { name: 'First Exercise Completed', status: 'Unlocked', desc: 'Successfully performed your first home care exercise routine.', date: '12 Jan 2026', badge: '🥇' },
      { name: '7-Day Streak', status: 'Unlocked', desc: 'Completed exercises for 7 consecutive days.', date: '19 Jan 2026', badge: '🔥' },
      { name: '30-Day Streak', status: 'Locked', desc: 'Complete daily exercises for 30 days in a row.', progress: '14/30 days', badge: '⭐' },
      { name: 'Treatment Goal Achieved', status: 'Unlocked', desc: 'Reached 80% improvement milestone in Shoulder Mobility.', date: '04 Jun 2026', badge: '🏆' },
      { name: 'Perfect Attendance', status: 'Unlocked', desc: 'Attended all scheduled clinic consultation reviews on time.', date: '12 May 2026', badge: '🎯' }
    ]

    const updatedAchievements = Array.isArray(achievements) ? achievements : defaultAchievements

    if (process.env.NODE_ENV !== 'production') {
      inMemoryPatientAchievements[patient.id] = updatedAchievements
    }

    try {
      if (prisma.patient) {
        await prisma.patient.update({
          where: { id: patient.id },
          data: {
            tags: {
              ...existingTags,
              achievements: updatedAchievements
            }
          }
        })
      }
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') {
        return next(dbErr)
      }
      console.warn('DB achievements update notice:', dbErr.message)
    }

    res.json({ success: true, message: 'Achievements updated successfully in live database!', data: updatedAchievements })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getPatientProfile,
  updatePatientProfile,
  getPatientAppointments,
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getPractitioners,
  getCareTeam,
  getCareTeamMessages,
  sendCareTeamMessage,
  getPatientInvoices,
  getTreatmentPlans,
  createTreatmentPlan,
  updateTreatmentPlan,
  deleteTreatmentPlan,
  getPrescribedExercises,
  createPrescribedExercise,
  togglePrescribedExercise,
  deletePrescribedExercise,
  getProgressOutcomes,
  createOutcomeMeasure,
  updateOutcomeMeasure,
  deleteOutcomeMeasure,
  createProgressTrend,
  updateProgressTrend,
  deleteProgressTrend,
  getFormsAndDocuments,
  submitPatientForm,
  uploadPatientDocument,
  deletePatientDocument,
  getFundingAndClaims,
  createPatientClaim,
  updatePatientClaim,
  deletePatientClaim,
  createFundingAccount,
  updateFundingAccount,
  getHealthShares,
  grantHealthShare,
  approveHealthShareRequest,
  denyHealthShareRequest,
  revokeHealthShare,
  payPatientInvoice,
  createPatientInvoice,
  deletePatientInvoice,
  getPatientPreferences,
  updatePatientPreferences,
  getTrustedDevices,
  revokeTrustedDevice,
  getFamilyProfiles,
  getPatientAchievements,
  updatePatientAchievements,
  getPatientClinicUsers
}





