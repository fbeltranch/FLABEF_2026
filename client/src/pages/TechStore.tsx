import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Search, Filter, Star, Check, Package } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, CartItem } from "@shared/schema";
import heroImage from "@assets/generated_images/tech_store_hero_background.png";

const categories = [
  { id: "all", label: "Todos" },
  { id: "camisetas", label: "Camisetas" },
  { id: "pantalones", label: "Pantalones" },
  { id: "mochilas", label: "Mochilas" },
  { id: "zapatos", label: "Zapatos" },
  { id: "vestidos", label: "Vestidos" },
  { id: "accesorios", label: "Accesorios" },
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

  const featuredProducts = products?.filter(p => p.featured).slice(0, 4);

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
            FLABEF Fashion Store
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Ropa y accesorios de calidad
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Colecciones exclusivas con estilo y comodidad para tu día a día
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-hero-catalog"
            >
              Ver Catálogo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              data-testid="button-hero-whatsapp"
            >
              Consultar por WhatsApp
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

      {/* Featured Products - Ofertas del Día */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-destructive text-destructive-foreground">Ofertas del Día</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Las mejores ofertas en ropa y accesorios premium seleccionados especialmente para ti
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover-elevate group" data-testid={`card-featured-${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Badge className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground">
                      Oferta
                    </Badge>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
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
          </div>
        </section>
      )}

      {/* Main Catalog */}
      <section id="catalog" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Catálogo Completo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestras colecciones de ropa y accesorios para todos los estilos y ocasiones
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
    </div>
  );
}
