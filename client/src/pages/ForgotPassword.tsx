import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [documentNumber, setDocumentNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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
      const res = await fetch("/api/password-reset/verify-document-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentNumber }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Documento no encontrado",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Éxito",
        description: "Documento verificado",
      });

      setTimeout(() => {
        window.location.href = `/admin-secret-2024/forgot-password/select-method?documentNumber=${encodeURIComponent(documentNumber)}`;
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar la solicitud",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu número de documento para recuperar tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="documentNumber">Número de Documento</Label>
              <input
                id="documentNumber"
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="12345678"
                disabled={isLoading}
                required
                data-testid="input-document-number"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1">
                DNI, Pasaporte o Carnet de Extranjería
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-continue"
            >
              {isLoading ? "Verificando..." : "Continuar"}
            </Button>

            <a href="/admin-secret-2024">
              <Button variant="outline" className="w-full" data-testid="button-back-to-login">
                Volver al Login
              </Button>
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
