import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Just verify email exists in system
      const res = await fetch("/api/password-reset/verify-email-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Email no encontrado",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Éxito",
        description: "Email encontrado",
      });

      // Redirect to document verification
      setTimeout(() => {
        window.location.href = `/admin-secret-2024/forgot-password/verify-document?email=${encodeURIComponent(email)}`;
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

  if (submitted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>¿Olvidaste tu Contraseña?</CardTitle>
          <CardDescription>Ingresa tu email para recuperar tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@flabef.com"
                disabled={isLoading}
                required
                data-testid="input-email"
              />
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
