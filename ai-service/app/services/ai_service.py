"""AI generation service using OpenAI/LangChain with fallback mock data."""

import json
import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# Try to initialize OpenAI
_openai_client = None
try:
    if settings.OPENAI_API_KEY:
        from openai import AsyncOpenAI
        _openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        logger.info("OpenAI client initialized successfully")
    else:
        logger.warning("No OPENAI_API_KEY set — using mock responses")
except Exception as e:
    logger.warning(f"OpenAI init failed: {e} — using mock responses")


async def _call_openai(system_prompt: str, user_prompt: str) -> dict:
    """Call OpenAI API and parse JSON response."""
    if not _openai_client:
        return None

    try:
        response = await _openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.8,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error(f"OpenAI API error: {e}")
        return None


# ==================== DESIGN GENERATION ====================

async def generate_design(prompt: str, style: Optional[str], platform: Optional[str], industry: Optional[str]) -> dict:
    system_prompt = """You are an expert graphic designer AI. Generate a complete design concept as JSON with these keys:
    concept, layout, colorPalette (array of {hex, name, usage}), typography ({heading, body, accent}),
    ctaSuggestions (array of strings), marketingCopy, imagePrompt, brandConsistency (array of tips)."""

    user_prompt = f"Design brief: {prompt}"
    if style:
        user_prompt += f"\nStyle: {style}"
    if platform:
        user_prompt += f"\nPlatform: {platform}"
    if industry:
        user_prompt += f"\nIndustry: {industry}"

    result = await _call_openai(system_prompt, user_prompt)
    if result:
        return result

    # Mock response
    return {
        "concept": f"A stunning {style or 'modern'} design concept for: {prompt}. Features clean lines, bold typography, and a sophisticated color scheme that captures attention instantly.",
        "layout": "Hero section with full-bleed background image, centered headline with gradient overlay, product/service showcase in a 3-column grid below, and a prominent CTA button with micro-animation.",
        "colorPalette": [
            {"hex": "#6C5CE7", "name": "Royal Purple", "usage": "Primary brand color"},
            {"hex": "#00CEC9", "name": "Teal Wave", "usage": "Accent/CTA color"},
            {"hex": "#2D3436", "name": "Charcoal Night", "usage": "Text/headings"},
            {"hex": "#F8F9FA", "name": "Cloud White", "usage": "Background"},
            {"hex": "#FD79A8", "name": "Pink Blush", "usage": "Highlight accents"},
        ],
        "typography": {
            "heading": "Playfair Display — Bold, 48px — Elegant serif for headlines",
            "body": "Inter — Regular, 16px — Clean sans-serif for body text",
            "accent": "Space Grotesk — Medium, 14px — Modern for CTAs and labels",
        },
        "ctaSuggestions": ["Discover More →", "Start Creating Today", "Get Your Free Trial", "Explore the Collection"],
        "marketingCopy": f"Transform your vision into reality. {prompt} — where creativity meets innovation. Experience design excellence that elevates your brand above the competition.",
        "imagePrompt": f"Professional {style or 'modern'} graphic design, {prompt}, studio lighting, 8k ultra HD, minimalist composition, premium feel, trending on Behance and Dribbble",
        "brandConsistency": [
            "Maintain 60-30-10 color ratio across all materials",
            "Use consistent padding (24px) for all content blocks",
            "Keep typography hierarchy with max 3 font sizes",
            "Apply brand colors to all interactive elements",
        ],
    }


# ==================== COLOR PALETTE ====================

