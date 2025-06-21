
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User, MapPin, BarChart3, Clock } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";

export default function ResearchersPage() {
  const researchers = [
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@example.com",
      username: "researcher",
      status: "active",
      assignedRegions: ["Centro", "Zona Norte"],
      completedSurveys: 23,
      pendingSurveys: 5,
      lastActivity: "2024-01-20"
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@example.com",
      username: "joao_pesquisador",
      status: "active",
      assignedRegions: ["Zona Sul"],
      completedSurveys: 18,
      pendingSurveys: 3,
      lastActivity: "2024-01-19"
    },
    {
      id: 3,
      name: "Ana Costa",
      email: "ana@example.com",
      username: "ana_costa",
      status: "inactive",
      assignedRegions: [],
      completedSurveys: 12,
      pendingSurveys: 0,
      lastActivity: "2024-01-15"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark-slate">Pesquisadores</h1>
              <p className="text-slate-grey mt-2">Gerencie a equipe de pesquisadores</p>
            </div>
            <Button className="bg-election-blue hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Pesquisador
            </Button>
          </div>

          {/* Researchers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchers.map((researcher) => (
              <Card key={researcher.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-election-blue text-white text-lg">
                        {researcher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-dark-slate">{researcher.name}</CardTitle>
                      <CardDescription>{researcher.email}</CardDescription>
                    </div>
                    <Badge 
                      variant={researcher.status === 'active' ? 'default' : 'secondary'}
                      className={researcher.status === 'active' ? 'bg-success-green' : ''}
                    >
                      {researcher.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <BarChart3 className="w-4 h-4 text-success-green mr-1" />
                      </div>
                      <div className="text-2xl font-bold text-dark-slate">{researcher.completedSurveys}</div>
                      <div className="text-xs text-slate-grey">Concluídas</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-warning-orange mr-1" />
                      </div>
                      <div className="text-2xl font-bold text-dark-slate">{researcher.pendingSurveys}</div>
                      <div className="text-xs text-slate-grey">Pendentes</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-grey">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {researcher.assignedRegions.length > 0 
                          ? researcher.assignedRegions.join(', ')
                          : 'Nenhuma região atribuída'
                        }
                      </span>
                    </div>
                    <div className="text-xs text-slate-grey">
                      Última atividade: {new Date(researcher.lastActivity).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Perfil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
