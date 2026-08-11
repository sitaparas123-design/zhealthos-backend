const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10)

  const users = [
    {
      email: 'admin@zhealth.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      passwordHash
    },
    {
      email: 'sales@zhealth.com',
      name: 'Sales Executive',
      role: 'SALES_EXECUTIVE',
      status: 'ACTIVE',
      passwordHash
    },
    {
      email: 'clinicadmin@zhealth.com',
      name: 'Zoya Rahman (Clinic Admin)',
      role: 'CLINIC_ADMIN',
      status: 'ACTIVE',
      passwordHash
    },
    {
      email: 'sarah.jenkins@clinic.com',
      name: 'Dr. Sarah Jenkins',
      role: 'PRACTITIONER',
      status: 'ACTIVE',
      passwordHash
    },
    {
      email: 'patient@zhealth.com',
      name: 'John Doe',
      role: 'PATIENT',
      status: 'ACTIVE',
      passwordHash
    }
  ]

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      await prisma.user.update({
        where: { email: u.email },
        data: {
          passwordHash: u.passwordHash,
          status: 'ACTIVE',
          role: u.role
        }
      })
      console.log(`✅ Updated password & status for: ${u.email}`)
    } else {
      const count = await prisma.user.count()
      await prisma.user.create({
        data: {
          ...u,
          displayId: `USR-${String(count + 1).padStart(6, '0')}`
        }
      })
      console.log(`✅ Created quick access user: ${u.email}`)
    }
  }
}

main()
  .then(() => {
    console.log('🎉 All Quick Access demo users successfully updated with Password123!')
  })
  .catch(e => console.error('❌ Error seeding users:', e))
  .finally(() => prisma.$disconnect())
