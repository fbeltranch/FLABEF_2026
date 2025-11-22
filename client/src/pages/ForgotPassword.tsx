import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [method, setMethod] = useState<"email" | "sms">("sms");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = method === "sms" ? "/api/password-reset/request-sms" : "/api/password-reset/request-email";
      const payload = method === "sms" ? { email, phone } : { email };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast({
          title: "Error",
          description: "No se pudo procesar la solicitud",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Éxito",
        description: method === "sms" ? "Código enviado por SMS" : "Código enviado por email",
      });

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
              {method === "sms"
                ? `Verifica tu teléfono ${phone}`
                : `Verifica tu email ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hemos enviado un código de 6 dígitos. Será válido por 15 minutos.
            </p>
            <a href="/admin-secret-2024/reset-password">
              <Button className="w-full" data-testid="button-go-to-reset">
                Ingresar Código
              </Button>
            </a>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSubmitted(false);
                setEmail("");
                setPhone("");
              }}
              data-testid="button-back"
            >
              Atrás
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>¿Olvidaste tu Contraseña?</CardTitle>
          <CardDescription>Elige cómo deseas recibir el código de reseteo</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={method} onValueChange={(v) => setMethod(v as "email" | "sms")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            <form onSubmit={handleRequestReset} className="space-y-4 mt-4">
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

              <TabsContent value="sms" className="space-y-4 mt-0">
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
                  />
                </div>
              </TabsContent>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
                data-testid="button-request-reset"
              >
                {isLoading ? "Enviando..." : "Enviar Código"}
              </Button>
            </form>

            <a href="/admin-secret-2024" className="block mt-4">
              <Button variant="outline" className="w-full" data-testid="button-back-to-login">
                Volver al Login
              </Button>
            </a>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
