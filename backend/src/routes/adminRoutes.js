const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(authenticate);
router.use(authorize('ADMIN'));

// Admin stats
router.get('/stats', async (req, res) => {
  try {
    const [users, projects, designs, aiRequests, templates] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.design.count(),
      prisma.aIRequest.count(),
      prisma.template.count(),
    ]);
    const recentUsers = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, isActive: true } });
    res.json({ success: true, data: { users, projects, designs, aiRequests, templates, recentUsers } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// All users with search and filter
router.get('/users', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const where = {};
    if (search) where.OR = [{ email: { contains: search } }, { firstName: { contains: search } }, { lastName: { contains: search } }];
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, isVerified: true, createdAt: true, lastLogin: true, _count: { select: { projects: true, designs: true, aiRequests: true } } },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: { users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const updated = await prisma.user.update({ where: { id: user.id }, data: { isActive: !user.isActive } });
    res.json({ success: true, data: { id: updated.id, isActive: updated.isActive } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Analytics
router.get('/analytics', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [totalUsers, newUsers, totalAI, recentAI, activeSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.aIRequest.count(),
      prisma.aIRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.subscription.count({ where: { status: 'ACTIVE', plan: { not: 'FREE' } } }),
    ]);

    // AI usage by type
    const aiByType = await prisma.aIRequest.groupBy({ by: ['type'], _count: true, orderBy: { _count: { type: 'desc' } } });

    // Users by role
    const usersByRole = await prisma.user.groupBy({ by: ['role'], _count: true });

    res.json({
      success: true,
      data: {
        totalUsers, newUsers, totalAI, recentAI, activeSubscriptions,
        aiByType: aiByType.map((a) => ({ type: a.type, count: a._count })),
        usersByRole: usersByRole.map((u) => ({ role: u.role, count: u._count })),
        growthRate: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
