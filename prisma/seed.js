const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const defaultPasswordHash = await bcrypt.hash('Password123!', 10)

  // 1. Seed Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@zhealth.com' },
    update: { displayId: 'ADM-000001' },
    create: {
      displayId: 'ADM-000001',
      email: 'admin@zhealth.com',
      passwordHash: defaultPasswordHash,
      name: 'Alex Sadman (Super Admin)',
      phone: '+61 400 000 001',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  })

  // 2. Seed Clinic Admin
  const clinicAdmin = await prisma.user.upsert({
    where: { email: 'clinicadmin@zhealth.com' },
    update: { displayId: 'ADM-000002' },
    create: {
      displayId: 'ADM-000002',
      email: 'clinicadmin@zhealth.com',
      passwordHash: defaultPasswordHash,
      name: 'Zoya Rahman (Clinic Admin)',
      phone: '+61 400 000 002',
      role: 'CLINIC_ADMIN',
      status: 'ACTIVE',
    },
  })

  // 3. Seed Practitioner User & Profile
  const practitionerUser = await prisma.user.upsert({
    where: { email: 'sarah.jenkins@clinic.com' },
    update: { displayId: 'USR-000001' },
    create: {
      displayId: 'USR-000001',
      email: 'sarah.jenkins@clinic.com',
      passwordHash: defaultPasswordHash,
      name: 'Dr. Sarah Jenkins',
      phone: '+61 412 100 001',
      role: 'PRACTITIONER',
      status: 'ACTIVE',
    },
  })

  await prisma.practitioner.upsert({
    where: { email: 'sarah.jenkins@clinic.com' },
    update: {},
    create: {
      userId: practitionerUser.id,
      name: 'Dr. Sarah Jenkins',
      specialty: 'Physiotherapist',
      color: '#30D2BE',
      email: 'sarah.jenkins@clinic.com',
      phone: '+61 412 100 001',
      status: 'Active',
      joinDate: 'Jan 1, 2025',
      qualifications: ['BPhty (Hons)', 'APAM Member'],
      bio: 'Experienced physiotherapist specialising in musculoskeletal injuries.',
      consultationFee: 180,
    },
  })

  // 4. Seed Sales Executive User
  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@zhealth.com' },
    update: { displayId: 'SAL-000001' },
    create: {
      displayId: 'SAL-000001',
      email: 'sales@zhealth.com',
      passwordHash: defaultPasswordHash,
      name: 'Michael Scott (Sales Exec)',
      phone: '+61 400 000 003',
      role: 'SALES_EXECUTIVE',
      status: 'ACTIVE',
    },
  })

  // 5. Seed Patient User & Profile
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@zhealth.com' },
    update: { displayId: 'USR-000002' },
    create: {
      displayId: 'USR-000002',
      email: 'patient@zhealth.com',
      passwordHash: defaultPasswordHash,
      name: 'John Doe',
      phone: '+61 400 999 888',
      role: 'PATIENT',
      status: 'ACTIVE',
    },
  })

  await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: { displayId: 'PAT-000001' },
    create: {
      displayId: 'PAT-000001',
      userId: patientUser.id,
      fullName: 'John Doe',
      dob: '1990-05-15',
      gender: 'Male',
      email: 'patient@zhealth.com',
      phone: '+61 400 999 888',
      address: '123 Main St',
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      sessionsAllocated: 10,
      sessionsUsed: 2,
      status: 'active',
    },
  })

  // 6. Seed Branches
  const b1 = await prisma.branch.create({
    data: {
      name: 'Melbourne Central Clinic',
      email: 'melbourne@zhealth.com',
      phone: '+61 3 9000 1111',
      address: '123 Care Street, Melbourne VIC',
      status: 'Active',
    },
  }).catch(() => null)

  // 7. Seed Sample Appointments
  await prisma.appointment.createMany({
    data: [
      {
        displayId: 'APT-000001',
        patientName: 'John Doe',
        practitionerName: 'Dr. Sarah Jenkins',
        branchName: 'Melbourne Central Clinic',
        serviceName: 'Physiotherapy Initial Consultation',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '10:45 AM',
        status: 'Scheduled',
        fee: 180,
      },
    ],
    skipDuplicates: true,
  })

  // 8. Seed Sample Waitlist
  await prisma.waitlist.createMany({
    data: [
      {
        clientName: 'Alice Smith',
        contactNumber: '+61 411 222 333',
        preferredPractitioner: 'Dr. Sarah Jenkins',
        appointmentType: 'Initial Assessment',
        status: 'Waiting',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
