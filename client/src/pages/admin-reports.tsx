
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, BarChart3, PieChart, TrendingUp } from "lucide-react";

export default function AdminReports() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const reports = [
    {
      id: 1,
      title: "Relatório de Respostas por Região",
      description: "Análise detalhada das respostas coletadas por região geográfica",
      type: "responses",
      icon: BarChart3,
    },
    {
      id: 2,
      title: "Relatório de Performance dos Pesquisadores",
      description: "Desempenho e produtividade dos pesquisadores",
      type: "performance",
      icon: TrendingUp,
    },
    {
      id: 3,
      title: "Relatório Demográfico",
      description: "Distribuição demográfica dos respondentes",
      type: "demographics",
      icon: PieChart,
    },
  ];

  return (
    <div className="min-h-screen flex bg-light-grey">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Relatórios</h2>
              <p className="text-slate-grey">Gere e visualize relatórios das pesquisas</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-election-blue">
                    {isLoading ? "..." : stats?.activeSurveys || 0}
                  </p>
                  <p className="text-sm text-slate-grey">Pesquisas Ativas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success-green">
                    {isLoading ? "..." : stats?.totalResponses || 0}
                  </p>
                  <p className="text-sm text-slate-grey">Total de Respostas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning-amber">
                    {isLoading ? "..." : stats?.activeResearchers || 0}
                  </p>
                  <p className="text-sm text-slate-grey">Pesquisadores Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark-slate">
                    {isLoading ? "..." : `${stats?.completionRate || 0}%`}
                  </p>
                  <p className="text-sm text-slate-grey">Taxa de Conclusão</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports */}
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-election-blue" />
                  Relatórios Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {reports.map((report) => {
                    const Icon = report.icon;
                    return (
                      <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-election-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-election-blue" />
                          </div>
                          <div>
                            <h4 className="font-medium text-dark-slate">{report.title}</h4>
                            <p className="text-sm text-slate-grey">{report.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Visualizar
                          </Button>
                          <Button size="sm" className="bg-election-blue hover:bg-blue-700">
                            <Download className="w-4 h-4 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatórios Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-grey mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-slate mb-2">
                    Crie relatórios personalizados
                  </h3>
                  <p className="text-slate-grey mb-4">
                    Configure filtros específicos e gere relatórios sob medida
                  </p>
                  <Button className="bg-election-blue hover:bg-blue-700">
                    Criar Relatório Customizado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
