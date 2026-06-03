const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

router.use(authenticate);

// Helper: proxy to AI service + log request
async function proxyAI(req, res, endpoint, type) {
  const startTime = Date.now();
  try {
    const { data } = await axios.post(`${AI_SERVICE_URL}/api/${endpoint}`, req.body, { timeout: 30000 });
    const processingMs = Date.now() - startTime;

    // Log AI request
    await prisma.aIRequest.create({
      data: { userId: req.user.id, type, input: req.body, output: data, status: 'COMPLETED', processingMs },
    }).catch(() => {});

    res.json({ success: true, data });
  } catch (err) {
    await prisma.aIRequest.create({
      data: { userId: req.user.id, type, input: req.body, status: 'FAILED', errorMessage: err.message, processingMs: Date.now() - startTime },
    }).catch(() => {});
    res.status(500).json({ success: false, message: 'AI generation failed', error: err.message });
  }
}

// Phase 1 endpoints
router.post('/generate-design', (req, res) => proxyAI(req, res, 'generate-design', 'DESIGN_GENERATION'));
router.post('/generate-palette', (req, res) => proxyAI(req, res, 'generate-palette', 'COLOR_PALETTE'));
router.post('/generate-logo', (req, res) => proxyAI(req, res, 'generate-logo', 'LOGO_GENERATION'));
router.post('/generate-brand', (req, res) => proxyAI(req, res, 'generate-brand', 'BRAND_IDENTITY'));

// Phase 2 endpoints
router.post('/generate-poster', (req, res) => proxyAI(req, res, 'generate-poster', 'POSTER'));
router.post('/generate-banner', (req, res) => proxyAI(req, res, 'generate-banner', 'BANNER'));
router.post('/generate-ad', (req, res) => proxyAI(req, res, 'generate-ad', 'AD_CREATIVE'));
router.post('/analyze-design', (req, res) => proxyAI(req, res, 'analyze-design', 'DESIGN_ANALYSIS'));

// Phase 3 endpoints
router.post('/generate-mockup', (req, res) => proxyAI(req, res, 'generate-mockup', 'MOCKUP'));
router.post('/smart-resize', (req, res) => proxyAI(req, res, 'smart-resize', 'OTHER'));
router.post('/analyze-trends', (req, res) => proxyAI(req, res, 'analyze-trends', 'OTHER'));

// AI history
router.get('/history', async (req, res) => {
  try {
    const requests = await prisma.aIRequest.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
