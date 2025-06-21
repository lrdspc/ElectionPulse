
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";

const regionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
});

type RegionForm = z.infer<typeof regionSchema>;

export default function AdminRegions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<any>(null);

  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: regions, isLoading } = useQuery({
    queryKey: ["/api/regions"],
  });

  const form = useForm<RegionForm>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      name: "",
      description: "",
      city: "",
      state: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: RegionForm) => {
      const response = await apiRequest("POST", "/api/regions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regions"] });
      setShowRegionModal(false);
      form.reset();
      toast({
        title: "Região criada",
        description: "A região foi criada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a região",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (regionId: number) => {
      await apiRequest("DELETE", `/api/regions/${regionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regions"] });
      toast({
        title: "Região excluída",
        description: "A região foi excluída com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a região",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: RegionForm) => {
    createMutation.mutate(data);
  };

  const handleDelete = (regionId: number) => {
    if (confirm("Tem certeza que deseja excluir esta região?")) {
      deleteMutation.mutate(regionId);
    }
  };

  return (
    <div className="min-h-screen flex bg-light-grey">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Regiões</h2>
              <p className="text-slate-grey">Gerencie as regiões de pesquisa</p>
            </div>
            <Button 
              className="bg-election-blue hover:bg-blue-700"
              onClick={() => setShowRegionModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Região
            </Button>
          </div>
        </header>

        <main className="p-8">
          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center py-8 text-slate-grey">
                Carregando regiões...
              </div>
            ) : regions?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="w-12 h-12 text-slate-grey mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-slate mb-2">
                    Nenhuma região encontrada
                  </h3>
                  <p className="text-slate-grey mb-4">
                    Comece criando sua primeira região de pesquisa
                  </p>
                  <Button className="bg-election-blue hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Região
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regions?.map((region) => (
                  <Card key={region.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-election-blue" />
                            {region.name}
                          </CardTitle>
                          <p className="text-slate-grey mt-1">{region.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-grey">
                          Criada em: {new Date(region.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
