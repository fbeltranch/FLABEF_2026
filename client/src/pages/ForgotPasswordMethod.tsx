import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordMethod() {
  const [location] = useLocation();
  const [email, setEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const { toast } = useToast();

  const isSms = location.includes("/sms");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
    setDocumentNumber(params.get("documentNumber") || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Email no encontrado",
        variant: "destructive",
      });
      return;
    }

    if (isSms && !phone) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu teléfono",
        variant: "destructive",
      });
      return;
    }

    if (!isSms && !recoveryEmail) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email de recuperación",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isSms
        ? "/api/password-reset/request-sms"
        : "/api/password-reset/request-email";
      const payload = isSms 
        ? { email, phone, documentNumber } 
        : { email: recoveryEmail, adminEmail: email, documentNumber };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "No se pudo enviar el código",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      
      toast({
        title: "Éxito",
        description: isSms ? "Código enviado por SMS" : "Código enviado por email",
      });

      // Store code if returned (development mode)
      if (data.code) {
        setRecoveryCode(data.code);
      }

      setSubmitted(true);
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Código Enviado</CardTitle>
            <CardDescription>
              {isSms ? `Verifica tu teléfono ${phone}` : `Verifica tu email ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hemos enviado un código de 6 dígitos. Será válido por 15 minutos.
            </p>

            {recoveryCode && (
              <div className="bg-muted p-4 rounded-md border border-border">
                <p className="text-sm text-muted-foreground mb-2">Tu código es:</p>
                <p className="text-2xl font-bold text-center font-mono" data-testid="text-recovery-code">
                  {recoveryCode}
                </p>
              </div>
            )}

            <a href={`/admin-secret-2024/reset-password?email=${encodeURIComponent(email)}`}>
              <Button className="w-full" data-testid="button-go-to-reset">
                Continuar a Resetear Contraseña
              </Button>
            </a>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSubmitted(false);
                setRecoveryCode("");
                setPhone("");
              }}
              data-testid="button-change-method"
            >
              Cambiar forma de recuperación
            </Button>

            <a href="/admin-secret-2024" className="block">
              <Button variant="ghost" className="w-full" type="button" data-testid="button-back-to-login">
                Volver al Login
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar Contraseña</CardTitle>
          <CardDescription>
            {isSms ? "Ingresa tu número de teléfono" : "Un código será enviado a tu email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSms ? (
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+51 999 888 777"
                  disabled={isLoading}
                  data-testid="input-phone"
                  required
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="recoveryEmail">Email para recibir el código</Label>
                <Input
                  id="recoveryEmail"
                  type="text"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="tu.email@ejemplo.com"
                  disabled={isLoading}
                  autoFocus
                  data-testid="input-recovery-email"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ingresa tu email de recuperación registrado
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-send-code"
            >
              {isLoading ? "Enviando..." : "Enviar Código"}
            </Button>
          </form>

          <a href="/admin-secret-2024/forgot-password/select-method" className="block">
            <Button variant="outline" className="w-full" type="button" data-testid="button-back">
              Atrás
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
