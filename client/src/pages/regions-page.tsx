
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Users, BarChart3 } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";

export default function RegionsPage() {
  const regions = [
    {
      id: 1,
      name: "Centro",
      description: "Região central da cidade",
      coordinates: "[-23.5505, -46.6333]",
      activeResearchers: 3,
      completedSurveys: 45,
      pendingSurveys: 12
    },
    {
      id: 2,
      name: "Zona Norte",
      description: "Bairros da zona norte",
      coordinates: "[-23.5205, -46.6033]",
      activeResearchers: 2,
      completedSurveys: 28,
      pendingSurveys: 8
    },
    {
      id: 3,
      name: "Zona Sul",
      description: "Bairros da zona sul",
      coordinates: "[-23.5805, -46.6633]",
      activeResearchers: 4,
      completedSurveys: 52,
      pendingSurveys: 15
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
              <h1 className="text-3xl font-bold text-dark-slate">Regiões</h1>
              <p className="text-slate-grey mt-2">Gerencie as regiões de pesquisa</p>
            </div>
            <Button className="bg-election-blue hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Região
            </Button>
          </div>

          {/* Regions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Card key={region.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-election-blue rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-dark-slate">{region.name}</CardTitle>
                      <CardDescription>{region.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-election-blue mr-1" />
                      </div>
                      <div className="text-2xl font-bold text-dark-slate">{region.activeResearchers}</div>
                      <div className="text-xs text-slate-grey">Pesquisadores</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <BarChart3 className="w-4 h-4 text-success-green mr-1" />
                      </div>
                      <div className="text-2xl font-bold text-dark-slate">{region.completedSurveys}</div>
                      <div className="text-xs text-slate-grey">Concluídas</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className="text-warning-orange">
                      {region.pendingSurveys} pendentes
                    </Badge>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
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
