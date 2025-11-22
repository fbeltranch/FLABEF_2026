import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, ITService, FoodItem } from "@shared/schema";

const productCategories = [
  "camisetas", "pantalones", "mochilas", "zapatos", "vestidos", "accesorios",
  "laptops", "pcs", "monitores", "perifericos", "componentes", "smartphones",
];

const foodCategories = [
  "desayunos", "almuerzos", "snacks", "bebidas", "postres",
];

// ===== PRODUCTOS TECH =====
function ProductsTab() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [categories, setCategories] = useState<string[]>(productCategories);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    inStock: true,
  });
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
      setIsAddOpen(false);
      toast({ title: "Producto creado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo crear el producto", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!editingProduct) throw new Error("No product selected");
      return apiRequest("PUT", `/api/products/${editingProduct.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
      setEditingProduct(null);
      setIsAddOpen(false);
      toast({ title: "Producto actualizado exitosamente" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Producto eliminado" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      inStock: true,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      inStock: product.inStock,
    });
    setIsAddOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast({ title: "Completa los campos obligatorios", variant: "destructive" });
      return;
    }

    if (editingProduct) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setShowNewCategory(false);
    }
  };

  const deleteCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      {/* Gestión de Categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="flex items-center gap-2">
                {cat}
                <button onClick={() => deleteCategory(cat)} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            ))}
          </div>
          {showNewCategory ? (
            <div className="flex gap-2">
              <Input
                placeholder="Nueva categoría"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button onClick={addCategory} size="sm">Agregar</Button>
              <Button onClick={() => setShowNewCategory(false)} size="sm" variant="outline">Cancelar</Button>
            </div>
          ) : (
            <Button onClick={() => setShowNewCategory(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Productos */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Productos</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingProduct(null); }}>
              <Plus className="h-4 w-4 mr-2" /> Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar" : "Nuevo"} Producto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                placeholder="Precio"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="URL de imagen"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <div className="flex items-center justify-between">
                <Label>En Stock</Label>
                <Switch
                  checked={formData.inStock}
                  onCheckedChange={(val) => setFormData({ ...formData, inStock: val })}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
              >
                {editingProduct ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {editingProduct && (
        <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center">
          <span>Editando: <strong>{editingProduct.name}</strong></span>
          <Button variant="ghost" size="sm" onClick={() => { setEditingProduct(null); resetForm(); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
              <p className="text-2xl font-bold text-primary mb-2">S/ {product.price}</p>
              <Badge variant={product.inStock ? "default" : "destructive"}>
                {product.inStock ? "En Stock" : "Agotado"}
              </Badge>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="flex-1">
                <Edit2 className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(product.id)} className="flex-1">
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== SERVICIOS IT =====
function ITServicesTab() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingService, setEditingService] = useState<ITService | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: "",
    icon: "Wrench",
    available: true,
  });
  const { toast } = useToast();

  const { data: services = [], isLoading } = useQuery<ITService[]>({
    queryKey: ["/api/it-services"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/it-services", {
        title: data.title,
        description: data.description,
        features: data.features.split("\n").filter(f => f.trim()),
        icon: data.icon,
        available: data.available,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/it-services"] });
      resetForm();
      setIsAddOpen(false);
      toast({ title: "Servicio creado exitosamente" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!editingService) throw new Error("No service selected");
      return apiRequest("PUT", `/api/it-services/${editingService.id}`, {
        title: data.title,
        description: data.description,
        features: data.features.split("\n").filter(f => f.trim()),
        icon: data.icon,
        available: data.available,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/it-services"] });
      resetForm();
      setEditingService(null);
      setIsAddOpen(false);
      toast({ title: "Servicio actualizado exitosamente" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/it-services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/it-services"] });
      toast({ title: "Servicio eliminado" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      features: "",
      icon: "Wrench",
      available: true,
    });
  };

  const handleEdit = (service: ITService) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      features: service.features.join("\n"),
      icon: service.icon,
      available: service.available,
    });
    setIsAddOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast({ title: "Completa los campos obligatorios", variant: "destructive" });
      return;
    }

    if (editingService) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Servicios IT</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingService(null); }}>
              <Plus className="h-4 w-4 mr-2" /> Agregar Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingService ? "Editar" : "Nuevo"} Servicio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Textarea
                placeholder="Características (una por línea)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
              <Input
                placeholder="Icono (ej: Wrench, Cpu, Shield)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
              <div className="flex items-center justify-between">
                <Label>Disponible</Label>
                <Switch
                  checked={formData.available}
                  onCheckedChange={(val) => setFormData({ ...formData, available: val })}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
              >
                {editingService ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {editingService && (
        <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center">
          <span>Editando: <strong>{editingService.title}</strong></span>
          <Button variant="ghost" size="sm" onClick={() => { setEditingService(null); resetForm(); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              <div className="mb-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Características:</p>
                <ul className="text-sm space-y-1">
                  {service.features.map((f, i) => <li key={i}>• {f}</li>)}
                </ul>
              </div>
              <Badge variant={service.available ? "default" : "destructive"}>
                {service.available ? "Disponible" : "No disponible"}
              </Badge>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(service)} className="flex-1">
                <Edit2 className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(service.id)} className="flex-1">
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== COMIDAS =====
function FoodTab() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [categories, setCategories] = useState<string[]>(foodCategories);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });
  const { toast } = useToast();

  const { data: foods = [], isLoading } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/food-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      resetForm();
      setIsAddOpen(false);
      toast({ title: "Comida agregada exitosamente" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!editingFood) throw new Error("No food selected");
      return apiRequest("PUT", `/api/food-items/${editingFood.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      resetForm();
      setEditingFood(null);
      setIsAddOpen(false);
      toast({ title: "Comida actualizada exitosamente" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/food-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      toast({ title: "Comida eliminada" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      available: true,
    });
  };

  const handleEdit = (food: FoodItem) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: food.image,
      available: food.available,
    });
    setIsAddOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast({ title: "Completa los campos obligatorios", variant: "destructive" });
      return;
    }

    if (editingFood) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setShowNewCategory(false);
    }
  };

  const deleteCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      {/* Gestión de Categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="flex items-center gap-2">
                {cat}
                <button onClick={() => deleteCategory(cat)} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            ))}
          </div>
          {showNewCategory ? (
            <div className="flex gap-2">
              <Input
                placeholder="Nueva categoría"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button onClick={addCategory} size="sm">Agregar</Button>
              <Button onClick={() => setShowNewCategory(false)} size="sm" variant="outline">Cancelar</Button>
            </div>
          ) : (
            <Button onClick={() => setShowNewCategory(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Comidas */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comidas y Menús</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingFood(null); }}>
              <Plus className="h-4 w-4 mr-2" /> Agregar Comida
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingFood ? "Editar" : "Nueva"} Comida</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                placeholder="Precio"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="URL de imagen"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <div className="flex items-center justify-between">
                <Label>Disponible</Label>
                <Switch
                  checked={formData.available}
                  onCheckedChange={(val) => setFormData({ ...formData, available: val })}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
              >
                {editingFood ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {editingFood && (
        <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center">
          <span>Editando: <strong>{editingFood.name}</strong></span>
          <Button variant="ghost" size="sm" onClick={() => { setEditingFood(null); resetForm(); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <Card key={food.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{food.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{food.category}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{food.description}</p>
              <p className="text-2xl font-bold text-primary mb-2">S/ {food.price}</p>
              <Badge variant={food.available ? "default" : "destructive"}>
                {food.available ? "Disponible" : "No disponible"}
              </Badge>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(food)} className="flex-1">
                <Edit2 className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(food.id)} className="flex-1">
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== MAIN ADMIN =====
export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Panel de Administración FLABEF</h1>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Productos Tech</TabsTrigger>
          <TabsTrigger value="it-services">Servicios IT</TabsTrigger>
          <TabsTrigger value="food">Comidas</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-8">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="it-services" className="mt-8">
          <ITServicesTab />
        </TabsContent>

        <TabsContent value="food" className="mt-8">
          <FoodTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
