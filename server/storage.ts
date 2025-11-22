import { 
  type TechProduct, 
  type InsertTechProduct,
  type ITService,
  type InsertITService,
  type FoodItem,
  type InsertFoodItem,
  type CartItem,
  type InsertCartItem,
  type ContactRequest,
  type InsertContactRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Tech Products
  getTechProducts(category?: string): Promise<TechProduct[]>;
  getTechProduct(id: string): Promise<TechProduct | undefined>;
  createTechProduct(product: InsertTechProduct): Promise<TechProduct>;
  updateTechProduct(id: string, product: Partial<InsertTechProduct>): Promise<TechProduct | undefined>;
  deleteTechProduct(id: string): Promise<boolean>;
  
  // IT Services
  getITServices(): Promise<ITService[]>;
  getITService(id: string): Promise<ITService | undefined>;
  createITService(service: InsertITService): Promise<ITService>;
  updateITService(id: string, service: Partial<InsertITService>): Promise<ITService | undefined>;
  deleteITService(id: string): Promise<boolean>;
  
  // Food Items
  getFoodItems(category?: string): Promise<FoodItem[]>;
  getFoodItem(id: string): Promise<FoodItem | undefined>;
  createFoodItem(item: InsertFoodItem): Promise<FoodItem>;
  updateFoodItem(id: string, item: Partial<InsertFoodItem>): Promise<FoodItem | undefined>;
  deleteFoodItem(id: string): Promise<boolean>;
  
  // Cart
  getCartItems(): Promise<CartItem[]>;
  getCartItem(id: string): Promise<CartItem | undefined>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<boolean>;
  clearCart(): Promise<void>;
  
  // Contact
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
}

export class MemStorage implements IStorage {
  private techProducts: Map<string, TechProduct>;
  private itServices: Map<string, ITService>;
  private foodItems: Map<string, FoodItem>;
  private cartItems: Map<string, CartItem>;
  private contactRequests: Map<string, ContactRequest>;