async def generate_palette(prompt: str, mood: Optional[str], industry: Optional[str], count: int = 5) -> dict:
    system_prompt = """You are a color theory expert. Generate a professional color palette as JSON with keys:
    primary (array of {hex, name, rgb, usage}), secondary (array), accent (array),
    brandColors (array), psychologyReport (string explaining color psychology)."""

    user_prompt = f"Create a color palette for: {prompt}"
    if mood:
        user_prompt += f"\nMood: {mood}"
    if industry:
        user_prompt += f"\nIndustry: {industry}"

    result = await _call_openai(system_prompt, user_prompt)
    if result:
        return result

    return {
        "primary": [
            {"hex": "#6C5CE7", "name": "Royal Purple", "rgb": "108, 92, 231", "usage": "Primary brand identity"},
            {"hex": "#5B4FD9", "name": "Deep Iris", "rgb": "91, 79, 217", "usage": "Hover states and emphasis"},
        ],
        "secondary": [
            {"hex": "#00CEC9", "name": "Teal Wave", "rgb": "0, 206, 201", "usage": "Secondary actions and accents"},
            {"hex": "#55EFC4", "name": "Mint Fresh", "rgb": "85, 239, 196", "usage": "Success states and highlights"},
        ],
        "accent": [
            {"hex": "#FD79A8", "name": "Pink Blush", "rgb": "253, 121, 168", "usage": "Notifications and alerts"},
            {"hex": "#FDCB6E", "name": "Golden Sand", "rgb": "253, 203, 110", "usage": "Premium badges and ratings"},
        ],
        "brandColors": [
            {"hex": "#2D3436", "name": "Charcoal Night", "rgb": "45, 52, 54", "usage": "Primary text"},
            {"hex": "#636E72", "name": "Storm Gray", "rgb": "99, 110, 114", "usage": "Secondary text"},
            {"hex": "#F8F9FA", "name": "Cloud White", "rgb": "248, 249, 250", "usage": "Background"},
        ],
        "psychologyReport": f"This palette for '{prompt}' combines the creativity and luxury of purple tones with the freshness of teal. Purple evokes innovation and premium quality, while teal adds trust and calm. The pink accent creates energy and warmth, making the overall palette feel both professional and approachable.",
    }


# ==================== LOGO GENERATION ====================

async def generate_logo(brand_name: str, industry: Optional[str], style: Optional[str], colors: list = None, description: Optional[str] = None) -> dict:
    system_prompt = """You are a world-class logo designer. Generate logo concepts as JSON with keys:
    concepts (array of {name, description, style, svgPrompt, aiImagePrompt}),
    recommendedStyle (string), colorSuggestions (array of hex strings)."""

    user_prompt = f"Design logos for brand: {brand_name}"
    if industry:
        user_prompt += f"\nIndustry: {industry}"
    if style:
        user_prompt += f"\nStyle: {style}"
    if description:
        user_prompt += f"\nDescription: {description}"

    result = await _call_openai(system_prompt, user_prompt)
    if result:
        return result

    return {
        "concepts": [
            {
                "name": f"{brand_name} Monogram",
                "description": f"An elegant monogram using the initials of {brand_name}, with clean geometric lines and a modern serif typeface. The letterforms interlock subtly, creating a memorable mark.",
                "style": "Minimalist / Monogram",
                "svgPrompt": f"Geometric monogram logo for {brand_name}, clean lines, single color, vector",
                "aiImagePrompt": f"Professional minimalist monogram logo for {brand_name}, white background, geometric, clean, modern, vector art style, trending on Dribbble",
            },
            {
                "name": f"{brand_name} Icon Mark",
                "description": f"An abstract icon that represents the essence of {brand_name}. Uses negative space cleverly to embed meaning. Works at any size from favicon to billboard.",
                "style": "Abstract / Icon",
                "svgPrompt": f"Abstract icon logo for {brand_name}, negative space, bold, memorable, scalable",
                "aiImagePrompt": f"Modern abstract icon logo for {brand_name}, creative negative space, gradient colors, professional, award-winning design",
            },
            {
                "name": f"{brand_name} Wordmark",
                "description": f"A custom typographic wordmark with subtle modifications to standard letterforms. The typography itself becomes the logo with unique character details.",
                "style": "Wordmark / Typography",
                "svgPrompt": f"Custom wordmark logo for {brand_name}, modified typography, unique letterforms",
                "aiImagePrompt": f"Custom typography wordmark logo for {brand_name}, professional, unique font design, clean white background, premium quality",
            },
        ],
        "recommendedStyle": style or "Modern Minimalist with subtle geometric elements",
        "colorSuggestions": ["#6C5CE7", "#2D3436", "#00CEC9", "#FFFFFF", "#F8F9FA"],
    }


# ==================== BRAND IDENTITY ====================

