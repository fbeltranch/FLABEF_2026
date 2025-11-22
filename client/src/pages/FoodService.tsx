import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UtensilsCrossed, Coffee, Clock, ChefHat } from "lucide-react";
import type { FoodItem } from "@shared/schema";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import heroImage from "@assets/generated_images/food_service_hero_dish.png";

const categories = [
  { id: "all", label: "Todo el Menú", icon: UtensilsCrossed },
  { id: "desayunos", label: "Desayunos", icon: Coffee },
  { id: "almuerzos", label: "Almuerzos", icon: ChefHat },
  { id: "snacks", label: "Snacks & Bebidas", icon: Coffee },
];

export default function FoodService() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: menuItems, isLoading } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
  });

  const filteredItems = menuItems?.filter((item) => {
    return selectedCategory === "all" || item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Badge className="mb-6 bg-orange-500/20 text-orange-100 border-orange-400/30">
            FLABEF Food Service
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Sabor Casero para tu Día
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Platos peruanos tradicionales preparados con cariño y frescura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppButton 
              variant="inline"
              text="Hacer Pedido Ahora"
              message="Hola! Me gustaría hacer un pedido de comida"
            />
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-hero-menu"
            >
              Ver Menú
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-orange-50 dark:bg-orange-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ChefHat, title: "Cocina Casera", desc: "Recetas tradicionales peruanas" },
              { icon: Clock, title: "Preparación Diaria", desc: "Ingredientes frescos cada día" },
              { icon: UtensilsCrossed, title: "Porciones Generosas", desc: "Comida abundante y deliciosa" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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

      {/* Menu Section */}
      <section id="menu" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestro Menú</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platos preparados con ingredientes frescos y mucho cariño
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-2"
                  data-testid={`button-category-${cat.id}`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Menu Items Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-video" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover-elevate group" data-testid={`card-food-${item.id}`}>
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {!item.available && (
                      <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                        No Disponible
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      S/ {parseFloat(item.price).toFixed(2)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <WhatsAppButton 
                      variant="inline"
                      text="Pedir por WhatsApp"
                      message={`Hola! Me gustaría pedir: ${item.name} (S/ ${item.price})`}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No hay platos disponibles en esta categoría</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            ¿Tienes hambre?
          </h2>
          <p className="text-xl mb-8 text-orange-50">
            Haz tu pedido ahora y disfruta de auténtica comida casera peruana
          </p>
          <WhatsAppButton 
            variant="inline"
            text="Hacer Pedido por WhatsApp"
            message="Hola! Me gustaría hacer un pedido de comida casera"
          />
        </div>
      </section>
    </div>
  );
}
