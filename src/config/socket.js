const { Server } = require('socket.io')

let io = null

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log(`⚡ WebSocket Client connected: ${socket.id}`)

    socket.on('join:room', (room) => {
      socket.join(room)
      console.log(`📡 Socket ${socket.id} joined room: ${room}`)
    })

    socket.on('leave:room', (room) => {
      socket.leave(room)
      console.log(`📡 Socket ${socket.id} left room: ${room}`)
    })

    socket.on('disconnect', () => {
      console.log(`🔌 WebSocket Client disconnected: ${socket.id}`)
    })
  })

  return io
}

function getIO() {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized yet')
  }
  return io
}

function emitEvent(event, data, room = null) {
  if (io) {
    if (room) {
      io.to(room).emit(event, data)
    } else {
      io.emit(event, data)
    }
  }
}

module.exports = {
  initSocket,
  getIO,
  emitEvent
}