async def generate_brand(brand_name: str, industry: Optional[str], target_audience: Optional[str], style: Optional[str], values: list = None) -> dict:
    system_prompt = """You are a brand strategist. Generate a complete brand identity as JSON with keys:
    logoIdeas (array of dicts), colorPalette (dict), typography (dict), brandVoice (string),
    missionStatement (string), visionStatement (string), brandGuidelines (dict), brandPersonality (dict)."""

    user_prompt = f"Create brand identity for: {brand_name}"
    if industry:
        user_prompt += f"\nIndustry: {industry}"
    if target_audience:
        user_prompt += f"\nTarget audience: {target_audience}"

    result = await _call_openai(system_prompt, user_prompt)
    if result:
        return result

    return {
        "logoIdeas": [
            {"concept": "Geometric Monogram", "description": f"Clean geometric monogram using {brand_name} initials"},
            {"concept": "Abstract Symbol", "description": "An abstract mark representing innovation and creativity"},
            {"concept": "Custom Wordmark", "description": "Bespoke typography with unique character modifications"},
        ],
        "colorPalette": {
            "primary": "#6C5CE7",
            "secondary": "#00CEC9",
            "accent": "#FD79A8",
            "dark": "#2D3436",
            "light": "#F8F9FA",
        },
        "typography": {
            "heading": {"font": "Playfair Display", "weight": "Bold", "usage": "Headlines and titles"},
            "body": {"font": "Inter", "weight": "Regular", "usage": "Body text and descriptions"},
            "accent": {"font": "Space Grotesk", "weight": "Medium", "usage": "CTAs and UI elements"},
        },
        "brandVoice": f"{brand_name} speaks with confidence, creativity, and warmth. The tone is professional yet approachable, innovative yet grounded. We use clear, inspiring language that empowers our audience.",
        "missionStatement": f"At {brand_name}, we empower creators and businesses with intelligent design tools that transform ideas into stunning visual realities, making professional-grade design accessible to everyone.",
        "visionStatement": f"To become the world's most trusted AI-powered creative partner, where every brand — from startups to enterprises — can achieve design excellence effortlessly.",
        "brandGuidelines": {
            "logoUsage": "Maintain minimum clear space equal to the height of the logo mark. Never distort, rotate, or change logo colors outside the approved palette.",
            "colorUsage": "Use the 60-30-10 rule: 60% primary, 30% secondary, 10% accent. Dark mode should invert light/dark values while maintaining brand colors.",
            "typographyUsage": "Headlines in Playfair Display Bold, body in Inter Regular 16px with 1.6 line height. Never use more than 3 type sizes per layout.",
            "imageryStyle": "Clean, bright, aspirational photography. Use consistent filters and overlays. Illustrations should follow the geometric, modern brand style.",
        },
        "brandPersonality": {
            "traits": ["Innovative", "Trustworthy", "Creative", "Empowering", "Modern"],
            "archetype": "The Creator — driven by imagination and the desire to build things of enduring value",
            "tone": "Confident, warm, inspiring",
            "doList": ["Be clear and concise", "Inspire with examples", "Celebrate creativity", "Show empathy"],
            "dontList": ["Use jargon", "Be condescending", "Overpromise", "Be generic"],
        },
    }


# ==================== POSTER GENERATION ====================

