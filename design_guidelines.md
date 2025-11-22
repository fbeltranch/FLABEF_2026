# FLABEF Design Guidelines

## Design Approach

**Reference-Based Approach** drawing from premium e-commerce and multi-service platforms:
- **Tech Section**: Apple Store minimalism + Amazon functionality + Razer gaming aesthetic
- **IT Services**: Microsoft 365 professional aesthetic + enterprise SaaS platforms
- **Food Section**: Modern restaurant delivery platforms (UberEats polish)

**Core Principle**: Unified professional identity with distinct visual personalities per division while maintaining cohesive brand experience.

## Typography

**Primary Font**: Inter or Poppins (Google Fonts)
- **Hero Headlines**: 3xl-5xl, font-bold (48-60px desktop)
- **Section Titles**: 2xl-3xl, font-semibold (32-40px)
- **Product Names**: lg-xl, font-medium (18-24px)
- **Body Text**: base, font-normal (16px)
- **Captions/Labels**: sm, font-medium (14px)
- **Buttons**: base, font-semibold, uppercase tracking-wide

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24
- **Section Padding**: py-16 to py-24 (desktop), py-12 (mobile)
- **Component Gaps**: gap-6 to gap-8 for cards/grids
- **Container**: max-w-7xl with px-6 (standard), max-w-6xl for content-heavy sections
- **Card Padding**: p-6 to p-8

**Grid Systems**:
- Product catalogs: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Service cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Food menu: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

### Navigation
- **Main Header**: Full-width with logo, primary nav (Tech | IT Services | Food), WhatsApp CTA button
- **Division Switcher**: Pill-style tabs with active state indicators
- **Mobile**: Hamburger menu with smooth slide-out drawer

### E-Commerce Components
- **Product Cards**: Image (4:3 ratio), title, price, "Consultar WhatsApp" button, hover lift effect
- **Category Filters**: Horizontal scrollable chips with active states
- **"Ofertas del Día"**: Highlighted cards with badge overlay, 2-column grid
- **Shopping Cart**: Slide-out panel, product thumbnails, WhatsApp checkout CTA

### Service Components (IT)
- **Service Cards**: Icon (64px), title, bullet-point features, CTA button
- **Diagnostic Form**: Clean input fields, immediate WhatsApp redirect
- **Trust Indicators**: Icon-based feature list (24/7, warranty, professional)

### Food Components
- **Menu Items**: Large image (16:9), dish name, description, "Pedir por WhatsApp" button
- **Category Tabs**: Desayunos | Almuerzos | Snacks & Bebidas

### WhatsApp Integration
- **Floating Button**: Fixed bottom-right, 60px circle, green (#25D366), phone icon, z-50, pulse animation on page load
- **Inline CTAs**: Primary buttons with WhatsApp icon + text "Consultar/Pedir por WhatsApp"

### Cards & Containers
- **Standard Card**: Rounded-2xl, shadow-lg, border border-gray-100, hover:shadow-xl transition
- **Feature Cards**: Centered icon, title, short description, minimal padding

## Images

### Tech Store Section
- **Hero Image**: Full-width (h-screen or 80vh), high-end laptop/PC setup with RGB lighting, clean desk aesthetic, overlay gradient for text readability
- **Product Images**: White/light gray background, professional lighting, 1:1 or 4:3 ratio, consistent shadows
- **Banner Images**: Gaming setup, component close-ups, lifestyle tech usage

### IT Services Section  
- **Hero Image**: Professional technician workspace, organized cables, modern PC builds, 60vh height
- **Service Images**: Hands assembling PC, diagnostic tools, server racks, clean minimal aesthetic
- **Icon Grid**: 64px custom icons for each service type

### Food Section
- **Hero Image**: Hero dish beautifully plated, warm lighting, 50vh height
- **Menu Item Images**: 16:9 ratio, white plates, natural lighting, appetizing presentation
- **Background**: Subtle wood texture or warm gradient

**Image Treatment**: All product/food images should have subtle rounded corners (rounded-lg), consistent shadow-sm, and maintain aspect ratios using object-cover.

## Section-Specific Guidelines

### FLABEF Tech Store
- **Color Accents**: Electric blue (#0066FF), metallic gray (#64748B), pure black backgrounds for hero
- **Aesthetic**: Sleek, futuristic, high-contrast, gradient accents
- **Hero Section**: Full-screen background image, centered headline "Tecnología que impulsa tu productividad", dual CTAs (Ver Catálogo + Consultar WhatsApp)
- **Product Grid**: 4 columns desktop, 2 mobile, filter sidebar/top bar
- **Trust Badges**: Garantía oficial, Asesoría gratuita, Envío seguro

### FLABEF IT Services
- **Color Accents**: Corporate blue (#1E40AF), silver gray (#94A3B8), white backgrounds
- **Aesthetic**: Clean, professional, trustworthy, Microsoft-inspired
- **Hero Section**: 2-column layout - left: headline + service list, right: professional image
- **Service Grid**: 3 columns, icon-title-features-CTA structure
- **Highlight Banner**: "Soporte Técnico Profesional 24/7" with immediate contact options

### FLABEF Food Service
- **Color Accents**: Warm orange (#F97316), earthy brown (#92400E), cream backgrounds
- **Aesthetic**: Appetizing, homey, inviting, food photography focus
- **Hero Section**: Large hero dish image, headline "Sabor Casero para tu Día"
- **Menu Layout**: Category tabs, 3-column grid, large images with minimal text overlay
- **CTA Style**: Warm, friendly tone "Haz tu pedido ahora"

## Global Design Elements

- **Transitions**: All hover states use transition-all duration-300
- **Shadows**: Layered approach - sm for resting, lg for elevated, xl for active
- **Borders**: Subtle 1px borders in light gray, rounded corners throughout
- **Whitespace**: Generous section spacing (py-20+), breathing room around all elements
- **Iconography**: Heroicons for UI elements, custom SVG for division identifiers
- **Responsiveness**: Mobile-first, breakpoints at md (768px) and lg (1024px)