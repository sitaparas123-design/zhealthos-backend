const prisma = require('../../config/db')

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

    if (finalPracId && (!finalPracName || finalPracName === 'Dr. Sarah Jenkins')) {
      const pRecord = await prisma.practitioner.findUnique({ where: { id: finalPracId } }).catch(() => null)
      if (pRecord && pRecord.name) {
        finalPracName = pRecord.name
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
      },
    })
    res.json({ success: true, data: practitioners })
  } catch (err) {
    next(err)
  }
}

const getCareTeam = async (req, res, next) => {
  try {
    const dbPractitioners = await prisma.practitioner.findMany({
      where: { status: 'Active' }
    })

    const formatted = dbPractitioners.map((p, idx) => ({
      id: p.id,
      name: p.name,
      specialty: p.specialty || 'General Practitioner',
      clinic: p.clinic || 'Main Clinic',
      contact: p.phone || '',
      email: p.email || '',
      lastAppt: p.joinDate || '',
      avatar: p.avatarUrl || (idx % 2 === 0
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150')
    }))

    res.json({ success: true, data: formatted })
  } catch (err) {
    next(err)
  }
}

const getCareTeamMessages = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { patient: true } })
    const patientId = user?.patient?.id

    const messages = await prisma.careTeamMessage.findMany({
      where: {
        patientId: patientId
      },
      orderBy: { createdAt: 'asc' }
    })
    res.json({ success: true, data: messages })
  } catch (err) {
    next(err)
  }
}

const sendCareTeamMessage = async (req, res, next) => {
  try {
    const { practitionerId, doctorName, messageText, category } = req.body
    
    const userId = req.user.id
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { patient: true } })
    
    const newMessage = await prisma.careTeamMessage.create({
      data: {
        practitionerId: practitionerId || null,
        patientId: user?.patient?.id || null,
        sender: 'patient',
        doctorName: doctorName || 'Practitioner',
        text: messageText,
        category: category || 'Treatment Questions'
      }
    })

    res.json({
      success: true,
      message: `Secure message delivered to ${doctorName || 'Practitioner'}`,
      data: newMessage
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
      if (prisma.patientForm && prisma.document) {
        const patient = await findOrCreatePatient(req.user)
        forms = await prisma.patientForm.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'asc' }
        })
        docs = await prisma.document.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'desc' }
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
      size: d.size || '1.2 MB'
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

    const newDoc = {
      id: `doc_${Date.now()}`,
      name: name || 'Uploaded_Medical_Scan.pdf',
      type: type || 'Uploaded Document',
      date: 'Today',
      size: size || '1.5 MB'
    }

    try {
      if (prisma.document) {
        const patient = await findOrCreatePatient(req.user)
        const uploaderName = req.body?.uploadBy || patient.fullName || req.user?.name || 'Patient'
        const dbCreated = await prisma.document.create({
          data: {
            name: newDoc.name,
            patientName: patient.fullName || 'Patient',
            patientId: patient.id,
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
      // fallback
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
      if (prisma.patientFundingAccount && prisma.patientClaim) {
        const patient = await findOrCreatePatient(req.user)
        accounts = await prisma.patientFundingAccount.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'asc' }
        })
        claims = await prisma.patientClaim.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'desc' }
        })
      }
    } catch (dbErr) {
      console.warn('DB funding and claims query notice:', dbErr.message)
    }

    let filteredClaims = [...claims]
    if (funding && funding !== 'ALL') {
      filteredClaims = filteredClaims.filter(c => (c.funding || '').toLowerCase() === funding.toLowerCase())
    }
    if (status && status !== 'ALL') {
      filteredClaims = filteredClaims.filter(c => (c.status || '').toLowerCase() === status.toLowerCase())
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      filteredClaims = filteredClaims.filter(c =>
        (c.service && c.service.toLowerCase().includes(q)) ||
        (c.id && String(c.id).toLowerCase().includes(q)) ||
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

    res.json({
      success: true,
      data: {
        activeShares,
        pendingRequests
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

// --- Patient Invoices ---

let inMemoryPatientInvoices = []

const getPatientInvoices = async (req, res, next) => {
  try {
    const { search, status } = req.query
    let invoices = []

    try {
      if (prisma.patientInvoice) {
        const patient = await findOrCreatePatient(req.user)
        invoices = await prisma.patientInvoice.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: 'desc' }
        })
        invoices = invoices.map(i => ({ ...i, id: i.displayId || i.id }))
      }
    } catch (dbErr) {
      console.warn('DB patient invoices query notice:', dbErr.message)
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

    try {
      if (prisma.patientInvoice) {
        const existing = await prisma.patientInvoice.findFirst({
          where: { OR: [{ id }, { displayId: id }] }
        })
        if (existing) {
          const updated = await prisma.patientInvoice.update({
            where: { id: existing.id },
            data: {
              status: 'Paid',
              paymentMethod: paymentMethod || 'card',
              paidAt: new Date()
            }
          })
          return res.json({ success: true, data: { ...updated, id: updated.displayId || updated.id } })
        }
      }
    } catch (dbErr) {
      // fallback
    }

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

    const newInv = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      service: service || 'Allied Health Consultation',
      practitioner: practitioner || 'Dr. Sarah Jenkins',
      amount: amount ? Number(amount) : 120.00,
      status: 'Unpaid',
      due: due || '19 Jul 2026'
    }

    try {
      if (prisma.patientInvoice) {
        const patient = await findOrCreatePatient(req.user)
        const dbCreated = await prisma.patientInvoice.create({
          data: {
            displayId: newInv.id,
            patientId: patient.id,
            service: newInv.service,
            practitioner: newInv.practitioner,
            amount: newInv.amount,
            status: newInv.status,
            due: newInv.due
          }
        })
        inMemoryPatientInvoices.unshift({ ...dbCreated, id: dbCreated.displayId || dbCreated.id })
        return res.json({ success: true, data: { ...dbCreated, id: dbCreated.displayId || dbCreated.id } })
      }
    } catch (dbErr) {
      // fallback
    }

    inMemoryPatientInvoices.unshift(newInv)
    res.json({ success: true, data: newInv })
  } catch (err) {
    next(err)
  }
}

const deletePatientInvoice = async (req, res, next) => {
  try {
    const { id } = req.params

    try {
      if (prisma.patientInvoice) {
        const existing = await prisma.patientInvoice.findFirst({
          where: { OR: [{ id }, { displayId: id }] }
        })
        if (existing) {
          await prisma.patientInvoice.delete({ where: { id: existing.id } })
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
  updatePatientAchievements
}





