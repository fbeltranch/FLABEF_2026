import { storage } from "./storage";

export async function initializeSettings() {
  try {
    const existingSettings = await storage.getAllSiteSettings();
    
    if (existingSettings.length > 0) {
      console.log(`[init] Database already has ${existingSettings.length} settings. Skipping.`);
      return;
    }

    console.log("[init] Initializing site settings...");

    const defaultSettings = {
      branding: {
        siteName: "FLABEF",
        logo: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=200&h=200&fit=crop",
        description: "Tienda multidisciplinaria con ropa, tecnología, servicios IT y comidas caseras"
      },
      tech_hero: {
        badge: "FLABEF Store",
        title: "Todo lo que necesitas en un solo lugar",
        subtitle: "Ropa, accesorios, mochilas y tecnología de calidad premium",
        cta1Text: "Ver Catálogo",
        cta2Text: "Consultar por WhatsApp",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop"
      },
      it_hero: {
        badge: "FLABEF IT Services",
        title: "Soporte Técnico Profesional 24/7",
        subtitle: "Soluciones tecnológicas empresariales con garantía y respaldo profesional",
        cta1Text: "Contactar Ahora",
        cta2Text: "Ver Servicios",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop"
      },
      food_hero: {
        badge: "FLABEF Food Service",
        title: "Sabor Casero para tu Día",
        subtitle: "Platos peruanos tradicionales preparados con cariño y frescura",
        cta1Text: "Hacer Pedido Ahora",
        cta2Text: "Ver Menú",
        image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=600&fit=crop"
      }
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await storage.updateSiteSetting(key, value as Record<string, any>);
    }

    console.log(`[init] Created ${Object.keys(defaultSettings).length} site settings`);
  } catch (error) {
    console.error("[init] Failed to initialize settings:", error);
  }
}
