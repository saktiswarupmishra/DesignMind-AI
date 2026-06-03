from pydantic import BaseModel, Field
from typing import Optional, List


# ==================== DESIGN ====================

class DesignRequest(BaseModel):
    prompt: str = Field(..., min_length=3, description="Design description prompt")
    style: Optional[str] = Field(None, description="Design style (modern, vintage, minimal, etc.)")
    platform: Optional[str] = Field(None, description="Target platform (instagram, facebook, etc.)")
    industry: Optional[str] = Field(None, description="Industry/niche")


class DesignResponse(BaseModel):
    concept: str
    layout: str
    colorPalette: List[dict]
    typography: dict
    ctaSuggestions: List[str]
    marketingCopy: str
    imagePrompt: str
    brandConsistency: List[str]


# ==================== COLOR PALETTE ====================

class PaletteRequest(BaseModel):
    prompt: str = Field(..., min_length=3)
    mood: Optional[str] = None
    industry: Optional[str] = None
    count: Optional[int] = Field(5, ge=3, le=10)


class ColorInfo(BaseModel):
    hex: str
    name: str
    rgb: str
    usage: str


class PaletteResponse(BaseModel):
    primary: List[ColorInfo]
    secondary: List[ColorInfo]
    accent: List[ColorInfo]
    brandColors: List[ColorInfo]
    psychologyReport: str


# ==================== LOGO ====================

class LogoRequest(BaseModel):
    brandName: str = Field(..., min_length=1)
    industry: Optional[str] = None
    style: Optional[str] = None
    colors: Optional[List[str]] = None
    description: Optional[str] = None


class LogoConcept(BaseModel):
    name: str
    description: str
    style: str
    svgPrompt: str
    aiImagePrompt: str


class LogoResponse(BaseModel):
    concepts: List[LogoConcept]
    recommendedStyle: str
    colorSuggestions: List[str]


# ==================== BRAND IDENTITY ====================

class BrandRequest(BaseModel):
    brandName: str = Field(..., min_length=1)
    industry: Optional[str] = None
    targetAudience: Optional[str] = None
    style: Optional[str] = None
    values: Optional[List[str]] = None


class BrandResponse(BaseModel):
    logoIdeas: List[dict]
    colorPalette: dict
    typography: dict
    brandVoice: str
    missionStatement: str
    visionStatement: str
    brandGuidelines: dict
    brandPersonality: dict


# ==================== POSTER / BANNER / AD ====================

class PosterRequest(BaseModel):
    prompt: str = Field(..., min_length=3)
    size: Optional[str] = None
    eventType: Optional[str] = None
    industry: Optional[str] = None
    style: Optional[str] = None

class BannerRequest(BaseModel):
    prompt: str = Field(..., min_length=3)
    dimensions: Optional[str] = None
    platform: Optional[str] = None
    style: Optional[str] = None

class AdCreativeRequest(BaseModel):
    prompt: str = Field(..., min_length=3)
    platform: Optional[str] = None
    objective: Optional[str] = None
    audience: Optional[str] = None
    tone: Optional[str] = None

class DesignAnalysisRequest(BaseModel):
    description: str = Field(..., min_length=10)
    designType: Optional[str] = None
    goals: Optional[str] = None

# ==================== PHASE 3: ADVANCED ====================

class MockupRequest(BaseModel):
    prompt: str = Field(..., min_length=3)
    productType: Optional[str] = None
    style: Optional[str] = None
    brand: Optional[str] = None

class SmartResizeRequest(BaseModel):
    prompt: str = Field(..., min_length=3)
    originalPlatform: Optional[str] = None
    targetPlatforms: Optional[List[str]] = None

class TrendAnalysisRequest(BaseModel):
    industry: str = Field(..., min_length=2)
    region: Optional[str] = None
    timeframe: Optional[str] = None