  constructor() {
    this.techProducts = new Map();
    this.itServices = new Map();
    this.foodItems = new Map();
    this.cartItems = new Map();
    this.contactRequests = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed Tech Products
    const techProductsData: InsertTechProduct[] = [
      {
        name: "Laptop Gaming ROG Strix G16",
        description: "Intel Core i7 13th Gen, RTX 4060, 16GB RAM, 512GB SSD, Pantalla 165Hz",
        price: "5499.00",
        category: "laptops",
        image: "/api/placeholder/400/300",
        featured: true,
        inStock: true,
      },
      {
        name: "PC Gamer RTX 4070 Ti",
        description: "Intel i7-13700K, RTX 4070 Ti, 32GB DDR5, 1TB NVMe, Gabinete RGB",
        price: "7999.00",
        category: "pcs",
        image: "/api/placeholder/400/300",
        featured: true,
        inStock: true,
      },
      {
        name: "Monitor LG UltraGear 27\" 144Hz",
        description: "IPS 1ms, QHD 2560x1440, HDR10, FreeSync Premium",
        price: "1299.00",
        category: "monitors",
        image: "/api/placeholder/400/300",
        featured: true,
        inStock: true,
      },
      {
        name: "Teclado Mecánico Logitech G Pro X",
        description: "Switch GX Blue, RGB, TKL, Cable extraíble, Tournament Ready",
        price: "549.00",
        category: "peripherals",
        image: "/api/placeholder/400/300",
        featured: true,
        inStock: true,
      },
      {
        name: "Laptop HP ProBook 450 G9",
        description: "Intel Core i5 12th Gen, 8GB RAM, 256GB SSD, Pantalla 15.6\" Full HD",
        price: "2799.00",
        category: "laptops",
        image: "/api/placeholder/400/300",
        featured: false,
        inStock: true,
      },
      {
        name: "SSD NVMe Samsung 980 Pro 1TB",
        description: "PCIe 4.0, Lectura 7000 MB/s, Ideal para gaming y edición",
        price: "449.00",
        category: "components",
        image: "/api/placeholder/400/300",
        featured: false,
        inStock: true,
      },
      {
        name: "Mouse Logitech G502 HERO",
        description: "25,600 DPI, 11 botones programables, RGB Lightsync",
        price: "249.00",
        category: "peripherals",
        image: "/api/placeholder/400/300",
        featured: false,
        inStock: true,
      },
      {
        name: "Audífonos HyperX Cloud II",
        description: "7.1 Surround, Micrófono cancelación ruido, Almohadillas memory foam",
        price: "399.00",
        category: "peripherals",
        image: "/api/placeholder/400/300",
        featured: false,
        inStock: true,
      },
    ];

    techProductsData.forEach(product => this.createTechProduct(product));

    // Seed IT Services
    const itServicesData: InsertITService[] = [
      {
        title: "Soporte Técnico Remoto",
        description: "Asistencia técnica profesional desde la comodidad de tu hogar u oficina",
        features: [
          "Acceso remoto seguro",
          "Diagnóstico en tiempo real",
          "Solución inmediata de problemas",
          "Disponible 24/7"
        ],
        icon: "laptop",
        available: true,
      },
      {
        title: "Armado y Optimización de PC",
        description: "Ensamblaje profesional de PCs gaming y workstation a medida",
        features: [
          "Selección de componentes",
          "Ensamblaje profesional",
          "Cable management premium",
          "Pruebas de rendimiento"
        ],
        icon: "settings",
        available: true,
      },
      {
        title: "Mantenimiento Preventivo",
        description: "Limpieza y optimización completa de tu equipo",
        features: [
          "Limpieza interna profunda",
          "Renovación pasta térmica",
          "Optimización de software",
          "Backup de datos"
        ],
        icon: "wrench",
        available: true,
      },
      {
        title: "Reparación de Hardware",
        description: "Diagnóstico y reparación de componentes defectuosos",
        features: [
          "Diagnóstico preciso",
          "Reparación de placa madre",
          "Reemplazo de componentes",
          "Garantía de servicio"
        ],
        icon: "hardDrive",
        available: true,
      },
      {
        title: "Instalación de Software",
        description: "Instalación y configuración de sistemas operativos y programas",
        features: [
          "Windows 10/11 original",
          "Drivers actualizados",
          "Software de productividad",
          "Antivirus y seguridad"
        ],
        icon: "shield",
        available: true,
      },
      {
        title: "Soporte para Empresas",
        description: "Soluciones IT corporativas y mantenimiento de redes",
        features: [
          "Configuración de redes",
          "Servidores y NAS",
          "Mantenimiento preventivo",
          "Soporte on-site"
        ],
        icon: "database",
        available: true,
      },
    ];

    itServicesData.forEach(service => this.createITService(service));

    // Seed Food Items
    const foodItemsData: InsertFoodItem[] = [
      {
        name: "Lomo Saltado",
        description: "Jugosos trozos de carne salteados con cebolla, tomate y papas fritas, acompañado de arroz blanco",
        price: "18.00",
        category: "almuerzos",
        image: "/api/placeholder/400/300",
        available: true,
      },
      {
        name: "Arroz con Pollo",
        description: "Tradicional arroz verde con pollo dorado, papa a la huancaína y ensalada fresca",
        price: "15.00",
        category: "almuerzos",
        image: "/api/placeholder/400/300",
        available: true,
      },
      {
        name: "Pollo a la Plancha",
        description: "Pechuga de pollo jugosa con ensalada fresca, arroz blanco y papas doradas",
        price: "14.00",
        category: "almuerzos",
        image: "/api/placeholder/400/300",
        available: true,
      },
      {
        name: "Desayuno Completo",
        description: "Café, pan con mantequilla, huevos revueltos, jugo de naranja y fruta fresca",
        price: "12.00",
        category: "desayunos",
        image: "/api/placeholder/400/300",
        available: true,
      },
      {
        name: "Tamales Peruanos",
        description: "Tamales caseros de pollo o cerdo, servidos con salsa criolla y pan",
        price: "8.00",
        category: "desayunos",
        image: "/api/placeholder/400/300",
        available: true,
      },
      {
        name: "Chicha Morada",
        description: "Refrescante bebida tradicional peruana hecha con maíz morado y frutas",
        price: "5.00",
        category: "snacks",
        image: "/api/placeholder/400/300",
        available: true,
      },
    ];

    foodItemsData.forEach(item => this.createFoodItem(item));
  }

