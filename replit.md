# FLABEF - Sitio Web Profesional Multidisciplinario

## Descripción General
FLABEF es un negocio multidisciplinario con tres divisiones principales:
1. **FLABEF Tech Store** - E-commerce de tecnología (laptops, PCs, componentes, periféricos)
2. **FLABEF IT Services** - Servicios de soporte técnico profesional
3. **FLABEF Food Service** - Comida casera peruana

## Arquitectura del Proyecto

### Frontend (React + TypeScript + Tailwind + Shadcn)
- **Páginas principales**:
  - `/` - Tech Store (catálogo de productos tecnológicos con carrito de compras)
  - `/it-services` - Servicios IT (soporte técnico, formulario de contacto)
  - `/food` - Food Service (menú de comida casera peruana)

- **Componentes clave**:
  - `Navbar` - Navegación principal entre las 3 divisiones
  - `WhatsAppButton` - Botón flotante y inline para contacto (Tel: 925330577)
  - `ShoppingCartSheet` - Panel lateral del carrito de compras
  - Hero sections diferenciadas para cada división

- **Diseño**:
  - Tech Store: Azul eléctrico (#0066FF), negro, gris metálico, estética futurista
  - IT Services: Azul corporativo (#1E40AF), plata, blanco, profesional
  - Food Service: Naranja cálido (#F97316), marrón tierra, acogedora
  - Tipografía: Poppins, Inter
  - Transiciones suaves, hover states con elevate utilities

### Backend (Express + TypeScript)
- **Storage**: In-memory (MemStorage) con datos de ejemplo
- **API Endpoints**:
  - `/api/tech-products` - CRUD productos tecnológicos
  - `/api/it-services` - Listado de servicios IT
  - `/api/food-items` - Menú de comida
  - `/api/cart` - Gestión del carrito de compras
  - `/api/contact` - Formularios de contacto

### Schemas (shared/schema.ts)
- `TechProduct` - Productos tecnológicos con categorías
- `ITService` - Servicios de soporte técnico
- `FoodItem` - Platos del menú
- `CartItem` - Items en el carrito
- `ContactRequest` - Solicitudes de contacto

## Características Principales

### WhatsApp Integration
- Botón flotante siempre visible en todas las páginas
- CTAs estratégicos en cada sección
- Número: 925330577
- Mensajes pre-formateados según contexto

### E-commerce Tech Store
- Catálogo con filtros por categoría
- Búsqueda de productos
- Carrito de compras funcional
- Sección "Ofertas del Día" con productos destacados
- Checkout directo a WhatsApp con resumen del pedido

### IT Services
- Grid de servicios con iconografía
- Formulario de contacto rápido
- Redirección automática a WhatsApp
- Trust badges (24/7, certificados, garantía)

### Food Service
- Menú categorizado (desayunos, almuerzos, snacks)
- Imágenes apetitosas de platos
- Pedidos directos por WhatsApp
- Indicadores de disponibilidad

## Tecnologías Utilizadas
- React 18 + TypeScript
- Wouter (routing)
- TanStack Query (data fetching)
- Shadcn UI + Tailwind CSS
- Lucide React (iconos)
- Express.js
- Drizzle ORM + Zod (validación)

## SEO
- Meta tags optimizados
- Open Graph para redes sociales
- Descripciones únicas por página
- Títulos descriptivos

## Estado Actual del Proyecto
- ✅ Schema completo definido
- ✅ Frontend completo con todas las páginas
- ✅ Componentes reutilizables
- ✅ Diseño responsive
- ✅ Imágenes generadas con IA
- ⏳ Backend en desarrollo
- ⏳ Integración frontend-backend pendiente
- ⏳ Testing pendiente

## Próximos Pasos
1. Implementar backend con datos de ejemplo
2. Conectar frontend a API
3. Testing end-to-end
4. Optimizaciones finales