async def generate_poster(prompt: str, size: str = None, event_type: str = None, industry: str = None, style: str = None) -> dict:
    system_prompt = """You are an expert poster designer. Generate a poster concept as JSON with keys:
    headline, subheadline, layout, colorScheme (array of {hex, name, usage}), typography, imagePrompt,
    designElements (array of strings), printSpecs."""

    user_prompt = f"Create a poster: {prompt}"
    if size: user_prompt += f"\nSize: {size}"
    if event_type: user_prompt += f"\nEvent type: {event_type}"
    if style: user_prompt += f"\nStyle: {style}"

    result = await _call_openai(system_prompt, user_prompt)
    if result: return result

    return {
        "headline": f"Experience the extraordinary — {prompt}",
        "subheadline": "Where creativity meets innovation. Join us for an unforgettable experience.",
        "layout": "Full-bleed background image with centered text overlay. Bold headline in top third, supporting text and details in the center, CTA and date/location at the bottom with a contrasting band.",
        "colorScheme": [
            {"hex": "#FF6B6B", "name": "Coral Red", "usage": "Primary headline color"},
            {"hex": "#4ECDC4", "name": "Ocean Teal", "usage": "Accent and decorative elements"},
            {"hex": "#1A1A2E", "name": "Deep Navy", "usage": "Background overlay"},
            {"hex": "#F8F9FA", "name": "Pure White", "usage": "Body text"},
            {"hex": "#FFE66D", "name": "Golden Yellow", "usage": "CTA highlight"},
        ],
        "typography": {"headline": "Bebas Neue, 72pt, uppercase", "body": "Montserrat, 18pt, regular", "accent": "Raleway, 14pt, semibold"},
        "imagePrompt": f"Professional poster design for {prompt}, dramatic lighting, cinematic composition, high contrast, 8k quality",
        "designElements": ["Geometric overlay patterns", "Gradient mesh background", "Floating particle effects", "Gold foil accents on key text"],
        "printSpecs": {"size": size or "24x36 inches", "bleed": "0.25 inches", "resolution": "300 DPI", "colorMode": "CMYK"},
    }


# ==================== BANNER CREATION ====================

async def generate_banner(prompt: str, dimensions: str = None, platform: str = None, style: str = None) -> dict:
    system_prompt = """You are a digital banner designer. Generate a banner concept as JSON with keys:
    headline, tagline, layout, colorPalette (array), typography, imagePrompt, ctaButton, dimensions, animationSuggestions."""

    user_prompt = f"Create a banner: {prompt}"
    if platform: user_prompt += f"\nPlatform: {platform}"
    if dimensions: user_prompt += f"\nDimensions: {dimensions}"

    result = await _call_openai(system_prompt, user_prompt)
    if result: return result

    return {
        "headline": f"Elevate Your Brand with {prompt}",
        "tagline": "Professional design that converts. Stand out from the competition.",
        "layout": "Left-aligned text block (60%) with product/hero image on right (40%). Gradient background from dark to light. CTA button bottom-left with hover animation.",
        "colorPalette": [
            {"hex": "#667EEA", "name": "Indigo", "usage": "Primary gradient start"},
            {"hex": "#764BA2", "name": "Purple", "usage": "Primary gradient end"},
            {"hex": "#FFFFFF", "name": "White", "usage": "Text and CTA"},
            {"hex": "#F093FB", "name": "Pink Glow", "usage": "Accent highlights"},
        ],
        "typography": {"headline": "Poppins Bold, 32px", "tagline": "Open Sans, 16px", "cta": "Poppins SemiBold, 14px uppercase"},
        "imagePrompt": f"Clean product banner, {prompt}, professional marketing design, gradient background, modern layout",
        "ctaButton": {"text": "Get Started Free →", "color": "#FF6B6B", "shape": "Rounded pill (border-radius: 50px)"},
        "dimensions": dimensions or "728x90, 300x250, 160x600",
        "animationSuggestions": ["Fade-in headline (0.5s)", "Slide-in CTA (0.8s)", "Subtle background gradient shift", "Hover scale on CTA (1.05x)"],
    }


# ==================== AD CREATIVE ====================

