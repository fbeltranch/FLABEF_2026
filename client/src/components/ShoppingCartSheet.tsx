import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import type { CartItem } from "@shared/schema";
import { WhatsAppButton } from "./WhatsAppButton";

interface ShoppingCartSheetProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function ShoppingCartSheet({ 
  open, 
  onClose, 
  items,
  onUpdateQuantity,
  onRemoveItem
}: ShoppingCartSheetProps) {
  const total = items.reduce((sum, item) => {
    return sum + (parseFloat(item.productPrice) * item.quantity);
  }, 0);

  const generateWhatsAppMessage = () => {
    const itemsList = items.map(item => 
      `• ${item.productName} x${item.quantity} - S/ ${(parseFloat(item.productPrice) * item.quantity).toFixed(2)}`
    ).join('\n');
    
    return `Hola! Me gustaría hacer un pedido:\n\n${itemsList}\n\nTotal: S/ ${total.toFixed(2)}`;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
            <p className="text-muted-foreground text-sm">
              Agrega productos de nuestro catálogo tecnológico
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-4 rounded-lg border bg-card hover-elevate"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-20 w-20 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate mb-1">
                        {item.productName}
                      </h4>
                      <p className="text-sm font-semibold text-primary mb-2">
                        S/ {parseFloat(item.productPrice).toFixed(2)}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 border rounded-md">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 text-sm font-medium min-w-[2rem] text-center" data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => onRemoveItem(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary" data-testid="text-cart-total">S/ {total.toFixed(2)}</span>
              </div>
              
              <WhatsAppButton 
                variant="inline"
                text="Finalizar Pedido por WhatsApp"
                message={generateWhatsAppMessage()}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
