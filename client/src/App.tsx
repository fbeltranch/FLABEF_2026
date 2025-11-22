import { useState, useEffect } from "react";
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
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import AdminRegister from "@/pages/AdminRegister";
import ForgotPassword from "@/pages/ForgotPassword";
import ForgotPasswordVerifyDocument from "@/pages/ForgotPasswordVerifyDocument";
import ForgotPasswordSelectMethod from "@/pages/ForgotPasswordSelectMethod";
import ForgotPasswordMethod from "@/pages/ForgotPasswordMethod";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { CartItem } from "@shared/schema";

function Router() {
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesión expirada",
          description: "Por favor inicia sesión nuevamente",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
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

  if (isLoading) {
    return <div className="min-h-screen" />;
  }

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
          {isAuthenticated ? (
            <Route path="/admin-secret-2024" component={AdminDashboard} />
          ) : (
            <Route path="/admin-secret-2024" component={AdminLogin} />
          )}
          <Route path="/admin-secret-2024/register" component={AdminRegister} />
          <Route path="/admin-secret-2024/forgot-password" component={ForgotPassword} />
          <Route path="/admin-secret-2024/forgot-password/verify-document" component={ForgotPasswordVerifyDocument} />
          <Route path="/admin-secret-2024/forgot-password/select-method" component={ForgotPasswordSelectMethod} />
          <Route path="/admin-secret-2024/forgot-password/:method" component={ForgotPasswordMethod} />
          <Route path="/admin-secret-2024/reset-password" component={ResetPassword} />
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
