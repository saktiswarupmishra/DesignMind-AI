const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(authenticate);

// Get activity log
router.get('/', async (req, res) => {
  try {
    const { action, page = 1, limit = 30 } = req.query;
    const where = { userId: req.user.id };
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.activityLog.count({ where }),
    ]);

    res.json({ success: true, data: { logs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
