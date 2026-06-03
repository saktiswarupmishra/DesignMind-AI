require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const projectRoutes = require('./routes/projectRoutes');
const adminRoutes = require('./routes/adminRoutes');
const templateRoutes = require('./routes/templateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const teamRoutes = require('./routes/teamRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: { origin: config.cors.origin, methods: ['GET', 'POST'] },
});

// ==================== MIDDLEWARE ====================

app.use(helmet());
app.use(cors({ origin: config.cors.origin.split(',').map(o => o.trim()), credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// AI-specific rate limiter (stricter)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'AI request limit reached. Please wait.' },
});
app.use('/api/ai/', aiLimiter);

// ==================== ROUTES ====================

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DesignMind AI API is running', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/activity', activityRoutes);

// ==================== SOCKET.IO ====================

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    logger.debug(`Socket ${socket.id} joined project-${projectId}`);
  });

  socket.on('design-update', (data) => {
    socket.to(`project-${data.projectId}`).emit('design-updated', data);
  });

  socket.on('comment', (data) => {
    socket.to(`project-${data.projectId}`).emit('new-comment', data);
  });

  socket.on('disconnect', () => {
    logger.debug(`Socket disconnected: ${socket.id}`);
  });
});

// ==================== ERROR HANDLING ====================

app.use(notFound);
app.use(errorHandler);

// ==================== START SERVER ====================

const PORT = config.port;
httpServer.listen(PORT, () => {
  logger.info(`🚀 DesignMind AI Backend running on port ${PORT}`);
  logger.info(`📊 Environment: ${config.env}`);
  logger.info(`🔗 API URL: http://localhost:${PORT}/api`);
});

module.exports = { app, io };
