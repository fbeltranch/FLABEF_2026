import { storage } from "./storage";

export async function initializeFooters() {
  try {
    const existingFooters = await storage.getAllFooters();
    
    if (existingFooters.length > 0) {
      console.log(`[init] Database already has ${existingFooters.length} footers. Skipping.`);
      return;
    }

    console.log("[init] Initializing sample footers...");

    const sampleFooters = [
      {
        section: "tech",
        title: "FLABEF Tech Store",
        description: "Tu tienda online de confianza para ropa, accesorios y tecnología de calidad",
        address: "Av. Principal 123, Lima, Perú",
        phone: "+51 925 330 577",
        email: "tech@flabef.com",
        socialLinks: {
          facebook: "https://facebook.com/flabef",
          instagram: "https://instagram.com/flabef",
          tiktok: "https://tiktok.com/@flabef",
          whatsapp: "https://wa.me/51925330577"
        }
      },
      {
        section: "it_services",
        title: "FLABEF IT Services",
        description: "Soporte técnico profesional y soluciones tecnológicas para empresas",
        address: "Av. Principal 123, Lima, Perú",
        phone: "+51 925 330 577",
        email: "it@flabef.com",
        socialLinks: {
          facebook: "https://facebook.com/flabef",
          instagram: "https://instagram.com/flabef",
          tiktok: "https://tiktok.com/@flabef",
          whatsapp: "https://wa.me/51925330577"
        }
      },
      {
        section: "food",
        title: "FLABEF Food Service",
        description: "Comida casera peruana de calidad, preparada con ingredientes frescos",
        address: "Av. Principal 123, Lima, Perú",
        phone: "+51 925 330 577",
        email: "food@flabef.com",
        socialLinks: {
          facebook: "https://facebook.com/flabef",
          instagram: "https://instagram.com/flabef",
          tiktok: "https://tiktok.com/@flabef",
          whatsapp: "https://wa.me/51925330577"
        }
      }
    ];

    for (const footer of sampleFooters) {
      await storage.updateFooter(footer.section, {
        title: footer.title,
        description: footer.description,
        address: footer.address,
        phone: footer.phone,
        email: footer.email,
        socialLinks: footer.socialLinks,
      });
    }

    console.log(`[init] Created ${sampleFooters.length} sample footers`);
  } catch (error) {
    console.error("[init] Failed to initialize footers:", error);
  }
}
