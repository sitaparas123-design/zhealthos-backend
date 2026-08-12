const { verifyAccessToken } = require('../utils/token')
const prisma = require('../config/db')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      if (token && token !== 'null' && token !== 'undefined') {
        try {
          const decoded = verifyAccessToken(token)
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, role: true, status: true, profileData: true },
          })
          if (user && user.status === 'ACTIVE') {
            req.user = user
            return next()
          }
        } catch (err) {
          // Token expired or invalid
        }
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication required. Missing or invalid token.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = authenticate
