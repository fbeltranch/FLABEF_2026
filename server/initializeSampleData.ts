import { storage } from "./storage";
import { randomUUID } from "crypto";

export async function initializeITServices() {
  try {
    const existingServices = await storage.getITServices();
    
    if (existingServices.length > 0) {
      console.log(`[init] Database already has ${existingServices.length} IT services. Skipping.`);
      return;
    }

    console.log("[init] Initializing sample IT services...");

    const sampleServices = [
      {
        id: randomUUID(),
        title: "Mantenimiento Preventivo",
        description: "Mantenimiento regular de tu infraestructura tecnológica para evitar problemas",
        features: [
          "Limpieza de equipos",
          "Actualizaciones de software",
          "Optimización de sistemas",
          "Respaldo automático de datos"
        ],
        icon: "Wrench",
        available: true,
      },
      {
        id: randomUUID(),
        title: "Venta de Licencias",
        description: "Acceso a las mejores licencias de software del mercado con precios competitivos",
        features: [
          "Microsoft Office",
          "Antivirus profesionales",
          "Sistemas operativos",
          "Software de productividad"
        ],
        icon: "Cpu",
        available: true,
      },
      {
        id: randomUUID(),
        title: "Soporte Técnico 24/7",
        description: "Asistencia técnica disponible en cualquier momento del día",
        features: [
          "Respuesta inmediata",
          "Soporte remoto",
          "Ticket de seguimiento",
          "Garantía de solución"
        ],
        icon: "Headphones",
        available: true,
      },
      {
        id: randomUUID(),
        title: "Instalación de Redes",
        description: "Diseño e instalación de redes empresariales de alta velocidad",
        features: [
          "Fibra óptica",
          "WiFi profesional",
          "Seguridad de red",
          "Configuración completa"
        ],
        icon: "Database",
        available: true,
      },
      {
        id: randomUUID(),
        title: "Seguridad Informática",
        description: "Protección contra amenazas cibernéticas y vulnerabilidades",
        features: [
          "Análisis de seguridad",
          "Firewall avanzado",
          "Detección de intrusos",
          "Capacitación en seguridad"
        ],
        icon: "Shield",
        available: true,
      },
    ];

    for (const service of sampleServices) {
      await storage.createITService(service);
    }

    console.log(`[init] Created ${sampleServices.length} sample IT services`);
  } catch (error) {
    console.error("[init] Failed to initialize IT services:", error);
  }
}

export async function initializeFoodItems() {
  try {
    const existingFoods = await storage.getFoodItems();
    
    if (existingFoods.length > 0) {
      console.log(`[init] Database already has ${existingFoods.length} food items. Skipping.`);
      return;
    }

    console.log("[init] Initializing sample food items...");

    const sampleFoods = [
      // Desayunos
      {
        id: randomUUID(),
        name: "Desayuno Peruano Tradicional",
        description: "Pan casero, queso fresco, jamón serrano y café peruano",
        price: 18.50,
        category: "desayunos",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Tortilla de Huevo Andina",
        description: "Tortilla casera con queso de región y papas cocidas",
        price: 16.00,
        category: "desayunos",
        image: "https://images.unsplash.com/photo-1553621042-f06b0442b727?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Tamales Caseros",
        description: "Tamales rellenos de pollo y vegetales, envueltos en hojas de maíz",
        price: 12.00,
        category: "desayunos",
        image: "https://images.unsplash.com/photo-1607220591413-4ec007e70023?w=500&h=500&fit=crop",
        available: true,
      },

      // Almuerzos
      {
        id: randomUUID(),
        name: "Ceviche Mixto Premium",
        description: "Ceviche con pescado, camarón y calamar en jugos naturales",
        price: 35.00,
        category: "almuerzos",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Ají de Gallina Criollo",
        description: "Pollo desmenuzado en salsa de ají amarillo con papa y huevo",
        price: 22.00,
        category: "almuerzos",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Lomo Saltado",
        description: "Lomo fino salteado con cebolla, tomate y papas fritas",
        price: 32.50,
        category: "almuerzos",
        image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Sopa a la Criolla",
        description: "Sopa casera con fideos, huevo, queso y trozos de verdura",
        price: 14.00,
        category: "almuerzos",
        image: "https://images.unsplash.com/photo-1547592166-7aae4d755744?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Causa Limeña",
        description: "Causa de papa amarilla con relleno de atún y aguacate",
        price: 18.00,
        category: "almuerzos",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
        available: true,
      },

      // Snacks
      {
        id: randomUUID(),
        name: "Empanadas Criollas",
        description: "Empanadas de harina casera rellenas de carne y huevo",
        price: 10.00,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd97a2b?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Papas Rellenas",
        description: "Papas doradas rellenas de carne molida y vegetales",
        price: 12.50,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd97a2b?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Croquetas de Jamón",
        description: "Croquetas caseras de jamón serrano y queso",
        price: 9.50,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd97a2b?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Anticuchos de Corazón",
        description: "Trozos de corazón marinados en especia y vinagre a la parrilla",
        price: 15.00,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561a1a?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Chicha Morada",
        description: "Bebida tradicional peruana de maíz morado con frutas",
        price: 5.00,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1544252891-bac62b09b87d?w=500&h=500&fit=crop",
        available: true,
      },
      {
        id: randomUUID(),
        name: "Limonada Natural",
        description: "Limonada fresca hecha con limones naturales",
        price: 4.50,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1523677745891-6f3f1b912779?w=500&h=500&fit=crop",
        available: true,
      },
    ];

    for (const food of sampleFoods) {
      await storage.createFoodItem(food);
    }

    console.log(`[init] Created ${sampleFoods.length} sample food items`);
  } catch (error) {
    console.error("[init] Failed to initialize food items:", error);
  }
}
