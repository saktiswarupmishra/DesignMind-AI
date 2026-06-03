"""API route handlers for AI endpoints."""

from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    DesignRequest, PaletteRequest, LogoRequest, BrandRequest,
    PosterRequest, BannerRequest, AdCreativeRequest, DesignAnalysisRequest,
    MockupRequest, SmartResizeRequest, TrendAnalysisRequest,
)
from app.services.ai_service import (
    generate_design, generate_palette, generate_logo, generate_brand,
    generate_poster, generate_banner, generate_ad_creative, analyze_design,
    generate_mockup, smart_resize, analyze_trends,
)

router = APIRouter(prefix="/api", tags=["AI Generation"])


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "DesignMind AI Service", "version": "2.0.0"}


# ==================== PHASE 1 ENDPOINTS ====================

@router.post("/generate-design")
async def api_generate_design(request: DesignRequest):
    try:
        return await generate_design(prompt=request.prompt, style=request.style, platform=request.platform, industry=request.industry)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-palette")
async def api_generate_palette(request: PaletteRequest):
    try:
        return await generate_palette(prompt=request.prompt, mood=request.mood, industry=request.industry, count=request.count or 5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-logo")
async def api_generate_logo(request: LogoRequest):
    try:
        return await generate_logo(brand_name=request.brandName, industry=request.industry, style=request.style, colors=request.colors, description=request.description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-brand")
async def api_generate_brand(request: BrandRequest):
    try:
        return await generate_brand(brand_name=request.brandName, industry=request.industry, target_audience=request.targetAudience, style=request.style, values=request.values)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== PHASE 2 ENDPOINTS ====================

@router.post("/generate-poster")
async def api_generate_poster(request: PosterRequest):
    try:
        return await generate_poster(prompt=request.prompt, size=request.size, event_type=request.eventType, industry=request.industry, style=request.style)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-banner")
async def api_generate_banner(request: BannerRequest):
    try:
        return await generate_banner(prompt=request.prompt, dimensions=request.dimensions, platform=request.platform, style=request.style)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-ad")
async def api_generate_ad(request: AdCreativeRequest):
    try:
        return await generate_ad_creative(prompt=request.prompt, platform=request.platform, objective=request.objective, audience=request.audience, tone=request.tone)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-design")
async def api_analyze_design(request: DesignAnalysisRequest):
    try:
        return await analyze_design(description=request.description, design_type=request.designType, goals=request.goals)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== PHASE 3 ENDPOINTS ====================

@router.post("/generate-mockup")
async def api_generate_mockup(request: MockupRequest):
    try:
        return await generate_mockup(prompt=request.prompt, product_type=request.productType, style=request.style, brand=request.brand)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/smart-resize")
async def api_smart_resize(request: SmartResizeRequest):
    try:
        return await smart_resize(prompt=request.prompt, original_platform=request.originalPlatform, target_platforms=request.targetPlatforms)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-trends")
async def api_analyze_trends(request: TrendAnalysisRequest):
    try:
        return await analyze_trends(industry=request.industry, region=request.region, timeframe=request.timeframe)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