async def generate_ad_creative(prompt: str, platform: str = None, objective: str = None, audience: str = None, tone: str = None) -> dict:
    system_prompt = """You are an advertising creative director. Generate ad creative as JSON with keys:
    primaryText, headline, description, ctaButton, visualConcept, colorPalette (array), targetingTips (array),
    imagePrompt, variations (array of alternative headlines), performanceTips (array)."""

    user_prompt = f"Create an ad: {prompt}"
    if platform: user_prompt += f"\nPlatform: {platform}"
    if objective: user_prompt += f"\nObjective: {objective}"
    if audience: user_prompt += f"\nAudience: {audience}"

    result = await _call_openai(system_prompt, user_prompt)
    if result: return result

    return {
        "primaryText": f"🚀 Stop scrolling! {prompt} is here to transform the way you work. Join 10,000+ professionals who already made the switch.",
        "headline": f"Transform Your Workflow with {prompt.split()[0] if prompt.split() else 'AI'}",
        "description": "Start your free trial today. No credit card required. Cancel anytime.",
        "ctaButton": "Start Free Trial",
        "visualConcept": "Split-screen comparison (before/after). Left: cluttered, chaotic workspace. Right: clean, organized, AI-powered dashboard. Dramatic lighting contrast.",
        "colorPalette": [
            {"hex": "#4361EE", "name": "Electric Blue", "usage": "CTA and primary"},
            {"hex": "#F72585", "name": "Hot Pink", "usage": "Urgency elements"},
            {"hex": "#7209B7", "name": "Rich Purple", "usage": "Premium feel"},
            {"hex": "#FFFFFF", "name": "White", "usage": "Text"},
        ],
        "targetingTips": [
            "Target professionals aged 25-45 in creative industries",
            "Use interest-based targeting: design, marketing, branding",
            "Retarget website visitors with dynamic product ads",
            "Lookalike audiences from existing customer base",
        ],
        "imagePrompt": f"Professional ad creative for {prompt}, split-screen design, before and after comparison, clean modern style, marketing advertisement",
        "variations": [
            f"Ready to 10x your {prompt.split()[0] if prompt.split() else 'design'} output?",
            f"Your competitors already use {prompt.split()[0] if prompt.split() else 'AI'}. Do you?",
            f"From idea to execution in minutes — meet {prompt.split()[0] if prompt.split() else 'AI'}",
        ],
        "performanceTips": [
            "Test at least 3 headline variations",
            "Use social proof (numbers, testimonials) in primary text",
            "Keep video ads under 15 seconds for best completion rate",
            "Mobile-first design — 80%+ of impressions are mobile",
        ],
    }


# ==================== DESIGN ANALYSIS ====================

async def analyze_design(description: str, design_type: str = None, goals: str = None) -> dict:
    system_prompt = """You are a senior design critic. Analyze the design and provide JSON with keys:
    overallScore (1-100), strengths (array), weaknesses (array), improvements (array of {area, suggestion, priority}),
    accessibilityNotes (array), colorAnalysis, typographyAnalysis, layoutAnalysis, competitorComparison."""

    user_prompt = f"Analyze this design: {description}"
    if design_type: user_prompt += f"\nType: {design_type}"
    if goals: user_prompt += f"\nGoals: {goals}"

    result = await _call_openai(system_prompt, user_prompt)
    if result: return result

    return {
        "overallScore": 72,
        "strengths": [
            "Strong visual hierarchy guides the eye naturally",
            "Color palette creates emotional resonance with target audience",
            "Clean typography enhances readability",
            "Good use of whitespace prevents cognitive overload",
        ],
        "weaknesses": [
            "CTA button lacks sufficient contrast (fails WCAG AA)",
            "Font sizes may be too small on mobile devices",
            "Image-to-text ratio could be better balanced",
            "Missing clear visual flow for secondary actions",
        ],
        "improvements": [
            {"area": "Contrast", "suggestion": "Increase CTA button contrast ratio to 4.5:1 minimum", "priority": "High"},
            {"area": "Typography", "suggestion": "Increase body text to 16px minimum for mobile readability", "priority": "High"},
            {"area": "Layout", "suggestion": "Add more breathing room between sections (32px → 48px)", "priority": "Medium"},
            {"area": "Color", "suggestion": "Add a warm accent color to balance the cool palette", "priority": "Low"},
            {"area": "CTA", "suggestion": "Make primary CTA 20% larger and add micro-animation on hover", "priority": "Medium"},
        ],
        "accessibilityNotes": [
            "Add alt text to all decorative images",
            "Ensure 4.5:1 contrast ratio for all text elements",
            "Add focus indicators for keyboard navigation",
            "Test with screen readers for proper semantic structure",
        ],
        "colorAnalysis": "The palette uses analogous blue-purple tones which create harmony but may lack energy. Consider adding a complementary warm accent for CTA elements.",
        "typographyAnalysis": "The serif/sans-serif pairing works well for hierarchy. However, the line-height (1.4) could be increased to 1.6 for better readability.",
        "layoutAnalysis": "The grid-based layout is solid. The F-pattern reading flow is well-utilized. Consider adding visual anchors at key scroll positions.",
        "competitorComparison": "Compared to industry leaders, this design scores well on aesthetics but could improve on conversion-focused elements like social proof and urgency indicators.",
    }


