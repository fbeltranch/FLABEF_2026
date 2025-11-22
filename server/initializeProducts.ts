import { storage } from "./storage";
import { randomUUID } from "crypto";

export async function initializeProducts() {
  try {
    const existingProducts = await storage.getProducts();
    
    if (existingProducts.length > 0) {
      console.log(`[init] Database already has ${existingProducts.length} products. Skipping initialization.`);
      return;
    }

    console.log("[init] Initializing sample products...");

    const sampleProducts = [
      // Ropa
      {
        id: randomUUID(),
        name: "Camiseta Premium Negra",
        description: "Camiseta 100% algodón de alta calidad",
        price: 29.99,
        category: "camisetas",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      {
        id: randomUUID(),
        name: "Pantalón Casual Azul",
        description: "Pantalón de denim premium con ajuste perfecto",
        price: 59.99,
        category: "pantalones",
        image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop",
        stock: true,
        featured: false,
      },
      {
        id: randomUUID(),
        name: "Vestido Elegante Blanco",
        description: "Vestido casual perfecto para cualquier ocasión",
        price: 79.99,
        category: "vestidos",
        image: "https://images.unsplash.com/photo-1595607774223-ca3446b912c3?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      
      // Mochilas
      {
        id: randomUUID(),
        name: "Mochila Deportiva Negra",
        description: "Mochila resistente con compartimientos para laptop",
        price: 89.99,
        category: "mochilas",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      
      // Zapatos
      {
        id: randomUUID(),
        name: "Zapatillas Running Profesionales",
        description: "Zapatillas de última tecnología para running",
        price: 119.99,
        category: "zapatos",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        stock: true,
        featured: false,
      },
      
      // Accesorios
      {
        id: randomUUID(),
        name: "Reloj Inteligente Premium",
        description: "Reloj smartwatch con múltiples funciones",
        price: 199.99,
        category: "accesorios",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      
      // Laptops
      {
        id: randomUUID(),
        name: "Laptop ASUS VivoBook 15",
        description: "Laptop ultradelgada con procesador Intel de última generación",
        price: 899.99,
        category: "laptops",
        image: "https://images.unsplash.com/photo-1588872657840-790ff3a58f3c?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      {
        id: randomUUID(),
        name: "MacBook Pro 14 M3",
        description: "Laptop profesional de Apple con chip M3",
        price: 1999.99,
        category: "laptops",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      
      // PCs Armadas
      {
        id: randomUUID(),
        name: "PC Gaming RGB RTX 4070",
        description: "Computadora gaming de alto rendimiento con RTX 4070",
        price: 1899.99,
        category: "pcs",
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      
      // Monitores
      {
        id: randomUUID(),
        name: "Monitor Samsung 4K 32 pulgadas",
        description: "Monitor ultrawide 4K de 32 pulgadas para gaming",
        price: 599.99,
        category: "monitores",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
        stock: true,
        featured: false,
      },
      
      // Periféricos
      {
        id: randomUUID(),
        name: "Teclado Mecánico RGB",
        description: "Teclado mecánico con switches cherry mx",
        price: 179.99,
        category: "perifericos",
        image: "https://images.unsplash.com/photo-1587829191301-7c89a7d16df1?w=500&h=500&fit=crop",
        stock: true,
        featured: false,
      },
      {
        id: randomUUID(),
        name: "Ratón Gaming Logitech",
        description: "Ratón inalámbrico de precisión para gaming",
        price: 79.99,
        category: "perifericos",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
        stock: true,
        featured: false,
      },
      
      // Componentes
      {
        id: randomUUID(),
        name: "Procesador AMD Ryzen 7 7700X",
        description: "CPU de alto rendimiento con 8 núcleos",
        price: 449.99,
        category: "componentes",
        image: "https://images.unsplash.com/photo-1591290619552-a91cfbde9e4a?w=500&h=500&fit=crop",
        stock: true,
        featured: false,
      },
      {
        id: randomUUID(),
        name: "Tarjeta Gráfica RTX 4080",
        description: "GPU profesional para rendering y gaming",
        price: 1299.99,
        category: "componentes",
        image: "https://images.unsplash.com/photo-1591290619552-a91cfbde9e4a?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      
      // Smartphones
      {
        id: randomUUID(),
        name: "iPhone 15 Pro Max",
        description: "Último modelo de Apple con cámara mejorada",
        price: 1199.99,
        category: "smartphones",
        image: "https://images.unsplash.com/photo-1592286927505-1fed5a0b0a0e?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
      {
        id: randomUUID(),
        name: "Samsung Galaxy S24 Ultra",
        description: "Smartphone Android flagship de Samsung",
        price: 1299.99,
        category: "smartphones",
        image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop",
        stock: true,
        featured: true,
      },
    ];

    for (const product of sampleProducts) {
      await storage.createProduct(product);
    }

    console.log(`[init] Created ${sampleProducts.length} sample products`);
  } catch (error) {
    console.error("[init] Failed to initialize products:", error);
  }
}
