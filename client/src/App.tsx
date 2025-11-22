import { useState } from "react";
import { Switch, Route } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ShoppingCartSheet } from "@/components/ShoppingCartSheet";
import TechStore from "@/pages/TechStore";
import ITServices from "@/pages/ITServices";
import FoodService from "@/pages/FoodService";
import NotFound from "@/pages/not-found";
import type { CartItem } from "@shared/schema";

function Router() {
  const [cartOpen, setCartOpen] = useState(false);

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartItemCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
      />
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={TechStore} />
          <Route path="/it-services" component={ITServices} />
          <Route path="/food" component={FoodService} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <ShoppingCartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(itemId, quantity) => updateQuantityMutation.mutate({ itemId, quantity })}
        onRemoveItem={(itemId) => removeItemMutation.mutate(itemId)}
      />

      <WhatsAppButton variant="floating" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