# ==================== MOCKUP GENERATOR ====================

async def generate_mockup(prompt: str, product_type: str = None, style: str = None, brand: str = None) -> dict:
    system_prompt = """You are a product mockup specialist. Generate mockup concepts as JSON with keys:
    mockups (array of {name, description, sceneSetup, cameraAngle, lighting}), materialSpecs,
    imagePrompt, brandPlacement, exportFormats."""

    user_prompt = f"Create mockup for: {prompt}"
    if product_type: user_prompt += f"\nProduct: {product_type}"
    if brand: user_prompt += f"\nBrand: {brand}"

    result = await _call_openai(system_prompt, user_prompt)
    if result: return result

    return {
        "mockups": [
            {"name": "Hero Shot", "description": "Front-facing product shot with dramatic studio lighting", "sceneSetup": "Minimal white surface with subtle shadow, product centered", "cameraAngle": "Slightly elevated (15°), front-facing", "lighting": "Key light at 45°, soft fill, rim light for depth"},
            {"name": "Lifestyle Context", "description": "Product in natural use environment", "sceneSetup": "Modern desk/workspace with complementary props", "cameraAngle": "3/4 angle, shallow depth of field", "lighting": "Natural window light with warm tones"},
            {"name": "Detail Close-up", "description": "Macro shot highlighting craftsmanship and details", "sceneSetup": "Isolated on gradient background", "cameraAngle": "Close macro, 30° tilt", "lighting": "Soft diffused lighting, no harsh shadows"},
            {"name": "Multi-Device Array", "description": "Product shown across multiple device sizes", "sceneSetup": "Devices arranged in cascading layout", "cameraAngle": "Top-down isometric (30°)", "lighting": "Even ambient lighting"},
        ],
        "materialSpecs": {"finish": "Matte with subtle texture", "reflectivity": "Low (0.2)", "shadowIntensity": "Medium-soft"},
        "imagePrompt": f"Professional product mockup, {prompt}, studio photography, clean background, commercial quality, 8k",
        "brandPlacement": {"logoPosition": "Center or upper-third", "colorOverlay": "Brand primary at 10% opacity", "watermark": "Bottom-right, 30% opacity"},
        "exportFormats": ["PNG (transparent bg)", "JPEG (white bg)", "PSD (layered)", "WebP (optimized)"],
    }


# ==================== SMART RESIZE ====================

async def smart_resize(prompt: str, original_platform: str = None, target_platforms: list = None) -> dict:
    system_prompt = """You are a multi-platform design expert. Suggest resize strategies as JSON with keys:
    resizes (array of {platform, dimensions, aspectRatio, adjustments, focusArea}), generalTips (array),
    contentPriority, cropSuggestions."""

    user_prompt = f"Resize design: {prompt}"
    if original_platform: user_prompt += f"\nOriginal platform: {original_platform}"

    result = await _call_openai(system_prompt, user_prompt)
    if result: return result

    platforms = target_platforms or ["instagram_post", "instagram_story", "facebook_cover", "twitter_header", "linkedin_banner", "youtube_thumbnail"]
    specs = {
        "instagram_post": {"dimensions": "1080x1080", "aspectRatio": "1:1", "name": "Instagram Post"},
        "instagram_story": {"dimensions": "1080x1920", "aspectRatio": "9:16", "name": "Instagram Story"},
        "facebook_cover": {"dimensions": "820x312", "aspectRatio": "2.63:1", "name": "Facebook Cover"},
        "twitter_header": {"dimensions": "1500x500", "aspectRatio": "3:1", "name": "Twitter/X Header"},
        "linkedin_banner": {"dimensions": "1128x191", "aspectRatio": "5.91:1", "name": "LinkedIn Banner"},
        "youtube_thumbnail": {"dimensions": "1280x720", "aspectRatio": "16:9", "name": "YouTube Thumbnail"},
    }

    return {
        "resizes": [
            {
                "platform": specs.get(p, {"name": p}).get("name", p),
                "dimensions": specs.get(p, {}).get("dimensions", "1080x1080"),
                "aspectRatio": specs.get(p, {}).get("aspectRatio", "1:1"),
                "adjustments": ["Reposition key elements to center", "Scale text for readability", "Adjust padding for safe zones"],
                "focusArea": "Center-weighted with key message visible",
            }
            for p in platforms
        ],
        "generalTips": [
            "Always design for the smallest size first (mobile-first)",
            "Keep text within the safe zone (80% of canvas)",
            "Test readability at actual display size",
            "Maintain brand consistency across all sizes",
        ],
        "contentPriority": "1) Headline text  2) Hero image  3) CTA  4) Logo  5) Supporting text",
        "cropSuggestions": "Use content-aware cropping to keep focal point centered. For extreme aspect ratios (LinkedIn banner), consider creating a simplified version.",
    }