  // Tech Products
  async getTechProducts(category?: string): Promise<TechProduct[]> {
    const products = Array.from(this.techProducts.values());
    if (category && category !== "all") {
      return products.filter(p => p.category === category);
    }
    return products;
  }

  async getTechProduct(id: string): Promise<TechProduct | undefined> {
    return this.techProducts.get(id);
  }

  async createTechProduct(insertProduct: InsertTechProduct): Promise<TechProduct> {
    const id = randomUUID();
    const product: TechProduct = { ...insertProduct, id };
    this.techProducts.set(id, product);
    return product;
  }

  async updateTechProduct(id: string, updates: Partial<InsertTechProduct>): Promise<TechProduct | undefined> {
    const product = this.techProducts.get(id);
    if (!product) return undefined;
    
    // Filter out undefined values to prevent accidental field clearing
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    ) as Partial<InsertTechProduct>;
    
    const updatedProduct = { ...product, ...filteredUpdates };
    this.techProducts.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteTechProduct(id: string): Promise<boolean> {
    return this.techProducts.delete(id);
  }

  // IT Services
  async getITServices(): Promise<ITService[]> {
    return Array.from(this.itServices.values());
  }

  async getITService(id: string): Promise<ITService | undefined> {
    return this.itServices.get(id);
  }

  async createITService(insertService: InsertITService): Promise<ITService> {
    const id = randomUUID();
    const service: ITService = { ...insertService, id };
    this.itServices.set(id, service);
    return service;
  }

  async updateITService(id: string, updates: Partial<InsertITService>): Promise<ITService | undefined> {
    const service = this.itServices.get(id);
    if (!service) return undefined;
    
    // Filter out undefined values to prevent accidental field clearing
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    ) as Partial<InsertITService>;
    
    const updatedService = { ...service, ...filteredUpdates };
    this.itServices.set(id, updatedService);
    return updatedService;
  }

  async deleteITService(id: string): Promise<boolean> {
    return this.itServices.delete(id);
  }

  // Food Items
  async getFoodItems(category?: string): Promise<FoodItem[]> {
    const items = Array.from(this.foodItems.values());
    if (category && category !== "all") {
      return items.filter(i => i.category === category);
    }
    return items;
  }

  async getFoodItem(id: string): Promise<FoodItem | undefined> {
    return this.foodItems.get(id);
  }

  async createFoodItem(insertItem: InsertFoodItem): Promise<FoodItem> {
    const id = randomUUID();
    const item: FoodItem = { ...insertItem, id };
    this.foodItems.set(id, item);
    return item;
  }

  async updateFoodItem(id: string, updates: Partial<InsertFoodItem>): Promise<FoodItem | undefined> {
    const item = this.foodItems.get(id);
    if (!item) return undefined;
    
    // Filter out undefined values to prevent accidental field clearing
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    ) as Partial<InsertFoodItem>;
    
    const updatedItem = { ...item, ...filteredUpdates };
    this.foodItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteFoodItem(id: string): Promise<boolean> {
    return this.foodItems.delete(id);
  }

  // Cart
  async getCartItems(): Promise<CartItem[]> {
    return Array.from(this.cartItems.values());
  }

  async getCartItem(id: string): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = { ...insertItem, id };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(): Promise<void> {
    this.cartItems.clear();
  }

  // Contact
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = randomUUID();
    const request: ContactRequest = { ...insertRequest, id };
    this.contactRequests.set(id, request);
    return request;
  }
}

export const storage = new MemStorage();
