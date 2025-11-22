# FLABEF - Sitio Web Profesional Multidisciplinario

## Descripción General
FLABEF es un negocio multidisciplinario con tres divisiones principales:
1. **FLABEF Tech Store** - E-commerce de tecnología (ropa, accesorios, mochilas, laptops, PCs, periféricos)
2. **FLABEF IT Services** - Servicios de soporte técnico profesional
3. **FLABEF Food Service** - Comida casera peruana

## Arquitectura del Proyecto

### Frontend (React + TypeScript + Tailwind + Shadcn)
- **Páginas principales**:
  - `/` - Tech Store (catálogo de productos con carrito de compras)
  - `/it-services` - Servicios IT (soporte técnico, formulario de contacto)
  - `/food` - Food Service (menú de comida casera peruana)
  - `/admin-secret-2024` - Admin Dashboard (gestión de contenido)
  - `/forgot-password` - Reset de contraseña

- **Componentes clave**:
  - `Navbar` - Navegación principal entre las 3 divisiones
  - `WhatsAppButton` - Botón flotante y inline para contacto (Tel: 925330577)
  - `ShoppingCartSheet` - Panel lateral del carrito de compras
  - `AdminDashboard` - Panel admin con CRUD para productos y categorías
  - Hero sections editables para cada división

- **Diseño**:
  - Tech Store: Azul eléctrico (#0066FF), negro, gris metálico
  - IT Services: Azul corporativo (#1E40AF), plata, blanco
  - Food Service: Naranja cálido (#F97316), marrón tierra
  - Responsive design con breakpoints Tailwind
  - Transiciones suaves con Framer Motion

### Backend (Express + TypeScript)
- **Storage**: PostgreSQL con Drizzle ORM (datos persistentes)
- **Autenticación**: Sistema de admin con rol-based access control
- **API Endpoints**:
  - `/api/products` - CRUD productos
  - `/api/product-categories` - CRUD categorías de productos
  - `/api/food-items` - CRUD comida
  - `/api/food-categories` - CRUD categorías de comida
  - `/api/cart` - Gestión del carrito
  - `/api/contact` - Formularios de contacto
  - `/api/settings` - Configuración editable (hero, footer, branding)
  - `/api/admin/**` - Endpoints de admin (autenticados)
  - `/api/password-reset/**` - Reset de contraseña

### Database (PostgreSQL)
- Tablas: users, products, product_categories, food_items, food_categories, cart_items, settings
- Migrations via Drizzle ORM (`npm run db:push`)

### Schemas (shared/schema.ts)
- `User` - Admin users con roles (super_admin, editor, viewer)
- `Product` - Productos tecnológicos con categorías
- `ProductCategory` - Categorías de productos
- `FoodItem` - Platos del menú
- `FoodCategory` - Categorías de comida
- `CartItem` - Items en el carrito
- `Settings` - Configuración editable del sitio

## Características Principales

### ✅ Completado
- **WhatsApp Integration**: Botón flotante en todas las páginas, CTAs en heroes
- **E-commerce Tech Store**: Catálogo con filtros, búsqueda, carrito funcional, checkout a WhatsApp
- **IT Services**: Grid de servicios, formulario de contacto, integración WhatsApp
- **Food Service**: Menú categorizado, pedidos por WhatsApp
- **Admin Dashboard**: CRUD completo para productos y comida
- **Categorías persistentes**: Guardadas en BD con CRUD API
- **Password Reset**: SMS y Email con document verification (DNI, passport)
- **Role-based Access Control**: super_admin, editor, viewer
- **Editable UI**: Todo visual es configurable (hero, footer, branding, site name)
- **Security**: 
  - Admin URL oculta (`/admin-secret-2024`)
  - Rutas protegidas con autenticación
  - Sin botones públicos de admin en navbar
  - Document verification obligatoria para resets

## Tecnologías Utilizadas
- React 18 + TypeScript
- Wouter (routing)
- TanStack Query v5 (data fetching)
- Shadcn UI + Tailwind CSS
- Lucide React + react-icons (iconografía)
- Express.js
- PostgreSQL + Drizzle ORM
- Zod (validación)
- React Hook Form
- Framer Motion (animaciones)
- Tailwind Animate

## Super Admin por Defecto
- Email: admin@flabef.com
- DNI: 73611877
- Recovery Email: beltranchampionfernandoaugusto@gmail.com
- Password: Generado automáticamente en primer login

## Password Reset
- **Métodos**: SMS o Email
- **Requisito**: Documento válido (DNI=8 chars, passport, carnet de extranjería)
- **Flujo**: Documento → código enviado → nueva contraseña → login

## Deployment a Railway
1. Crear proyecto en Railway (https://railway.app)
2. Conectar repositorio GitHub
3. Configurar variables de entorno:
   - DATABASE_URL (Railway genera automáticamente)
   - Otras env vars si las necesitas
4. Deploy automático con cada push

## Testing Super Admin
- URL: http://localhost:5000/admin-secret-2024
- Email: admin@flabef.com
- DNI: 73611877 (para reset)

## Estado Actual
- ✅ **PROYECTO COMPLETO Y FUNCIONAL**
- ✅ Todas las características implementadas
- ✅ BD persistente funcionando
- ✅ Autenticación y autorización activas
- ✅ Todos los endpoints asegurados
- ✅ WhatsApp totalmente integrado
- ✅ Listo para desplegar a Railway

## Última Actualización
- Noviembre 22, 2025
- Arreglado: Botón WhatsApp en hero section TechStore
- Categorías persistentes en BD
- Seguridad reforzada en rutas IT Services y Food Items
