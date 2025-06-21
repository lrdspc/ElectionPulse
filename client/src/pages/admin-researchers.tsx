
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Eye, Edit, Trash2 } from "lucide-react";

export default function AdminResearchers() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: researchers, isLoading } = useQuery({
    queryKey: ["/api/researchers"],
  });

  return (
    <div className="min-h-screen flex bg-light-grey">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Pesquisadores</h2>
              <p className="text-slate-grey">Gerencie os pesquisadores do sistema</p>
            </div>
            <Button className="bg-election-blue hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Pesquisador
            </Button>
          </div>
        </header>

        <main className="p-8">
          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center py-8 text-slate-grey">
                Carregando pesquisadores...
              </div>
            ) : researchers?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-grey mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-slate mb-2">
                    Nenhum pesquisador encontrado
                  </h3>
                  <p className="text-slate-grey mb-4">
                    Comece criando o primeiro pesquisador
                  </p>
                  <Button className="bg-election-blue hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Pesquisador
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {researchers?.map((researcher) => (
                  <Card key={researcher.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            <Users className="w-5 h-5 mr-2 text-success-green" />
                            {researcher.name}
                          </CardTitle>
                          <p className="text-slate-grey mt-1">{researcher.email}</p>
                          <p className="text-sm text-slate-grey">@{researcher.username}</p>
                        </div>
                        <Badge className="bg-success-green text-white">
                          Pesquisador
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-grey">
                          Criado em: {new Date(researcher.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
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
