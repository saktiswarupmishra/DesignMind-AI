const prisma = require('../config/database');
const logger = require('../utils/logger');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [projectCount, designCount, aiRequestCount, recentDesigns, recentRequests, subscription] = await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.design.count({ where: { userId } }),
      prisma.aIRequest.count({ where: { userId } }),
      prisma.design.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.aIRequest.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.subscription.findUnique({ where: { userId } }),
    ]);

    res.json({
      success: true,
      data: {
        stats: { projects: projectCount, designs: designCount, aiRequests: aiRequestCount, aiCredits: subscription?.aiCredits || 0, plan: subscription?.plan || 'FREE' },
        recentDesigns,
        recentRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== PROJECTS ====================

exports.getProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: { _count: { select: { designs: true } } },
        orderBy: { updatedAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.project.count({ where }),
    ]);

    res.json({ success: true, data: { projects, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } } });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Project name is required' });

    const project = await prisma.project.create({
      data: { userId: req.user.id, name, description, category },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: { designs: true, _count: { select: { designs: true, comments: true } } },
    });

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { name, description, category, status } = req.body;
    const project = await prisma.project.updateMany({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      data: { ...(name && { name }), ...(description !== undefined && { description }), ...(category && { category }), ...(status && { status }) },
    });

    if (project.count === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const result = await prisma.project.deleteMany({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (result.count === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};
