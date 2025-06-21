
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";

export default function SurveysPage() {
  const surveys = [
    {
      id: 1,
      title: "Pesquisa Eleitoral Municipal 2024",
      description: "Pesquisa sobre intenção de voto para prefeito",
      status: "active",
      responses: 156,
      regions: 3,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Avaliação de Serviços Públicos",
      description: "Pesquisa sobre qualidade dos serviços municipais",
      status: "draft",
      responses: 0,
      regions: 0,
      createdAt: "2024-01-20"
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
              <h1 className="text-3xl font-bold text-dark-slate">Pesquisas</h1>
              <p className="text-slate-grey mt-2">Gerencie todas as pesquisas eleitorais</p>
            </div>
            <Button className="bg-election-blue hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Pesquisa
            </Button>
          </div>

          {/* Surveys Grid */}
          <div className="grid gap-6">
            {surveys.map((survey) => (
              <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-dark-slate">{survey.title}</CardTitle>
                      <CardDescription className="mt-2">{survey.description}</CardDescription>
                    </div>
                    <Badge 
                      variant={survey.status === 'active' ? 'default' : 'secondary'}
                      className={survey.status === 'active' ? 'bg-success-green' : ''}
                    >
                      {survey.status === 'active' ? 'Ativo' : 'Rascunho'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-6 text-sm text-slate-grey">
                      <span>{survey.responses} respostas</span>
                      <span>{survey.regions} regiões</span>
                      <span>Criado em {new Date(survey.createdAt).toLocaleDateString('pt-BR')}</span>
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
        </div>
      </div>
    </div>
  );
}
