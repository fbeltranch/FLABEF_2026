import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ForgotPasswordVerifyDocument() {
  const [location] = useLocation();
  const [documentNumber, setDocumentNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchParams = new URLSearchParams(location.split("?")[1]);
  const email = searchParams.get("email") || "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentNumber.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu número de documento",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/password-reset/verify-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, documentNumber }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Documento no válido",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Éxito",
        description: "Documento verificado",
      });

      // Redirect to method selection
      setTimeout(() => {
        window.location.href = `/admin-secret-2024/forgot-password/select-method?email=${encodeURIComponent(email)}&documentNumber=${encodeURIComponent(documentNumber)}`;
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al verificar documento",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verificar Documento</CardTitle>
          <CardDescription>
            Ingresa tu número de documento para recuperar tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="opacity-75"
              />
            </div>

            <div>
              <Label htmlFor="documentNumber">Número de Documento</Label>
              <Input
                id="documentNumber"
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="12345678"
                disabled={isLoading}
                required
                data-testid="input-document-number"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ingresa tu DNI, Pasaporte, Carnet de Extranjería u otro documento
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-verify-document"
            >
              {isLoading ? "Verificando..." : "Verificar Documento"}
            </Button>
          </form>

          <a href="/admin-secret-2024" className="block">
            <Button variant="outline" className="w-full" type="button" data-testid="button-back-to-login">
              Volver al Login
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
