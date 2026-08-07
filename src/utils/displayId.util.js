const prisma = require('../config/db')

/**
 * Generate enterprise format Display ID (e.g., CLN-000001, ADM-000001, USR-000001)
 * @param {string} modelName - Prisma model name ('clinic', 'user', 'patient', 'subscription', 'appointment', 'invoice')
 * @param {string} prefix - Display ID Prefix ('CLN', 'ADM', 'USR', 'PAT', 'SUB', 'APT', 'INV')
 */
const generateDisplayId = async (modelName, prefix) => {
  try {
    const count = await prisma[modelName].count()
    const nextNumber = count + 1
    const padded = String(nextNumber).padStart(6, '0')
    return `${prefix}-${padded}`
  } catch (err) {
    const random = Math.floor(100000 + Math.random() * 900000)
    return `${prefix}-${random}`
  }
}

module.exports = {
  generateDisplayId
}
