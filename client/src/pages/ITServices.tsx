import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Wrench, 
  Laptop, 
  HardDrive, 
  Shield, 
  Settings, 
  Monitor, 
  Database, 
  CheckCircle,
  Clock,
  Award,
  Headphones,
  Facebook,
  Instagram,
  MessageCircle
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { ITService } from "@shared/schema";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import heroImage from "@assets/generated_images/it_services_hero_background.png";

const iconMap: Record<string, any> = {
  wrench: Wrench,
  laptop: Laptop,
  hardDrive: HardDrive,
  shield: Shield,
  settings: Settings,
  monitor: Monitor,
  database: Database,
};

export default function ITServices() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery<ITService[]>({
    queryKey: ["/api/it-services"],
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const itHero = settings?.find((s: any) => s.key === "it_hero")?.value || {};
  const heroImageUrl = itHero.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop";

  const contactMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; message: string }) => {
      return apiRequest("POST", "/api/contact", {
        ...data,
        serviceType: "it_service",
      });
    },
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Te contactaremos pronto por WhatsApp",
      });
      setName("");
      setPhone("");
      setMessage("");
      
      // Also open WhatsApp
      const whatsappMessage = `Hola! Soy ${name}. ${message}. Mi teléfono es ${phone}`;
      window.open(`https://wa.me/51925330577?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone && message) {
      contactMutation.mutate({ name, phone, message });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30">
              {itHero.badge || "FLABEF IT Services"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {itHero.title || "Soporte Técnico Profesional 24/7"}
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              {itHero.subtitle || "Soluciones tecnológicas empresariales con garantía y respaldo profesional"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <WhatsAppButton 
                variant="inline"
                text={itHero.cta1Text || "Contactar Ahora"}
              />
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-hero-services"
              >
                {itHero.cta2Text || "Ver Servicios"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: "Atención 24/7", desc: "Siempre disponibles" },
              { icon: Award, title: "Profesionales Certificados", desc: "Equipo experto" },
              { icon: Shield, title: "Garantía de Servicio", desc: "Trabajo respaldado" },
              { icon: Headphones, title: "Soporte Remoto", desc: "Asistencia inmediata" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-3">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Soluciones tecnológicas integrales para empresas y particulares
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service) => {
                const Icon = iconMap[service.icon] || Wrench;
                
                return (
                  <Card key={service.id} className="hover-elevate" data-testid={`card-service-${service.id}`}>
                    <CardHeader>
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{service.description}</p>
                      
                      <div className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <WhatsAppButton 
                        variant="inline"
                        text="Solicitar Servicio"
                        message={`Hola! Me interesa el servicio de ${service.title}`}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">Contacto Directo</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Necesitas Ayuda?</h2>
            <p className="text-muted-foreground">
              Cuéntanos tu problema y te contactaremos inmediatamente por WhatsApp
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nombre</label>
                  <Input
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    data-testid="input-contact-name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Teléfono</label>
                  <Input
                    type="tel"
                    placeholder="Tu número de teléfono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    data-testid="input-contact-phone"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Mensaje</label>
                  <Textarea
                    placeholder="Describe tu problema o consulta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    data-testid="input-contact-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending ? "Enviando..." : "Enviar y Abrir WhatsApp"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer section="it_services" />
    </div>
  );
}

function Footer({ section }: { section: "tech" | "it_services" | "food" }) {
  const { data: footer } = useQuery({
    queryKey: ["/api/footers", section],
    queryFn: async () => {
      const res = await fetch(`/api/footers/${section}`);
      return res.json() as any;
    },
  });

  if (!footer) return null;

  const socialLinks = footer.socialLinks || {};

  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{footer.title}</h3>
            <p className="text-sm text-muted-foreground">{footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">📍 {footer.address}</p>
              <p className="text-muted-foreground">📞 {footer.phone}</p>
              <p className="text-muted-foreground">📧 {footer.email}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <div className="space-y-2 text-sm">
              <a href="/" className="text-muted-foreground hover:text-foreground transition">Inicio</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition" title="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 transition" title="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks.tiktok && (
                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:opacity-70 transition" title="TikTok">
                  <SiTiktok className="h-5 w-5" />
                </a>
              )}
              {socialLinks.whatsapp && (
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition" title="WhatsApp">
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 FLABEF. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
