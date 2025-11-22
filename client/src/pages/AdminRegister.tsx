import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [documentType, setDocumentType] = useState("DNI");
  const [documentNumber, setDocumentNumber] = useState("");
  const [role, setRole] = useState("viewer");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !recoveryEmail || !password || !confirmPassword || !fullName || !documentType || !documentNumber) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (documentType === "DNI" && documentNumber.length !== 8) {
      toast({
        title: "Error",
        description: "El DNI debe tener exactamente 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (documentType !== "DNI" && documentNumber.length === 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu número de documento",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          recoveryEmail,
          password,
          role,
          fullName,
          documentType,
          documentNumber,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Error al registrar admin",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Éxito",
        description: "Admin registrado correctamente",
      });

      setTimeout(() => {
        window.location.href = "/admin-secret-2024";
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al registrar admin",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrar nuevo administrador</CardTitle>
          <CardDescription>Completa el formulario para crear una nueva cuenta de admin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                disabled={isLoading}
                required
                data-testid="input-full-name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email (Login)</Label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@flabef.com"
                disabled={isLoading}
                required
                data-testid="input-email"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="recoveryEmail">Email de Recuperación</Label>
              <input
                id="recoveryEmail"
                type="text"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="recuperacion@flabef.com"
                disabled={isLoading}
                required
                data-testid="input-recovery-email"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email que usarás para recuperar tu contraseña
              </p>
            </div>

            <div>
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Select value={documentType} onValueChange={setDocumentType} disabled={isLoading}>
                <SelectTrigger id="documentType" data-testid="select-document-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                  <SelectItem value="Carnet de Extranjería">Carnet de Extranjería</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="documentNumber">Número de Documento</Label>
              <Input
                id="documentNumber"
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder={documentType === "DNI" ? "12345678" : "ABC123456"}
                disabled={isLoading}
                maxLength={documentType === "DNI" ? 8 : 20}
                required
                data-testid="input-document-number"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {documentType === "DNI" ? "8 caracteres exactos" : "Número según documento"}
              </p>
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
                data-testid="input-password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
                data-testid="input-confirm-password"
              />
            </div>

            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger id="role" data-testid="select-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer (Solo lectura)</SelectItem>
                  <SelectItem value="editor">Editor (Editar contenido)</SelectItem>
                  <SelectItem value="super_admin">Super Admin (Control total)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-register"
            >
              {isLoading ? "Registrando..." : "Registrar Admin"}
            </Button>

            <a href="/admin-secret-2024">
              <Button variant="outline" className="w-full" type="button" data-testid="button-back-to-login">
                Volver al Login
              </Button>
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
