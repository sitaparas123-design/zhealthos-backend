const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const p = new PrismaClient()

async function main() {
  const newPassword = 'Admin@123'
  const hash = await bcrypt.hash(newPassword, 10)

  // Reset password for admin@zhealth.com
  const updated = await p.user.update({
    where: { email: 'admin@zhealth.com' },
    data: { passwordHash: hash }
  })
  console.log('✅ Password reset for:', updated.email)
  console.log('New password is: Admin@123')
}

main().catch(e => console.error(e.message)).finally(() => p.$disconnect())
