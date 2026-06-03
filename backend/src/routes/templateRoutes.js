const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(authenticate);

// List templates with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, type, premium, page = 1, limit = 20 } = req.query;
    const where = {};
    if (search) where.name = { contains: search };
    if (category) where.category = category;
    if (type) where.type = type;
    if (premium === 'true') where.isPremium = true;
    if (premium === 'false') where.isPremium = false;

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy: { usageCount: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.template.count({ where }),
    ]);

    res.json({ success: true, data: { templates, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const template = await prisma.template.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Use template (clone to project)
router.post('/:id/use', async (req, res) => {
  try {
    const template = await prisma.template.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

    const design = await prisma.design.create({
      data: {
        userId: req.user.id,
        projectId: req.body.projectId || null,
        title: `${template.name} — Copy`,
        type: template.type,
        content: template.content,
        imageUrl: template.imageUrl,
        thumbnailUrl: template.thumbnailUrl,
        status: 'DRAFT',
      },
    });

    await prisma.template.update({ where: { id: template.id }, data: { usageCount: { increment: 1 } } });

    res.json({ success: true, data: design });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
