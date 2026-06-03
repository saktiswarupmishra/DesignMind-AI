const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(authenticate);

// Get user's teams
router.get('/', async (req, res) => {
  try {
    const memberships = await prisma.teamMember.findMany({
      where: { userId: req.user.id },
      include: { team: { include: { owner: { select: { id: true, firstName: true, lastName: true, email: true } }, members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } } }, _count: { select: { projects: true } } } } },
    });
    const ownedTeams = await prisma.team.findMany({
      where: { ownerId: req.user.id },
      include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } } }, _count: { select: { projects: true } } },
    });
    const allTeams = [...ownedTeams, ...memberships.map((m) => m.team)];
    const unique = [...new Map(allTeams.map((t) => [t.id, t])).values()];
    res.json({ success: true, data: unique });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create team
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const team = await prisma.team.create({
      data: { name, description, ownerId: req.user.id, members: { create: { userId: req.user.id, role: 'OWNER' } } },
      include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } } },
    });
    res.status(201).json({ success: true, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  try {
    const team = await prisma.team.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!team || team.ownerId !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    const updated = await prisma.team.update({ where: { id: team.id }, data: { name: req.body.name, description: req.body.description } });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    const team = await prisma.team.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!team || team.ownerId !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    await prisma.teamMember.deleteMany({ where: { teamId: team.id } });
    await prisma.team.delete({ where: { id: team.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add member
router.post('/:id/members', async (req, res) => {
  try {
    const team = await prisma.team.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!team || team.ownerId !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const member = await prisma.teamMember.create({
      data: { teamId: team.id, userId: user.id, role: req.body.role || 'MEMBER' },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'User already in team' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove member
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const team = await prisma.team.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!team || team.ownerId !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    await prisma.teamMember.deleteMany({ where: { teamId: team.id, userId: parseInt(req.params.userId) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
