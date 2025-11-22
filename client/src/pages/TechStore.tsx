import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Search, Filter, Star, Check, Package, Facebook, Instagram, MessageCircle } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, CartItem } from "@shared/schema";
import heroImage from "@assets/generated_images/tech_store_hero_background.png";

const categories = [
  { id: "all", label: "Todos" },
  // Ropa
  { id: "camisetas", label: "Camisetas" },
  { id: "pantalones", label: "Pantalones" },
  { id: "vestidos", label: "Vestidos" },
  // Accesorios y Mochilas
  { id: "mochilas", label: "Mochilas" },
  { id: "zapatos", label: "Zapatos" },
  { id: "accesorios", label: "Accesorios" },
  // Tecnología
  { id: "laptops", label: "Laptops" },
  { id: "pcs", label: "PCs Armadas" },
  { id: "monitores", label: "Monitores" },
  { id: "perifericos", label: "Periféricos" },
  { id: "componentes", label: "Componentes" },
  { id: "smartphones", label: "Smartphones" },
];

export default function TechStore() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const techHero = settings?.find((s: any) => s.key === "tech_hero")?.value || {};
  const heroImage = techHero.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop";

  const addToCartMutation = useMutation({
    mutationFn: async (product: Product) => {
      const existingItem = cartItems?.find(item => item.productId === product.id);
      
      if (existingItem) {
        return apiRequest("PATCH", `/api/cart/${existingItem.id}`, {
          quantity: existingItem.quantity + 1
        });
      }
      
      return apiRequest("POST", "/api/cart", {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: 1,
        image: product.image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Producto agregado",
        description: "El producto se agregó al carrito correctamente",
      });
    },
  });

  const filteredProducts = products?.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30" data-testid="badge-hero">
            {techHero.badge || "FLABEF Store"}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            {techHero.title || "Todo lo que necesitas en un solo lugar"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {techHero.subtitle || "Ropa, accesorios, mochilas y tecnología de calidad premium"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-hero-catalog"
            >
              {techHero.cta1Text || "Ver Catálogo"}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              data-testid="button-hero-whatsapp"
            >
              {techHero.cta2Text || "Consultar por WhatsApp"}
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Check, title: "Garantía Oficial", desc: "Respaldados por fabricantes" },
              { icon: Star, title: "Asesoría Gratuita", desc: "Expertos a tu disposición" },
              { icon: Package, title: "Envío Seguro", desc: "Entrega rápida y confiable" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Main Catalog */}
      <section id="catalog" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Catálogo Completo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explora nuestras colecciones de ropa, mochilas, accesorios y tecnología para todos tus necesidades
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-products"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex-shrink-0"
                  data-testid={`button-category-${cat.id}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-square" />
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-1/2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover-elevate group" data-testid={`card-product-${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <Badge variant="outline" className="w-fit mb-2 text-xs">
                      {categories.find(c => c.id === product.category)?.label || product.category}
                    </Badge>
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-2xl font-bold text-primary">S/ {parseFloat(product.price).toFixed(2)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => addToCartMutation.mutate(product)}
                      disabled={!product.inStock || addToCartMutation.isPending}
                      data-testid={`button-add-cart-${product.id}`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product.inStock ? "Agregar al Carrito" : "Agotado"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No se encontraron productos</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer section="tech" />
    </div>
  );
}

function Footer({ section }: { section: "tech" | "it_services" | "food" }) {
  const { data: footer } = useQuery({
    queryKey: ["/api/footers", section],
    queryFn: async () => {
      const res = await fetch(`/api/footers/${section}`);
      return res.json() as any;
    },
  });

  if (!footer) return null;

  const socialLinks = footer.socialLinks || {};

  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{footer.title}</h3>
            <p className="text-sm text-muted-foreground">{footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">📍 {footer.address}</p>
              <p className="text-muted-foreground">📞 {footer.phone}</p>
              <p className="text-muted-foreground">📧 {footer.email}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <div className="space-y-2 text-sm">
              <a href="/" className="text-muted-foreground hover:text-foreground transition">Inicio</a>
              <br />
              <a href="/admin" className="text-muted-foreground hover:text-foreground transition">Admin</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition" title="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 transition" title="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks.tiktok && (
                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:opacity-70 transition" title="TikTok">
                  <SiTiktok className="h-5 w-5" />
                </a>
              )}
              {socialLinks.whatsapp && (
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition" title="WhatsApp">
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 FLABEF. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
