const axios = require('axios');
const prisma = require('../config/database');
const config = require('../config');
const logger = require('../utils/logger');

const callAIService = async (endpoint, data) => {
  try {
    const response = await axios.post(`${config.ai.serviceUrl}/api${endpoint}`, data, {
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    logger.error(`AI Service error: ${error.message}`);
    throw new Error('AI service unavailable. Please try again later.');
  }
};

const trackRequest = async (userId, type, input, output, status, processingMs) => {
  return prisma.aIRequest.create({
    data: { userId, type, input, output, status, processingMs },
  });
};

exports.generateDesign = async (req, res, next) => {
  try {
    const { prompt, style, platform, industry } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });

    const startTime = Date.now();
    const result = await callAIService('/generate-design', { prompt, style, platform, industry });
    const processingMs = Date.now() - startTime;

    await trackRequest(req.user.id, 'DESIGN_GENERATION', req.body, result, 'COMPLETED', processingMs);

    res.json({ success: true, data: result });
  } catch (error) {
    await trackRequest(req.user.id, 'DESIGN_GENERATION', req.body, null, 'FAILED', 0).catch(() => {});
    next(error);
  }
};

exports.generatePalette = async (req, res, next) => {
  try {
    const { prompt, mood, industry, count } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });

    const startTime = Date.now();
    const result = await callAIService('/generate-palette', { prompt, mood, industry, count });
    const processingMs = Date.now() - startTime;

    await trackRequest(req.user.id, 'COLOR_PALETTE', req.body, result, 'COMPLETED', processingMs);

    res.json({ success: true, data: result });
  } catch (error) {
    await trackRequest(req.user.id, 'COLOR_PALETTE', req.body, null, 'FAILED', 0).catch(() => {});
    next(error);
  }
};

exports.generateLogo = async (req, res, next) => {
  try {
    const { brandName, industry, style, colors, description } = req.body;
    if (!brandName) return res.status(400).json({ success: false, message: 'Brand name is required' });

    const startTime = Date.now();
    const result = await callAIService('/generate-logo', { brandName, industry, style, colors, description });
    const processingMs = Date.now() - startTime;

    await trackRequest(req.user.id, 'LOGO_GENERATION', req.body, result, 'COMPLETED', processingMs);

    res.json({ success: true, data: result });
  } catch (error) {
    await trackRequest(req.user.id, 'LOGO_GENERATION', req.body, null, 'FAILED', 0).catch(() => {});
    next(error);
  }
};

exports.generateBrand = async (req, res, next) => {
  try {
    const { brandName, industry, targetAudience, style, values } = req.body;
    if (!brandName) return res.status(400).json({ success: false, message: 'Brand name is required' });

    const startTime = Date.now();
    const result = await callAIService('/generate-brand', { brandName, industry, targetAudience, style, values });
    const processingMs = Date.now() - startTime;

    await trackRequest(req.user.id, 'BRAND_IDENTITY', req.body, result, 'COMPLETED', processingMs);

    // Save brand identity
    await prisma.brandIdentity.create({
      data: {
        userId: req.user.id,
        brandName,
        industry,
        logoIdeas: result.logoIdeas || null,
        colorPalette: result.colorPalette || null,
        typography: result.typography || null,
        brandVoice: result.brandVoice || null,
        missionStatement: result.missionStatement || null,
        visionStatement: result.visionStatement || null,
        brandGuidelines: result.brandGuidelines || null,
        brandPersonality: result.brandPersonality || null,
      },
    });

    res.json({ success: true, data: result });
  } catch (error) {
    await trackRequest(req.user.id, 'BRAND_IDENTITY', req.body, null, 'FAILED', 0).catch(() => {});
    next(error);
  }
};

exports.getAIHistory = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };
    if (type) where.type = type;

    const [requests, total] = await Promise.all([
      prisma.aIRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      }),
      prisma.aIRequest.count({ where }),
    ]);

    res.json({ success: true, data: { requests, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } } });
  } catch (error) {
    next(error);
  }
};
