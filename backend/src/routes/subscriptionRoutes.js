const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(authenticate);

// Get current subscription
router.get('/current', async (req, res) => {
  try {
    let sub = await prisma.subscription.findUnique({ where: { userId: req.user.id } });
    if (!sub) {
      sub = await prisma.subscription.create({ data: { userId: req.user.id, plan: 'FREE', aiCredits: 50, maxProjects: 5 } });
    }
    res.json({ success: true, data: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get usage stats
router.get('/usage', async (req, res) => {
  try {
    const sub = await prisma.subscription.findUnique({ where: { userId: req.user.id } });
    const [aiCount, projectCount, designCount] = await Promise.all([
      prisma.aIRequest.count({ where: { userId: req.user.id } }),
      prisma.project.count({ where: { userId: req.user.id } }),
      prisma.design.count({ where: { userId: req.user.id } }),
    ]);
    res.json({
      success: true,
      data: {
        plan: sub?.plan || 'FREE',
        aiCreditsUsed: aiCount,
        aiCreditsTotal: sub?.aiCredits || 50,
        projectsUsed: projectCount,
        projectsTotal: sub?.maxProjects || 5,
        designsCreated: designCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Upgrade plan
router.post('/upgrade', async (req, res) => {
  try {
    const { plan } = req.body;
    const planLimits = { STARTER: { credits: 200, projects: 20 }, PROFESSIONAL: { credits: 1000, projects: 100 }, ENTERPRISE: { credits: 9999, projects: 9999 } };
    const limits = planLimits[plan];
    if (!limits) return res.status(400).json({ success: false, message: 'Invalid plan' });

    const sub = await prisma.subscription.upsert({
      where: { userId: req.user.id },
      update: { plan, aiCredits: limits.credits, maxProjects: limits.projects, status: 'ACTIVE' },
      create: { userId: req.user.id, plan, aiCredits: limits.credits, maxProjects: limits.projects },
    });

    // Record payment
    const prices = { STARTER: 19.00, PROFESSIONAL: 49.00, ENTERPRISE: 99.00 };
    await prisma.payment.create({
      data: { userId: req.user.id, amount: prices[plan] || 0, status: 'COMPLETED', method: 'card', description: `Upgrade to ${plan} plan` },
    });

    res.json({ success: true, data: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Cancel subscription
router.post('/cancel', async (req, res) => {
  try {
    const sub = await prisma.subscription.update({
      where: { userId: req.user.id },
      data: { status: 'CANCELLED', plan: 'FREE', aiCredits: 50, maxProjects: 5 },
    });
    res.json({ success: true, data: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
