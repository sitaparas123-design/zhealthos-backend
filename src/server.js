require('dotenv').config()
const http = require('http')
const app = require('./app')
const prisma = require('./config/db')
const { initSocket } = require('./config/socket')

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect()
    console.log('✅ Connected to MySQL Database successfully!')

    const server = http.createServer(app)

    // Initialize Socket.io real-time engine
    initSocket(server)

    server.listen(PORT, () => {
      console.log(`🚀 ZHealth OS Backend Server running on port ${PORT}`)
      console.log(`⚡ WebSocket Server active on ws://localhost:${PORT}`)
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use by another process.`)
        console.error(`👉 Please close the existing process running on port ${PORT} or change PORT in backend/.env`)
      } else {
        console.error('❌ Server error:', err)
      }
      process.exit(1)
    })
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error)
    process.exit(1)
  }
}

startServer()

