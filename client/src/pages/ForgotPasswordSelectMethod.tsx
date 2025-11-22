import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordSelectMethod() {
  const [location] = useLocation();
  
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const documentNumber = searchParams.get("documentNumber") || "";

  const handleSmsClick = () => {
    window.location.href = `/admin-secret-2024/forgot-password/sms?documentNumber=${encodeURIComponent(documentNumber)}`;
  };

  const handleEmailClick = () => {
    window.location.href = `/admin-secret-2024/forgot-password/email?documentNumber=${encodeURIComponent(documentNumber)}`;
  };

  const handleBack = () => {
    window.location.href = `/admin-secret-2024/forgot-password`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Elige método de recuperación</CardTitle>
          <CardDescription>Selecciona cómo quieres recibir el código</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full" 
            data-testid="button-recovery-sms"
            onClick={handleSmsClick}
          >
            Recibir por SMS
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            data-testid="button-recovery-email"
            onClick={handleEmailClick}
          >
            Recibir por Email
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={handleBack}
            data-testid="button-back"
          >
            Atrás
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