# ==================== TREND ANALYSIS ====================

async def analyze_trends(industry: str, region: str = None, timeframe: str = None) -> dict:
    system_prompt = """You are a design trend analyst. Provide trend analysis as JSON with keys:
    trends (array of {name, description, popularity, examples}), colorTrends (array),
    typographyTrends (array), styleTrends (array), predictions (array), industryInsights."""

    user_prompt = f"Analyze design trends for: {industry}"
    if region: user_prompt += f"\nRegion: {region}"
    if timeframe: user_prompt += f"\nTimeframe: {timeframe}"

    result = await _call_openai(system_prompt, user_prompt)
    if result: return result

    return {
        "trends": [
            {"name": "AI-Generated Visuals", "description": "Brands incorporating AI-generated artwork and textures into their visual identity", "popularity": 95, "examples": ["Custom AI textures", "Generated product backgrounds", "AI-assisted logo variations"]},
            {"name": "3D & Immersive Design", "description": "Three-dimensional elements and spatial design creating depth and interactivity", "popularity": 88, "examples": ["3D product renders", "Isometric illustrations", "Augmented reality overlays"]},
            {"name": "Neo-Brutalism", "description": "Bold borders, raw aesthetics, and intentionally rough design elements", "popularity": 72, "examples": ["Thick black borders", "Bright clash colors", "Visible grid systems"]},
            {"name": "Glassmorphism 2.0", "description": "Frosted glass effects with improved accessibility and depth layering", "popularity": 80, "examples": ["Layered translucent cards", "Blurred background panels", "Gradient glass effects"]},
            {"name": "Motion-First Design", "description": "Designing with animation and transitions as core elements, not afterthoughts", "popularity": 85, "examples": ["Scroll-triggered animations", "Micro-interactions", "Animated logos"]},
        ],
        "colorTrends": [
            {"color": "#6C5CE7", "name": "Digital Lavender", "trend": "Rising — calming yet tech-forward"},
            {"color": "#00B894", "name": "Eco Green", "trend": "Stable — sustainability messaging"},
            {"color": "#E17055", "name": "Warm Coral", "trend": "Rising — human warmth in AI era"},
            {"color": "#0984E3", "name": "Electric Blue", "trend": "Stable — trust and technology"},
            {"color": "#FDCB6E", "name": "Gen-Z Yellow", "trend": "Rising — optimism and energy"},
        ],
        "typographyTrends": [
            {"font": "Variable Fonts", "trend": "Major trend — single font file with weight/width axes"},
            {"font": "Rounded Sans-Serif", "trend": "Approachable, friendly brand personalities"},
            {"font": "Retro Serif Revival", "trend": "Heritage brands modernizing classic typefaces"},
            {"font": "Custom Brand Typefaces", "trend": "Major brands commissioning bespoke fonts"},
        ],
        "styleTrends": [
            "Maximalist gradients replacing flat design",
            "Hand-drawn elements mixed with digital precision",
            "Dark mode as default design consideration",
            "Inclusive and diverse imagery in all materials",
        ],
        "predictions": [
            "AI-human collaborative design will become the standard workflow by 2027",
            "Real-time personalized design (different visuals per user) will grow 300%",
            "Sustainability-focused design (eco-palettes, minimal ink) will be required by major brands",
        ],
        "industryInsights": f"The {industry} industry is experiencing a shift toward authenticity and transparency. Brands that combine cutting-edge technology with human-centered design are outperforming competitors by 40% in engagement metrics.",
    }
