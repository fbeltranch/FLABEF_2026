import { 
  type Product, 
  type InsertProduct,
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
  // Products
  getProducts(category?: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
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
  private products: Map<string, Product>;
  private itServices: Map<string, ITService>;
  private foodItems: Map<string, FoodItem>;
  private cartItems: Map<string, CartItem>;
  private contactRequests: Map<string, ContactRequest>;

  constructor() {
    this.products = new Map();
    this.itServices = new Map();
    this.foodItems = new Map();
    this.cartItems = new Map();
    this.contactRequests = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed Products
    const productsData: InsertProduct[] = [
      {
        name: "Camiseta Premium Algodón Puro",
        description: "Camiseta 100% algodón orgánico, suave y cómoda, disponible en múltiples colores",
        price: "49.99",
        category: "camisetas",
        image: "/api/placeholder/400/300",
        featured: true,
        inStock: true,
      },
      {
        name: "Mochila Urban Backpack XL",
        description: "Mochila espaciosa con múltiples compartimentos, ideal para viajes y trabajo",
        price: "129.99",
        category: "mochilas",
        image: "/api/placeholder/400/300",
        featured: true,
        inStock: true,
      },
      {
        name: "Pantalón Jeans Clásico",
        description: "Pantalón jeans de corte recto, tela resistente y cómoda para el día a día",
        price: "89.99",
        category: "pantalones",
        image: "/api/placeholder/400/300",
        featured: true,
        inStock: true,
      },
      {
        name: "Zapatos Deportivos Running",
        description: "Zapatillas deportivas ligeras con tecnología de amortiguación superior",
        price: "159.99",
        category: "zapatos",
        image: "/api/placeholder/400/300",
        featured: true,
        inStock: true,
      },
      {
        name: "Vestido Casual Elegante",
        description: "Vestido versátil perfecto para eventos casuales y trabajo, tela suave",
        price: "119.99",
        category: "vestidos",
        image: "/api/placeholder/400/300",
        featured: false,
        inStock: true,
      },
      {
        name: "Cinturón de Cuero Auténtico",
        description: "Cinturón de cuero premium con hebilla clásica, durable y elegante",
        price: "59.99",
        category: "accesorios",
        image: "/api/placeholder/400/300",
        featured: false,
        inStock: true,
      },
      {
        name: "Gorra Deportiva Ajustable",
        description: "Gorra de algodón con cierre ajustable, protección UV",
        price: "34.99",
        category: "accesorios",
        image: "/api/placeholder/400/300",
        featured: false,
        inStock: true,
      },
      {
        name: "Bufanda Lana Merino",
        description: "Bufanda de lana merino suave, cálida y transpirable, perfecta para invierno",
        price: "79.99",
        category: "accesorios",
        image: "/api/placeholder/400/300",
        featured: false,
        inStock: true,
      },
    ];

    productsData.forEach(product => this.createProduct(product));

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

  // Products
  async getProducts(category?: string): Promise<Product[]> {
    const productsList = Array.from(this.products.values());
    if (category && category !== "all") {
      return productsList.filter(p => p.category === category);
    }
    return productsList;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    // Filter out undefined values to prevent accidental field clearing
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    ) as Partial<InsertProduct>;
    
    const updatedProduct = { ...product, ...filteredUpdates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
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
