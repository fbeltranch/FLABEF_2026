import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  variant?: "floating" | "inline";
  text?: string;
}

export function WhatsAppButton({ 
  phoneNumber = "925330577", 
  message = "Hola, me gustaría obtener más información",
  variant = "floating",
  text = "Consultar por WhatsApp"
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/51${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  if (variant === "floating") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        data-testid="button-whatsapp-floating"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#25D366] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse" />
          <Button
            size="icon"
            className="relative h-16 w-16 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-8 w-8" />
          </Button>
        </div>
      </a>
    );
  }
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="button-whatsapp-inline"
    >
      <Button className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold gap-2">
        <MessageCircle className="h-5 w-5" />
        {text}
      </Button>
    </a>
  );
}
